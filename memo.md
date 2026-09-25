# Databricks DEA 学習メモ（疑問・要点）

> 用途：勉強中に出た「わからなかった点」を主題ごとに要点だけ残す個人メモ。
> 方針：流水账ではなく **総括式**（同じ主題は都度上書き・追記して1か所にまとめる）。
> 錯題そのものは練習アプリ（quiz_stats）が管理するので、ここには書かない。
> 最終更新：2026-09-25

---

## 0. 受験・考纲

- **対象は 2026-05-04 改定の新版**（7領域）。旧版問題集は避ける。
- 报名：**Webassessor**（webassessor.com/databricks）。**$200**、45問/90分、**日本語可**、オンライン監考 or 会場、有効2年。
- 名前は証件と完全一致で登録（監考で照合）。
- **旧版→新版で消えた**：Lakehouse Federation、Delta Sharing、Databricks Connect、Notebooks 単独。
- **改称（新版の用語）**：Asset Bundles→**Automation Bundle / Declarative Automation Bundle**、DLT→**Lakeflow 宣言型パイプライン（LDP）**、Repos→**Git フォルダ**、Jobs→**Lakeflow Jobs**。
- 優先度：**PySpark/SQL のデータ操作 ＞ Databricks コマンド構文 ＞ Python 言語そのものの構文**（`==`等は低優先）。

## 1. カタカナ用語（読めなくて詰まったもの）

| カタカナ | 意味 |
|---|---|
| コマンドラインインターフェース | CLI（`databricks` コマンド） |
| ソフトウェア開発キット | SDK（API を呼ぶライブラリ） |
| アセットバンドル | Asset Bundle（YAML+Git で何をデプロイするか定義） |
| デプロイ / デプロイメント | deploy（ワークスペースへ反映） |
| オーケストレーション | orchestration（Lakeflow Jobs の編成） |
| リキッドクラスタリング | Liquid Clustering |
| カーディナリティ | cardinality（列の異なる値の数） |
| ネスト | nested（入れ子・嵌套） |
| スキュー | skew（データ偏り） |
| スピル | spill（メモリ溢れ→ディスク退避） |
| スポット / プリエンプティブル | 余剰VMを安く使う（回収されうる） |

## 2. コンピュート（一番混ざる所）

- **SQL ウェアハウスの2軸**（別物）：
  - **サイズ（T-shirt size）= scale up**：単クエリが遅い / データ大 のとき。
  - **クラスタ数（min–max）= scale out**：多人同時で **キューイング（排队）** のとき。
  - 判定：**瓶颈が「1クエリ」か「並發数」か**。「1クエリのデータ量は変わらない」なら並發問題→**クラスタ数**。
- **自動スケーリング vs クラスタープール**（両方VM系で混同注意）：
  - 自動スケーリング＝運行中に**worker数を自動増減**（負荷が波打つとき）。
  - クラスタープール＝**起動を速める**（アイドルVM事前確保、起動待ち対策）。頻繁起動 or 起動遅い時。
  - 判定：**worker数が変わる=スケーリング / 起動が遅い=プール**。
- **アクセスモード**（クラスタの属性）：**共有=Standard（旧Shared、多人共用+UC）** / **専用=Dedicated（旧Single user、ML Runtime・特殊ライブラリ・サービスプリンシパル）**。
  - ⚠️ **「サーバーレス」はアクセスモードではない**（計算タイプ）。選択肢に混じったら除外。
- **Spot vs On-demand**：耐障害バッチは **worker=Spot（安い・任务可重调）/ driver=On-demand（1つしかない大脳、失うと全崩）**。
- **コンピュート選定の早見**：
  - 対話・共同開発→**汎用(All-purpose)** / 定時ETL低コスト→**Job / サーバーレスジョブ** / BI多人SQL→**サーバーレスSQLウェアハウス**。
  - 小・頻繁・臨時・即停→**サーバーレス**が第一候補（新版の既定路線）。classic しか無理な時だけ pool。

## 3. コマンド構文（丟分の主戦場・1語違いで不正解）

- **COPY INTO**：`COPY INTO 表 FROM '路径' FILEFORMAT = 形式 [FORMAT_OPTIONS(...)] [COPY_OPTIONS(...)]`
  - **FORMAT_OPTIONS = ファイルの読み方**（header, delimiter）／**COPY_OPTIONS = コピー動作**（`mergeSchema`スキーマ進化、`force`既処理も再取り込み）。
  - `COPY INTO 表 SELECT ...` は不可（`FROM '路径'` が要る／転換は `FROM (SELECT ...)`）。
- **OPTIMIZE / VACUUM は `TABLE` を付けない（裸表名）**：`OPTIMIZE t [WHERE 条件] ZORDER BY (列)` / `VACUUM t RETAIN 168 HOURS`（単位は **HOURS のみ**）。ZORDER には **BY 必須**。
- **CREATE**：`DATABASE`作成に **`DELTA` キーワードは無い**（`IF NOT EXISTS` + `LOCATION`）。テーブル形式は **`USING DELTA`**（省略可・既定Delta）。`CREATE DELTA TABLE`/`FORMAT DELTA` は誤り。DATABASE=SCHEMA 同義。
- **MERGE**：`MERGE INTO tgt USING src ON 条件 WHEN MATCHED THEN UPDATE... WHEN NOT MATCHED THEN INSERT...`（`INTO`・`ON`・`THEN` 必須）。
- **CDF 読み出し**：`SELECT * FROM table_changes('t', 開始[, 終了])`（版号 or タイムスタンプ）。`VERSION AS OF` は時間トラベル（差分でない）。`CHANGES SINCE`/`read_change_feed` は無い。
- **時間トラベル/巻き戻し**：`SELECT ... VERSION AS OF 5` / `RESTORE TABLE t TO VERSION AS OF 5`。
- **CLONE**：`DEEP CLONE`=データも独立コピー / `SHALLOW CLONE`=メタのみ（元に依存）。
- **UC 細粒度**：列マスク `ALTER TABLE t ALTER COLUMN c SET MASK f` ／ 行フィルタ `ALTER TABLE t SET ROW FILTER f ON (列)`。どちらも **SET（ADD ではない）**。
- **UC 権限**：`GRANT`（付与）/`REVOKE`（取消・継承は残りうる）/**`DENY`（明示拒否・継承より優先）**。下位使用に `USE CATALOG`/`USE SCHEMA` も要る（階層）。
- **tag**：`ALTER ... SET TAGS (...)` は **UC データ対象（table/列/schema/catalog）専用**。**job の tag は SQL 不可**（UI/API/YAML の設定、用途は課金分類）。
- **job の可視性**は **tag ではなく権限（ACL：CAN VIEW 等）** で制御。
- **catalog 切替**：SQL は `USE CATALOG name;`（セッション級）。job既定 catalog はタスク設定（SQLではない）。

## 4. 取り込み（Ingestion）

- **Auto Loader** は **Structured Streaming の上に建つ source**（`spark.readStream.format("cloudFiles")`、format名は **`cloudFiles`** キャメルケース）。増分処理エンジン＝Structured Streaming。**checkpoint は進捗記録（エンジンではない）**。
- ファイル検知：**directory listing（既定）** vs **file notification（超大量ファイルで低コスト）**。
- **使い分け**：Auto Loader/COPY INTO＝**クラウドストレージのファイル**（Auto Loader=継続大量・スキーマ進化、COPY INTO=周期バッチ・べき等スキップ）／**Lakeflow Connect＝SaaS・RDB 等の企業ソース**（マネージド/標準コネクタ、コード不要）。
- **read vs readStream**：バッチ=`spark.read`、ストリーム=`spark.readStream`（`.stream` メソッドや `"stream"` format は無い）。書込みも `write` / `writeStream`。
- **ネスト参照**：STRUCT（構造化済）→ **dot** `col.field.sub` ／ STRING の生JSON → **colon** `col:field` or `from_json`/`get_json_object` ／ **配列(ARRAY)** → `explode` で行展開。

## 5. 変換・監視・最適化

- **カーディナリティ**：**低カーディナリティ→パーティション** / **高カーディナリティ→ CLUSTER BY（Liquid Clustering）or ZORDER**（分区にすると小ファイル乱立）。
- **ZORDER は今も有効**（構文は照考）。ただし**新表は Liquid Clustering（`CLUSTER BY`）推奨**。同一表は分区+ZORDER か Liquid の二者択一。
  - 「正しい構文は？」→ ZORDER で可 / 「新表に推奨は？」かつ CLUSTER BY 選択肢あり→ Liquid Clustering。
- **OOM の切り分け**：`collect()`/`toPandas()` → **Driver OOM**（駆動端に集約）／ skew・巨大partition・shuffle・broadcast・UDF大対象 → **Executor OOM**（実行端で膨張）。broadcast は両方あり得る。
- **Spark UI 症状**：タスク時間が偏る=**スキュー** / Spill 大=**メモリ不足** / 小ファイル多数=**スモールファイル問題（OPTIMIZE）**。
- **ビューのスコープ**：TEMP VIEW（自セッションのみ）＜ GLOBAL TEMP VIEW（同クラスタ全セッション・非永続・global_temp）＜ VIEW（永続）。MV/テーブルは物理保存。
- **union**：Spark の `.union()` は **UNION ALL 挙動（重複保持・列位置）**。重複除去は `.union().distinct()`、列名で揃えるなら `unionByName`。
- **集計**：ユニーク数=`count_distinct`、超大規模で速度優先=`approx_count_distinct`。
- **Gold 層**：都度計算=View / 実体化+増分=**Materialized View** / 追記増分取り込み=Streaming Table。

## 6. Lakeflow Jobs / CI-CD

- **run if（依存条件）**：`ALL_SUCCESS`（全成功・**skip不可**）/`NONE_FAILED`（失敗ゼロ・**skip許容**）/`ALL_DONE`（成否問わず・通知向け）/`AT_LEAST_ONE_SUCCESS`/`AT_LEAST_ONE_FAILED`。
- **トリガー**：スケジュール(Cron) / **ファイル到着**（不定時の到着）/ **テーブル更新** / 連続。
- **修復実行(Repair run)**：失敗タスク以降だけ再実行（成功分は再計算しない）。
- **バンドル基本フロー**：`validate`（検証）→ `deploy`（反映）→ `run`（実行）。`-t/--target` で環境。**deploy=反映、run=実行**。
- **バンドル vs CLI**：バンドル＝「何をデプロイするか（YAML+Git）」、CLI＝「それをデプロイ/実行する道具」。

## 7. 出題パターン（引っかけ）

- **「最も効果が薄い / 関係が薄い」**を問う問題 → 答えは **性能・メモリ・権限と無関係な選択肢**（テーブル名・文字種・命名 など）。実効策と見分ける。
- **boolean は直接 `if flag:`**。`== True` は非推奨、`== "True"`（文字列比較）は**常に False で誤り**。
- **比較は `==`、代入は `=`**。

---

## メモの育て方
新しく「わからなかった点」が出たら、上の該当セクションに1行で要点を追記/上書き（同じ主題は1か所に集約）。過程や日付ログは残さず、完成形の要点だけにする。
