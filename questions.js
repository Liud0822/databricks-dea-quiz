/* =============================================================================
 * Databricks Certified Data Engineer Associate 問題バンク【新題型版 v2】
 * 対象: 2026年5月4日 改定版（7領域）
 *
 * 本番の出題スタイルに寄せた版：
 *   - すべて4択（本番同様）
 *   - 「どれも部分的に正しい→最適はどれか」の判断型を中心に
 *   - コードは"読む"（出力/挙動/エラー原因）＋空欄穴埋め
 *   - データ表を見て答えるシナリオも含む
 * 選択肢は表示時に毎回シャッフルされるため answer の位置は固定でなくてよい。
 * 解説は選択肢の記号（A/B…）を参照せず内容で説明する。
 * ========================================================================== */

window.DOMAIN_LABELS = {
  platform:       "Databricks Intelligence Platform（基礎）",
  ingestion:      "データ取り込み（Ingestion & Loading）",
  transformation: "変換・モデリング（Transformation & Modeling）",
  jobs:           "Lakeflow Jobs（オーケストレーション）",
  cicd:           "CI/CD（Automation Bundle・Git）",
  monitoring:     "監視・トラブルシューティング・最適化",
  governance:     "ガバナンス・セキュリティ"
};

window.QUESTION_BANK = [

  /* ===== Platform ===== */
  {
    id: 201, domain: "platform",
    question: "あるジョブは処理の途中で負荷が大きく変動し、固定ワーカー数だと足りない時と余る時がある。負荷に応じてワーカー数を自動で増減させたい。最適なのはどれか。",
    options: ["クラスターの自動スケーリング（min〜max ワーカー）を有効化する","クラスタープールを使う","ドライバを大型インスタンスにする","Photon を有効化する"],
    answer: 0,
    explanation: "運行中に負荷へ合わせて worker 数を増減させるのは自動スケーリング（min〜max）。クラスタープールは起動待ちの短縮策で worker 数の増減ではない。ドライバ大型化や Photon は負荷変動への自動対応ではない。",
    concept: "自動スケーリング＝worker 数を負荷に応じ動的に増減／クラスタープール＝アイドルVM事前確保で起動を速める。『増減＝スケーリング、起動＝プール』。"
  },
  {
    id: 202, domain: "platform",
    question: "1人のデータエンジニアが、共有アクセスモードでは未サポートのライブラリを使って対話的に開発したい。Unity Catalog 下で適切なクラスター構成はどれか。",
    options: ["シングルユーザー（専用/Dedicated）アクセスモードの All-purpose クラスター","共有（Standard）アクセスモードのクラスター","SQL ウェアハウス","分離なし（No isolation）クラスター"],
    answer: 0,
    explanation: "共有モードで未対応の機能・ライブラリを使う／特定ユーザー専有で対話開発するならシングルユーザー（専用）アクセスモード。共有は複数ユーザー向けで一部機能に制約、SQL ウェアハウスは SQL/BI 用、No isolation は UC 非対応で非推奨。",
    concept: "アクセスモード：共有/Standard（複数人・各自ID・UC適用）／専用/Dedicated（1ユーザー or 1SP・フル機能）。ML ランタイムや未対応ライブラリは専用。"
  },

  /* ===== Ingestion ===== */
  {
    id: 203, domain: "ingestion",
    question: "次のコードはストリーミング読み取りのつもりだがエラーになる。正しく直すにはどこを変えるか。\n\ndf = (spark.read\n        .format('cloudFiles')\n        .option('cloudFiles.format','json')\n        .load(src))",
    options: ["spark.read を spark.readStream に変える","format('cloudFiles') を format('stream') に変える","load を loadStream に変える","spark.read の後に .stream() を足す"],
    answer: 0,
    explanation: "ストリーミング読み取りの入口は spark.readStream。spark.read はバッチ用。'stream' という format や loadStream/.stream() というメソッドは存在せず、format は cloudFiles のままでよい。",
    concept: "バッチ＝spark.read／ストリーム＝spark.readStream。Auto Loader は readStream＋format('cloudFiles')。"
  },
  {
    id: 204, domain: "ingestion",
    question: "COPY INTO で、新しく増えた列が来てもエラーにせず宛先テーブルのスキーマを自動拡張したい。空欄に入るのはどれか。\n\nCOPY INTO t FROM 's3://b/p' FILEFORMAT = JSON\nCOPY_OPTIONS ('____' = 'true')",
    options: ["mergeSchema","force","overwriteSchema","evolveSchema"],
    answer: 0,
    explanation: "スキーマ自動拡張は mergeSchema（COPY_OPTIONS 側）。force は既処理ファイルの再取り込み用でスキーマ拡張はしない。overwriteSchema / evolveSchema は COPY INTO のオプションとして存在しない。",
    concept: "COPY_OPTIONS：mergeSchema（列追加）／force（再取り込み）。ファイルの読み方は FORMAT_OPTIONS 側。"
  },
  {
    id: 205, domain: "ingestion",
    question: "取り込み先フォルダを対象に同じ COPY INTO を昨日実行済み。今日、新規ファイルが無い状態でもう一度同じ COPY INTO を実行した。結果はどうなるか。",
    options: ["取り込み済みファイルはスキップされ、追加される行は無い","全ファイルが再取り込みされ行が重複する","エラーで停止する","宛先テーブルが空になる"],
    answer: 0,
    explanation: "COPY INTO は取り込み済みファイルを追跡してスキップする（べき等）。再実行しても新規が無ければ何も追加されない。重複や全消去にはならない。あえて再取り込みするには COPY_OPTIONS('force'='true')。",
    concept: "COPY INTO のべき等性：一度ロードしたファイルは記録しスキップ。周期バッチ向き。"
  },
  {
    id: 206, domain: "ingestion",
    question: "Salesforce や SQL Server などの企業ソースから、コネクタ設定だけで Unity Catalog 管理テーブルへ取り込みたい（ストリーミングコードは書きたくない）。最適なのはどれか。",
    options: ["Lakeflow Connect のマネージドコネクタ","Auto Loader（cloudFiles）","COPY INTO","Databricks Connect"],
    answer: 0,
    explanation: "SaaS/RDB からコード無しで UC へ取り込むのは Lakeflow Connect（マネージド/標準コネクタ）。Auto Loader と COPY INTO はクラウドストレージ上のファイル用、Databricks Connect は開発接続で取り込みエンジンではない。",
    concept: "ファイル＝Auto Loader/COPY INTO／企業ソース（SaaS・DB）＝Lakeflow Connect。"
  },
  {
    id: 207, domain: "ingestion",
    question: "Auto Loader の取り込み元ディレクトリに膨大なファイルがあり、ディレクトリ一覧の走査が高コストになっている。検知を低コスト化する設定はどれか。",
    options: ["ファイル通知（file notification）モードを使う","ディレクトリ一覧のまま並列度を上げる","COPY INTO に切り替える","チェックポイントを削除する"],
    answer: 0,
    explanation: "大量ファイルではファイル通知モード（クラウドの通知＋キュー）が一覧走査を避けて低コスト・低レイテンシ。並列度調整や COPY INTO 切替は解決にならず、チェックポイント削除は進捗（重複排除）を壊す。",
    concept: "Auto Loader 検知：directory listing（既定・小中規模）／file notification（超大量で効率的）。"
  },
  {
    id: 208, domain: "ingestion",
    question: "取り込み時に data が STRUCT 型（data.address.city のようにネスト）になった。ネストの city を参照する式の空欄に入るのはどれか。\n\nSELECT data____city FROM t",
    options: [".address.",":address:","['address'].","->address->"],
    answer: 0,
    explanation: "STRUCT のネストはドット記法 data.address.city で参照する。コロン記法（data:address）は STRING に入った生JSON用。角括弧やアロー記法は Databricks SQL のネスト参照構文ではない。",
    concept: "STRUCT＝ドット `.`／STRING の生JSON＝コロン `:` or from_json／配列＝explode。"
  },

  /* ===== Transformation ===== */
  {
    id: 209, domain: "transformation",
    question: "次の orders を order_date ごとに集計し、日次の売上合計と『ユニークな注文数（order_id の重複なし件数）』を出す。\n\norder_id | order_date | amount\n1001     | 2024-03-01 | 1500\n1002     | 2024-03-01 | 3000\n1001     | 2024-03-01 | 1500\n2001     | 2024-03-02 |  500\n\n2024-03-01 の『売上合計 / ユニーク注文数』の正しい組み合わせはどれか。",
    options: ["6000 / 2","6000 / 3","4500 / 2","4500 / 3"],
    answer: 0,
    explanation: "売上合計は sum(amount)＝1500+3000+1500＝6000。ユニーク注文数は count_distinct(order_id)＝{1001,1002} で 2（重複行の 1001 は1件と数える）。count（重複込み）だと 3 になってしまうのが引っかけ。",
    concept: "count＝重複込み件数／count_distinct＝重複を除いたユニーク数／approx_count_distinct＝近似・大規模高速。『ユニーク』は count_distinct。"
  },
  {
    id: 210, domain: "transformation",
    question: "次の DataFrame df（2行）で items は配列。explode で展開すると何行になるか。\n\nid | items\n1  | [a, b]\n2  | [x, y, z]\n\ndf.select('id', explode('items'))",
    options: ["5 行","2 行","3 行","6 行"],
    answer: 0,
    explanation: "explode は配列の各要素を1行に展開する。[a,b]→2行、[x,y,z]→3行 で合計 5 行。行数は各配列の要素数の合計になる。",
    concept: "explode(配列)＝要素ごとに1行へ展開。空配列は explode だと消える（残すなら explode_outer）。"
  },
  {
    id: 211, domain: "transformation",
    question: "次の MERGE が syntax error になる。原因はどれか。\n\nMERGE INTO tgt t USING src s ON t.id = s.id\nWHEN MATCHED UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *",
    options: ["WHEN MATCHED の後に THEN が無い","USING ではなく FROM を使うべき","ON ではなく WHERE を使うべき","MERGE に INTO は不要"],
    answer: 0,
    explanation: "各 WHEN 句には THEN が必要（WHEN MATCHED THEN UPDATE …）。USING・ON・INTO はいずれも正しい書き方で、THEN 抜けが原因。",
    concept: "MERGE INTO … USING … ON 条件 WHEN MATCHED THEN UPDATE|DELETE / WHEN NOT MATCHED THEN INSERT。各 WHEN に THEN 必須。"
  },
  {
    id: 212, domain: "transformation",
    question: "Gold 層で、複数テーブルを結合・集計した結果を実体化し、ソース更新に応じて増分再計算させたい。最適なオブジェクトはどれか。",
    options: ["マテリアライズドビュー","通常のビュー","一時ビュー","ストリーミングテーブル"],
    answer: 0,
    explanation: "結果を実体化し増分再計算するのはマテリアライズドビュー。通常ビューは都度計算で実体化なし、一時ビューはセッション限り、ストリーミングテーブルは追記型の増分取り込み向けで集計の再計算用ではない。",
    concept: "ビュー（都度計算）／マテリアライズドビュー（実体化・増分更新）／ストリーミングテーブル（追記取り込み）／一時ビュー（セッション限り）。"
  },
  {
    id: 213, domain: "transformation",
    question: "df1 は3行、df2 は2行で、両者に完全に同じ行が1件含まれる。df1.union(df2) の行数はどれか。",
    options: ["5 行（重複も保持）","4 行（重複は除去）","3 行","2 行"],
    answer: 0,
    explanation: "Spark の DataFrame .union() は SQL の UNION ALL 相当で重複を残す。3+2＝5 行。重複を除きたい場合のみ .union().distinct()（→4行）。",
    concept: ".union()＝UNION ALL 挙動（重複保持・列は位置対応）。重複除去は distinct、列名で揃えるなら unionByName。"
  },
  {
    id: 214, domain: "transformation",
    question: "あるDeltaテーブルの『行レベルの変更差分（挿入/更新/削除）』を下流で継続取得したい。時間トラベル（VERSION AS OF）では不十分な理由と正しい手段はどれか。",
    options: ["時間トラベルは特定時点の全体像しか返さない。CDF を有効化し table_changes() で差分を読む","時間トラベルで十分。VERSION AS OF を毎回読めばよい","OPTIMIZE を実行すれば差分が得られる","VACUUM で差分が保存される"],
    answer: 0,
    explanation: "VERSION AS OF はスナップショット（その時点の全体像）で、行がどう変わったかの差分は返さない。変更差分は CDF（delta.enableChangeDataFeed=true）を有効化し table_changes() で読む。OPTIMIZE/VACUUM は最適化・掃除で差分取得ではない。",
    concept: "時間トラベル＝スナップショット／CDF＝変更差分（_change_type 付き、table_changes / readChangeFeed）。"
  },

  /* ===== Lakeflow Jobs ===== */
  {
    id: 215, domain: "jobs",
    question: "後処理タスク cleanup を『上流がすべて成功した場合のみ（スキップされたものが1つでもあれば実行しない）』動かしたい。run if に設定すべき値はどれか。",
    options: ["ALL_SUCCESS","NONE_FAILED","ALL_DONE","AT_LEAST_ONE_SUCCESS"],
    answer: 0,
    explanation: "『全成功・スキップも不可』は ALL_SUCCESS。NONE_FAILED は失敗ゼロならOKでスキップを許容してしまう。ALL_DONE は成否問わず実行、AT_LEAST_ONE_SUCCESS は別条件。分かれ目は『スキップを許すか』。",
    concept: "run if：ALL_SUCCESS（全成功・スキップ不可）／NONE_FAILED（失敗ゼロ・スキップ許容）／ALL_DONE（成否問わず）／AT_LEAST_ONE_SUCCESS／AT_LEAST_ONE_FAILED。"
  },
  {
    id: 216, domain: "jobs",
    question: "上流の Delta テーブルが更新されたタイミングでジョブを起動したい（cron の空振りは避けたい）。最適なトリガーはどれか。",
    options: ["テーブル更新（table update）トリガー","毎分の cron スケジュール","ファイル到着トリガー","手動実行"],
    answer: 0,
    explanation: "テーブル更新を起点にするならテーブル更新トリガー。毎分 cron は空振りが多くコスト増、ファイル到着はファイル配置が起点で条件が違う、手動は自動化にならない。",
    concept: "トリガー：スケジュール(cron)／ファイル到着／テーブル更新／連続。データ駆動なら到着 or テーブル更新。"
  },
  {
    id: 217, domain: "jobs",
    question: "10タスクのジョブが7番目で失敗した。原因を直した後、成功済みの1〜6は再実行せず7以降だけ流し直したい。最適な操作はどれか。",
    options: ["失敗した実行を『修復実行（Repair run）』する","ジョブ全体を Run now で最初から流す","新しいジョブを作り直す","クラスターを再起動して全タスクを実行する"],
    answer: 0,
    explanation: "修復実行は失敗/未実行タスクだけを再実行し、成功済みは再計算しない。全体再実行は無駄、作り直しや再起動は要件に合わない。",
    concept: "修復実行（Repair run）＝失敗箇所以降のみ再実行。恒久バグは原因修正＋修復実行。"
  },
  {
    id: 218, domain: "jobs",
    question: "前タスクが出したレコード件数に応じて後続を分岐させたい（0件なら通知だけ、それ以外は集計）。Lakeflow Jobs での適切な仕組みはどれか。",
    options: ["条件分岐（If/else condition）タスクで、タスク値を条件に分岐する","1つの巨大ノートブックに全部 if で書く","run if を AT_LEAST_ONE_FAILED にする","両方のタスクを毎回実行して片方を捨てる"],
    answer: 0,
    explanation: "DAG 内の分岐は If/else condition タスクを使い、タスク値やパラメータを条件にする。単一ノートブックへの詰め込みや run if の流用、両方実行は分岐の正しい仕組みではない。",
    concept: "制御フロー：If/else condition（分岐）／タスク値（前タスクの受け渡し）／run if（依存条件）／retries（再試行）。"
  },

  /* ===== CI/CD ===== */
  {
    id: 219, domain: "cicd",
    question: "databricks.yml に prod ターゲットのジョブを定義済み。この定義を本番ワークスペースへ反映したい。空欄に入るコマンドはどれか。\n\ndatabricks bundle ____ -t prod",
    options: ["deploy","run","validate","export"],
    answer: 0,
    explanation: "定義をワークスペースへ反映（作成/更新）するのは deploy。run は既にデプロイ済みのジョブを実行、validate は構文検証のみ、export はバンドルのコマンドではない。",
    concept: "バンドル：validate（検証）→ deploy（反映）→ run（実行）。-t/--target で環境指定。"
  },
  {
    id: 220, domain: "cicd",
    question: "ジョブ・パイプライン等の定義を YAML でコード化し、dev/test/prod へ変数を切り替えて宣言的にデプロイし、Git で版管理したい。最も適したものはどれか。",
    options: ["Databricks アセットバンドル（Automation Bundle）","Databricks コマンドラインインターフェース","Databricks ソフトウェア開発キット","Databricks Connect"],
    answer: 0,
    explanation: "IaC でパッケージ化・環境昇格・版管理するのはアセットバンドル。CLI はそれをデプロイ/実行する道具、SDK は API を呼ぶライブラリ、Databricks Connect は開発接続で枠組みそのものではない。",
    concept: "バンドル＝何をデプロイするかの定義（YAML＋Git）／CLI＝それを回す道具。"
  },
  {
    id: 221, domain: "cicd",
    question: "同じコードベースを dev では小さいクラスタと dev カタログ、prod では大きいクラスタと prod カタログで動かしたい。バンドルでの正しいやり方はどれか。",
    options: ["ターゲット（dev/prod）ごとに変数・オーバーライドを定義し、1つのバンドルを昇格する","dev と prod で別々のリポジトリに分ける","prod 用にコードを手でコピーして書き換える","毎回 UI で手動設定する"],
    answer: 0,
    explanation: "1つのバンドルで target ごとに変数・オーバーライドを定義し、同一コードベースを各環境へ昇格するのが宣言的 CI/CD の要点。リポジトリ分割・手コピー・手動設定は再現性を失う。",
    concept: "Automation Bundle：targets（dev/test/prod）＋ variables/overrides で環境差を吸収し、同じ定義を昇格する。"
  },

  /* ===== 監視・最適化 ===== */
  {
    id: 222, domain: "monitoring",
    question: "大きなシャッフルを伴う結合が遅い。次のうち、シャッフル削減・高速化に最も効果が薄いものはどれか。",
    options: ["テーブル名を短くリネームする","小さい方をブロードキャスト結合にする","不要な列・行を事前に絞る","spark.sql.shuffle.partitions を見直す"],
    answer: 0,
    explanation: "テーブル名の変更は性能に無関係。ブロードキャスト結合・事前の絞り込み・shuffle.partitions 調整はいずれも有効。『最も効果が薄い』設問は性能と無関係な選択肢が答え。",
    concept: "『最も効果が薄い/関係が薄い』設問＝名前・文字種など性能無関係の項が答え。実効策と見分ける。"
  },
  {
    id: 223, domain: "monitoring",
    question: "Spark UI である結合ステージを見ると、大多数のタスクは数秒で終わるのに1〜2タスクだけ極端に長く、そのタスクの入力レコード数だけ突出している。最も疑うべき原因はどれか。",
    options: ["結合キーのデータスキュー（偏り）","小さなファイルが多すぎる","Photon が未使用","ドライバのメモリ不足"],
    answer: 0,
    explanation: "『少数タスクだけ長く、そのタスクの入力だけ突出』はデータスキューの典型。小ファイル問題はタスク時間が全体的に均一に遅くなる、Photon やドライバメモリは別症状。",
    concept: "Spark UI：タスク時間が偏る＝スキュー／均一に遅い＋小ファイル多数＝スモールファイル／Spill 大＝メモリ不足。"
  },
  {
    id: 224, domain: "monitoring",
    question: "高カーディナリティで、かつ頻繁に絞り込みに使う列がある。パーティション設計や手動 ZORDER の運用負担なしに、その列でのデータスキップを継続的に効かせたい。最適なのはどれか。",
    options: ["Liquid Clustering（CLUSTER BY）を使う","その列で PARTITIONED BY にする","毎日手動で OPTIMIZE … ZORDER する","何もしない"],
    answer: 0,
    explanation: "高カーディナリティ列のデータスキップを自動・継続で効かせるのは Liquid Clustering（CLUSTER BY）。高カーディナリティでのパーティションは小ファイル乱立、手動 ZORDER は運用負担が残る。",
    concept: "新表は Liquid Clustering（CLUSTER BY、自動維持・キー変更可）が推奨。パーティションは低カーディナリティ向け。"
  },

  /* ===== ガバナンス ===== */
  {
    id: 225, domain: "governance",
    question: "analysts グループにスキーマ s の読み取り専用アクセスを与えたい（既に USE CATALOG / USE SCHEMA は付与済み）。空欄に入るのはどれか。\n\nGRANT ____ ON SCHEMA s TO analysts",
    options: ["SELECT","ALL PRIVILEGES","MODIFY","CREATE TABLE"],
    answer: 0,
    explanation: "読み取り専用は SELECT。ALL PRIVILEGES は過剰、MODIFY は書き込み、CREATE TABLE は作成権限で読み取りではない。なお下位を読むには上位の USE CATALOG / USE SCHEMA も必要だが本問は付与済み。",
    concept: "読み取り＝GRANT SELECT。テーブルを読むには USE CATALOG＋USE SCHEMA＋SELECT の3点が要る（階層）。"
  },
  {
    id: 226, domain: "governance",
    question: "既存テーブル t の email 列に、グループに応じてマスク表示する列マスク関数 mask_email を適用したい。正しい操作はどれか。",
    options: ["ALTER TABLE t ALTER COLUMN email SET MASK mask_email","ALTER TABLE t ADD MASK mask_email ON (email)","GRANT MASK mask_email ON email","CREATE MASK mask_email ON t(email)"],
    answer: 0,
    explanation: "列マスクは ALTER TABLE … ALTER COLUMN 列 SET MASK 関数。SET であって ADD ではない。GRANT MASK / CREATE MASK ON という構文は存在しない。",
    concept: "列マスク＝ALTER COLUMN c SET MASK f／行フィルタ＝SET ROW FILTER f ON (列)。どちらも SET（ADD ではない）。"
  },
  {
    id: 227, domain: "governance",
    question: "Unity Catalog 下で、複数ユーザーが1つのクラスターを共有しつつ各自のアイデンティティで UC ガバナンスを効かせたい。設定すべきアクセスモードはどれか。",
    options: ["共有（Standard、旧 Shared）","シングルユーザー（Dedicated）","分離なし（No isolation）","サーバーレス"],
    answer: 0,
    explanation: "複数ユーザーが各自のIDで安全に共用し UC を適用するのは共有（Standard）。専用は1ユーザー/1SP向け、No isolation は UC 非対応、『サーバーレス』はアクセスモードではなく計算タイプ。",
    concept: "アクセスモード＝共有/Standard か 専用/Dedicated（＋旧 No isolation）。サーバーレスはモードではない。"
  },
  {
    id: 228, domain: "governance",
    question: "外部テーブル ext（LOCATION 明示で作成）とマネージドテーブル mng がある。それぞれ DROP TABLE したとき、ストレージ上のデータファイルはどうなるか。",
    options: ["ext は残る／mng は削除される","両方とも残る","両方とも削除される","ext は削除される／mng は残る"],
    answer: 0,
    explanation: "外部テーブルは UC がメタデータのみ管理するので DROP してもファイルは残る。マネージドは UC がデータも管理するので DROP で実データも削除される。",
    concept: "マネージド（LOCATION 省略・DROP でデータも消える）／外部（LOCATION 明示・DROP してもファイルは残る）。"
  }

];
