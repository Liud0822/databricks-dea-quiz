/* =============================================================================
 * Databricks Certified Data Engineer Associate 問題バンク（本番難度版）
 * 対象バージョン: 2026年5月4日 改定版（公式 exam guide の7領域に準拠）
 *
 * 出題形式：シナリオ＋主に5択。選択肢は正解に近いディストラクタ（構文・関数名の
 * 微妙な差、DELTA/IF NOT EXISTS 等のキーワード有無）で構成し、本番の難度に寄せています。
 * 各問には explanation（正誤の理由）に加え、concept（用語・関連知識の解説）を付けています。
 *
 * ▼ 問題の追加方法
 *   QUESTION_BANK 配列の末尾（ ]; の直前）に下記テンプレートを追記して保存 → 再読み込み。
 *   {
 *     id: 46,
 *     domain: "jobs",               // 下の DOMAIN_LABELS のキー
 *     question: "問題文",
 *     options: ["選択肢A", "選択肢B", "選択肢C", "選択肢D", "選択肢E"],
 *     answer: 0,                    // 正解の位置（0=A ... 4=E）
 *     explanation: "なぜ正解/不正解か",
 *     concept: "用語・関連知識の解説（任意）"
 *   },
 *   ※ 選択肢は2〜6個（A〜F自動表示）。コード例は 'シングルクォート' を使うと書きやすい。
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

  /* ===== Databricks Intelligence Platform ===== */
  {
    id: 1, domain: "platform",
    question: "データエンジニアが customer360 というデータベースを /customer/customer360 という場所に作成する必要がある。同僚が既に作成済みかどうかは不明で、既存でもエラーにしたくない。実行すべきコマンドはどれか。",
    options: [
      "CREATE DATABASE customer360 LOCATION '/customer/customer360';",
      "CREATE DATABASE IF NOT EXISTS customer360;",
      "CREATE DATABASE IF NOT EXISTS customer360 LOCATION '/customer/customer360'",
      "CREATE DATABASE IF NOT EXISTS customer360 DELTA LOCATION '/customer/customer360'",
      "CREATE DATABASE customer360 DELTA LOCATION '/customer/customer360';"
    ],
    answer: 2,
    explanation: "既存でもエラーにしないため IF NOT EXISTS、指定パスに作るため LOCATION 句が必要。CREATE DATABASE 構文に DELTA というキーワードは存在しない。A は IF NOT EXISTS が無く既存だと失敗、B は LOCATION が無い。",
    concept: "DATABASE と SCHEMA は Databricks では同義語。IF NOT EXISTS は「無ければ作る」冪等な作成句で、重複作成のエラーを防ぐ。LOCATION はデータの格納場所を指定する句（省略時は所属カタログ/スキーマのマネージドロケーション）。Delta は既定のテーブル形式であり、DATABASE 作成構文にキーワードとしては現れない。"
  },
  {
    id: 2, domain: "platform",
    question: "多数のアナリストが日中に断続的にBIダッシュボードを開く。クエリへの即応（コールドスタート回避）、同時実行の自動スケール、インフラ管理不要を満たしたい。最適なコンピュートはどれか。",
    options: [
      "All-purpose クラスターを1台、自動終了20分で共有する",
      "ジョブクラスターをBIツールから毎回起動する",
      "サーバーレス SQL ウェアハウス",
      "クラシック（従来型）SQL ウェアハウスを最小サイズで常時1台",
      "シングルノードの All-purpose クラスター"
    ],
    answer: 2,
    explanation: "サーバーレス SQL ウェアハウスは起動が数秒でコールドスタートを避けられ、同時実行の自動スケールとインフラ管理不要を満たす。クラシック/プロは起動に数分かかりコールドスタート問題が残る。All-purpose/ジョブ/シングルノードはBIの同時実行に不適。",
    concept: "SQL ウェアハウス（旧称 SQL エンドポイント）は Databricks SQL の SQL 実行用コンピュート。種別はサーバーレス（Databricks側で管理・数秒起動・弾力的）／プロ／クラシックの順に起動が遅くなる。スケーリングは「最小〜最大クラスタ数」の範囲で、リクエストキューの予測処理時間に応じてクラスタ数が自動増減する（1クラスタのサイズ拡大とは別概念）。"
  },
  {
    id: 3, domain: "platform",
    question: "Unity Catalog で、LOCATION を明示せずにマネージドテーブルを作成した。データは物理的にどこへ格納されるか。",
    options: [
      "テーブル→スキーマ→カタログ→メタストアの順で、最も近い階層に設定されたマネージドストレージの場所",
      "常に DBFS ルート（dbfs:/user/hive/warehouse）",
      "ドライバノードのローカルディスク",
      "実行ユーザーのホームディレクトリ",
      "必ずメタストアのルートのみ（下位階層の設定は無視される）"
    ],
    answer: 0,
    explanation: "UCのマネージドテーブルは、テーブル→スキーマ→カタログ→メタストアの階層で最も近いレベルに設定されたマネージドストレージロケーションに格納される。DBFSルート固定やローカルディスク、ホームではない。",
    concept: "Unity Catalog は メタストア → カタログ → スキーマ → テーブル の階層。各階層に「マネージドストレージロケーション」を設定でき、マネージドテーブルはテーブルに最も近い階層の設定に格納される。マネージドテーブルはデータもUCが管理し、外部テーブル（LOCATION 明示で外部の場所を参照）と対をなす。"
  },
  {
    id: 4, domain: "platform",
    question: "多数の短時間ジョブが頻繁に起動し、そのたびのクラスター起動待ち（クラウドVM調達で数分）がボトルネックになっている。起動を高速化する最適な手段はどれか。",
    options: [
      "クラスタープール（アイドルインスタンスを事前確保）を使う",
      "すべてのジョブを1つの大きな常時起動クラスターに集約する",
      "各ジョブのドライバをより大きいインスタンスにする",
      "Photon を有効化する",
      "自動終了（auto-termination）を無効化する"
    ],
    answer: 0,
    explanation: "クラスタープールはアイドルVMを事前確保し、起動時のクラウドVM調達待ちを省いて高速化する。Photonは実行速度、ドライバ大型化や自動終了無効化は起動待ちの短縮策ではない。",
    concept: "クラスタープールは、待機（アイドル）状態のクラウドVMインスタンスをプールとして保持しておく機能。クラスター起動時にプールから即座にVMを割り当てるため、クラウドプロバイダのVM調達待ち（数分）を省ける。アイドルVMには Databricks の DBU 課金は発生しないが、クラウドのVM料金は発生する点に注意。"
  },
  {
    id: 5, domain: "platform",
    question: "Photon エンジンによる高速化が最も期待できる処理はどれか。",
    options: [
      "Python の任意の外部ライブラリを呼び出すUDF中心の処理",
      "SQL・DataFrame のネイティブ関数による集計・結合・フィルタ・書き込み",
      "Scala の低レベル RDD 変換",
      "ドライバ上でのシングルスレッドのループ処理",
      "任意の Java UDF を多用する処理"
    ],
    answer: 1,
    explanation: "Photon はSQL/DataFrameのネイティブ演算（集計・結合・フィルタ・書き込み等）をベクトル化して高速化する。Python/Java/Scala の UDF や RDD 低レベル処理は Photon の高速化対象外。",
    concept: "Photon は C++実装のベクトル化クエリ実行エンジンで、SQL/DataFrame のネイティブ演算子をまとめて処理して高速化する。ユーザー定義関数（UDF）や RDD の低レベルAPIは Photon の対象外で、その部分は通常のエンジンにフォールバックする。したがって「ネイティブ関数中心」のワークロードほど効果が大きい。"
  },
  {
    id: 6, domain: "platform",
    question: "各ワークロードに割り当てるコンピュートの組み合わせとして、コスト効率と適合性が最も良いものはどれか。",
    options: [
      "本番ETL→All-purpose常時起動、対話開発→Jobクラスター、BI→シングルノード",
      "本番ETL→Job（またはサーバーレスジョブ）、対話開発→All-purpose、BI→SQLウェアハウス",
      "すべて All-purpose クラスターに統一する",
      "本番ETL→SQLウェアハウス、対話開発→Jobクラスター、BI→Jobクラスター",
      "すべてシングルノードクラスターに統一する"
    ],
    answer: 1,
    explanation: "本番ETLはコスト効率の良いJob/サーバーレスジョブ、対話開発はAll-purpose、BI/SQLはSQLウェアハウスが定石。用途に合わないコンピュートはコスト増・性能低下を招く。",
    concept: "コンピュート種別の使い分け：All-purpose（汎用/対話開発、DBU単価高）、Job compute（ジョブ実行専用、実行時のみ起動しDBU単価安）、SQL ウェアハウス（BI/SQL用）、サーバーレス各種（Databricks管理・即応）。用途に合わせることでコストと性能を最適化できる。"
  },

  /* ===== データ取り込み Ingestion & Loading ===== */
  {
    id: 7, domain: "ingestion",
    question: "クラウドストレージ上のJSONを Auto Loader で増分取り込みし、スキーマの保存先も指定したい。正しいコードはどれか。",
    options: [
      "spark.read.format('cloudFiles').option('cloudFiles.format','json').option('cloudFiles.schemaLocation', schemaPath).load(src)",
      "spark.readStream.format('cloudFiles').option('cloudFiles.format','json').option('cloudFiles.schemaLocation', schemaPath).load(src)",
      "spark.readStream.format('auto_loader').option('format','json').load(src)",
      "spark.read.format('json').option('autoLoader','true').load(src)",
      "spark.readStream.format('cloudFiles').option('format','json').load(src)"
    ],
    answer: 1,
    explanation: "Auto Loader はストリーミング（readStream）で format を 'cloudFiles'、実ファイル形式を 'cloudFiles.format'、スキーマ保存先を 'cloudFiles.schemaLocation' に指定する。read（バッチ）や 'auto_loader'/'autoLoader'、接頭辞なしの 'format' は誤り。",
    concept: "Auto Loader は format('cloudFiles') で使う増分ファイル取り込み機能で、内部は Structured Streaming（readStream）。主なオプションは cloudFiles.format（実ファイル形式 json/csv/parquet 等）、cloudFiles.schemaLocation（推論スキーマの保存先）、cloudFiles.schemaEvolutionMode（スキーマ進化）。処理済みファイルを追跡し、同じディレクトリの新規ファイルだけを取り込む。"
  },
  {
    id: 8, domain: "ingestion",
    question: "S3上のParquetを既存のDeltaテーブルへ冪等に増分ロードする、正しいSQLはどれか。",
    options: [
      "COPY INTO my_table FROM 's3://bucket/path' FILEFORMAT = PARQUET",
      "COPY my_table FROM 's3://bucket/path' FORMAT PARQUET",
      "COPY INTO my_table SELECT * FROM 's3://bucket/path'",
      "LOAD DATA INTO my_table FROM 's3://bucket/path' FILEFORMAT = PARQUET",
      "INSERT INTO my_table COPY FROM 's3://bucket/path'"
    ],
    answer: 0,
    explanation: "構文は COPY INTO <table> FROM '<location>' FILEFORMAT = <format>。取り込み済みファイルを追跡して冪等に増分ロードする。COPY（INTOなし）、LOAD DATA、INSERT ... COPY は Databricks の構文ではない。",
    concept: "COPY INTO は SQL で冪等な増分ロードを行うコマンド。基本構文は COPY INTO <table> FROM '<location>' FILEFORMAT = <format> [FORMAT_OPTIONS (...)] [COPY_OPTIONS (...)]。既に取り込んだファイルはスキップするため、同じコマンドを再実行しても二重取り込みにならない。少量〜中量の定期バッチ向き（大量継続は Auto Loader）。"
  },
  {
    id: 9, domain: "ingestion",
    question: "1日1回、数十ファイルだけを取り込む定期バッチを、SQLで完結させたい（シンプルさ重視）。最適な方法はどれか。",
    options: [
      "Auto Loader をファイル通知モードで常時ストリーミング稼働させる",
      "COPY INTO",
      "Structured Streaming を trigger(availableNow) で自作する",
      "dbutils.fs.ls でファイル列挙し INSERT をループする",
      "毎回テーブルを DROP して再作成する"
    ],
    answer: 1,
    explanation: "少量・定期・SQL完結なら COPY INTO が最もシンプルで冪等。Auto Loader は大量・継続向けでオーバースペック。手作りループやDROP再作成は非効率・非冪等。",
    concept: "取り込み方式の選択基準：COPY INTO＝少量・定期・SQL完結・冪等。Auto Loader＝大量・継続・スキーマ進化が必要な場合。どちらもファイルを追跡して増分取り込みできるが、運用の複雑さとスケールで使い分ける。手作業のループやDROP再作成は冪等性・効率で劣る。"
  },
  {
    id: 10, domain: "ingestion",
    question: "本番の PostgreSQL データベースのテーブルを、変更データ（CDC）として継続的に Unity Catalog テーブルへ同期したい。最適な取り込み方法はどれか。",
    options: [
      "Auto Loader（cloudFiles）でデータベースを直接読み込む",
      "COPY INTO でデータベースを直接読み込む",
      "Lakeflow Connect のマネージド（データベース）コネクタ",
      "Delta Sharing で受信する",
      "毎回 JDBC で全件読み込んで洗い替える"
    ],
    answer: 2,
    explanation: "DBからのCDC継続同期は Lakeflow Connect のマネージドコネクタが適する。Auto Loader/COPY INTO はクラウドストレージ上のファイル用でDBは直接読めない。Delta Sharing は共有機能、全件JDBCは非効率。",
    concept: "Lakeflow Connect は多様なソース（SaaS、データベース等）からの取り込みを提供する機能で、標準コネクタとマネージドコネクタがある。マネージドコネクタは接続・スケジュール・CDC（変更データ取り込み）を組み込みで扱う。Auto Loader/COPY INTO はあくまでクラウドオブジェクトストレージ上のファイル向けで、DB を直接は読まない。"
  },
  {
    id: 11, domain: "ingestion",
    question: "Auto Loader を既定の schemaEvolutionMode（addNewColumns）で運用中、ソースに新しい列が現れた。既定の挙動として正しいものはどれか。",
    options: [
      "ストリームが一旦失敗してスキーマ情報が更新され、再起動すると新列を含めて処理を続行する",
      "新列は静かに無視され、二度と取り込まれない",
      "既存データが全削除される",
      "新列は自動的に破棄（drop）される",
      "テーブル全体が文字列型に変換される"
    ],
    answer: 0,
    explanation: "addNewColumns では新列検知時にストリームが一旦失敗し、schemaLocation のスキーマが更新される。再起動すると新列を含めて処理を続行する。新列の無視やデータ削除は起きない。",
    concept: "cloudFiles.schemaEvolutionMode の既定は addNewColumns。新列を検知するとストリームを一度失敗させ、schemaLocation のスキーマを更新する。ジョブの自動リトライ／再起動で新列を含めて継続する。想定外の列を捕捉したい場合は rescuedDataColumn（_rescued_data）に退避させる設定もある。他のモード（none/rescue 等）では挙動が変わる。"
  },
  {
    id: 12, domain: "ingestion",
    question: "取り込み時にスキーマ推論され、data は STRUCT 型（data.address.city のようにネスト）になった。ネストの city を参照する正しい式はどれか。",
    options: [
      "data.address.city",
      "data:address:city",
      "get_json_object(data, '$.address.city')",
      "explode(data).city",
      "from_json(data).address.city"
    ],
    answer: 0,
    explanation: "STRUCT 型のネストは dot 記法 data.address.city で参照する。コロン記法 data:... や get_json_object / from_json は JSON文字列（STRING）に対する構文。explode は配列展開用でネスト参照ではない。",
    concept: "ネスト参照の使い分け：STRUCT 型（すでに構造化済み）は dot 記法 col.field.subfield。STRING 型に入った生JSONは コロン記法 col:field.subfield や get_json_object / from_json でパースして参照する。explode は配列（ARRAY）を行に展開する関数で、ネスト構造体の参照とは用途が異なる。"
  },
  {
    id: 13, domain: "ingestion",
    question: "取り込み方式の選択として最も不適切なものはどれか（誤っているものを選ぶ）。",
    options: [
      "クラウドストレージへ継続到着する大量ファイル → Auto Loader",
      "SaaS（Salesforce 等）からの取り込み → Lakeflow Connect マネージドコネクタ",
      "少量ファイルの定期ロード → COPY INTO",
      "本番DBのCDC → Auto Loader でDBのログファイルを自作パースして取り込む",
      "ネストJSONの取り込み → スキーマ推論して Delta へ格納"
    ],
    answer: 3,
    explanation: "本番DBのCDCは Lakeflow Connect のDBコネクタを使うのが適切で、ログを自作パースするのは不適切・高コスト。他は妥当な選択。",
    concept: "取り込み方式はデータ量・頻度・ソース種別・ガバナンス要件で選ぶ。ストレージ上のファイル→Auto Loader/COPY INTO、SaaS/DB→Lakeflow Connect、というのが基本。DBのCDCをログ自作パースで賄うのは信頼性・保守性・コストの面で不適切で、専用のマネージドコネクタを使うべき。"
  },

  /* ===== 変換・モデリング Transformation & Modeling ===== */
  {
    id: 14, domain: "transformation",
    question: "raw_table の配列カラム items を1要素につき1行へ展開（アンネスト）し、cart_id と item_id を持つ新テーブルを作りたい。正しいコマンドはどれか。",
    options: [
      "SELECT cart_id, filter(items) AS item_id FROM raw_table;",
      "SELECT cart_id, flatten(items) AS item_id FROM raw_table;",
      "SELECT cart_id, reduce(items) AS item_id FROM raw_table;",
      "SELECT cart_id, explode(items) AS item_id FROM raw_table;",
      "SELECT cart_id, slice(items) AS item_id FROM raw_table;"
    ],
    answer: 3,
    explanation: "explode() は配列を1要素1行へ展開する。filter は条件抽出、flatten は「配列の配列」を1段平坦化、reduce は畳み込み、slice は部分配列取得で、いずれも行への展開ではない。",
    concept: "配列関連関数：explode（配列→複数行に展開／NULLや空は行を生成しない）、posexplode（位置付きで展開）、flatten（配列の配列を1段の配列に平坦化＝行は増やさない）、slice（部分配列）、filter/transform/reduce（高階関数で配列内を加工）。「行に増やす」のは explode 系だけ。"
  },
  {
    id: 15, domain: "transformation",
    question: "指定スキーマ（id STRING, ts DATE, rating FLOAT）の空のDeltaテーブルを、同名テーブルの有無にかかわらず作成（あれば置き換え）したい。正しいDDLはどれか。",
    options: [
      "CREATE OR REPLACE TABLE t (id STRING, ts DATE, rating FLOAT)",
      "CREATE TABLE IF NOT EXISTS t (id STRING, ts DATE, rating FLOAT)",
      "CREATE TABLE t AS SELECT id STRING, ts DATE, rating FLOAT",
      "CREATE OR REPLACE TABLE t WITH COLUMNS (id STRING, ts DATE, rating FLOAT) USING DELTA",
      "REPLACE TABLE t (id STRING, ts DATE, rating FLOAT)"
    ],
    answer: 0,
    explanation: "「有無にかかわらず作成（置き換え）」は CREATE OR REPLACE TABLE で、列は括弧内に『列名 型』を列挙する。IF NOT EXISTS は既存時に作成しない、AS SELECT は空テーブルにならない、WITH COLUMNS 構文や REPLACE TABLE 単独は誤り。",
    concept: "テーブル作成DDLの使い分け：CREATE OR REPLACE TABLE（あれば置換・なければ作成／常に定義どおりにリセット）、CREATE TABLE IF NOT EXISTS（既存なら何もしない）、CREATE TABLE ... AS SELECT（CTAS＝クエリ結果でデータ入りテーブルを作成）。列定義は「(列名 型, ...)」の形式。WITH COLUMNS や REPLACE TABLE 単独は無効。"
  },
  {
    id: 16, domain: "transformation",
    question: "新しい1レコード (id='a1', rank=6, rating=9.4) を既存Deltaテーブル my_table に追記する、正しいSQLはどれか。",
    options: [
      "UPDATE VALUES ('a1', 6, 9.4) my_table",
      "UPDATE my_table VALUES ('a1', 6, 9.4)",
      "INSERT VALUES ('a1', 6, 9.4) INTO my_table",
      "INSERT INTO my_table VALUES ('a1', 6, 9.4)",
      "APPEND INTO my_table VALUES ('a1', 6, 9.4)"
    ],
    answer: 3,
    explanation: "追記は INSERT INTO <table> VALUES (...)。UPDATE は既存行の更新、INSERT の語順違いや APPEND INTO は無効な構文。",
    concept: "DML の基本：INSERT INTO（追記）、INSERT OVERWRITE（上書き）、UPDATE（既存行の更新）、DELETE（削除）、MERGE INTO（upsert）。追記の正しい語順は INSERT INTO <table> VALUES (...)。APPEND INTO のような構文は存在しない。"
  },
  {
    id: 17, domain: "transformation",
    question: "ソース src を key で突合し、一致すれば更新・無ければ挿入（upsert）したい。正しい構文の骨子はどれか。",
    options: [
      "MERGE INTO tgt USING src ON tgt.id = src.id WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *",
      "UPSERT INTO tgt USING src ON tgt.id = src.id",
      "INSERT OR UPDATE INTO tgt FROM src ON id",
      "MERGE tgt WITH src WHERE tgt.id = src.id",
      "REPLACE INTO tgt USING src ON tgt.id = src.id"
    ],
    answer: 0,
    explanation: "upsert は MERGE INTO ... USING ... ON ... WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ... の構文。UPSERT / INSERT OR UPDATE / REPLACE INTO のような構文は存在しない。",
    concept: "MERGE INTO は upsert（更新＋挿入）や SCD（緩やかに変化する次元）を実装する中心構文。MERGE INTO tgt USING src ON <条件> の後に WHEN MATCHED THEN UPDATE/DELETE、WHEN NOT MATCHED THEN INSERT を並べる。UPSERT や INSERT OR UPDATE といった単語は Databricks SQL には無い。"
  },
  {
    id: 18, domain: "transformation",
    question: "Lakeflow Declarative Pipelines で、追記のみの生データを増分取り込みする Bronze と、複数テーブルを結合・集計して都度最新化する Gold を作る。適切なオブジェクトの組み合わせはどれか。",
    options: [
      "Bronze=マテリアライズドビュー、Gold=ストリーミングテーブル",
      "Bronze=ストリーミングテーブル、Gold=マテリアライズドビュー",
      "両方ともストリーミングテーブル",
      "両方ともマテリアライズドビュー",
      "Bronze=通常ビュー、Gold=ストリーミングテーブル"
    ],
    answer: 1,
    explanation: "追記の増分取り込みはストリーミングテーブル、結合・集計して最新結果を保持するのはマテリアライズドビューが適切。集計結果をストリーミングテーブルにするのは一般に不向き。",
    concept: "Gold層オブジェクトの違い：ストリーミングテーブル＝追記データを増分処理して蓄積（Structured Streaming ベース、取り込み・追記中心）。マテリアライズドビュー＝クエリ（結合・集計）の結果を事前計算して保持し、増分リフレッシュで最新化（BI高速化）。通常ビュー＝毎回再計算で結果を保持しない。"
  },
  {
    id: 19, domain: "transformation",
    question: "Lakeflow Declarative Pipelines で、ts が NULL の行を破棄しつつパイプラインは継続させたい。正しい期待値（expectation）の定義はどれか。",
    options: [
      "CONSTRAINT valid_ts EXPECT (ts IS NOT NULL) ON VIOLATION DROP ROW",
      "CONSTRAINT valid_ts CHECK (ts IS NOT NULL) ON FAIL DROP",
      "EXPECT valid_ts WHERE ts IS NOT NULL DROP",
      "CONSTRAINT valid_ts EXPECT (ts IS NOT NULL) ON VIOLATION FAIL UPDATE",
      "ASSERT ts IS NOT NULL ON VIOLATION DROP ROW"
    ],
    answer: 0,
    explanation: "期待値は CONSTRAINT <名> EXPECT (<条件>) [ON VIOLATION DROP ROW | FAIL UPDATE]。DROP ROW は違反行を破棄して継続、FAIL UPDATE はパイプラインを失敗させる。CHECK / ASSERT / WHERE 構文は誤り。",
    concept: "期待値（expectation）はパイプラインのデータ品質ルール。構文は CONSTRAINT <名> EXPECT (<条件>) [ON VIOLATION <アクション>]。ON VIOLATION の選択肢は、既定（違反を記録するが行は保持）／DROP ROW（違反行を破棄して継続）／FAIL UPDATE（違反があればパイプラインを失敗させる）。SQL の CHECK 制約や ASSERT とは別物。"
  },
  {
    id: 20, domain: "transformation",
    question: "大テーブルと約200MBの中テーブルの結合が遅く、Spark UI で大量シャッフルが見える。中テーブルは既定の autoBroadcastJoinThreshold（10MB）を超えるためブロードキャストされない。手動でブロードキャスト結合にする方法はどれか。",
    options: [
      "broadcast(mid_df) を使う（from pyspark.sql.functions import broadcast）",
      "spark.sql.shuffle.partitions を 1 にする",
      "mid_df.cache() すれば自動的にブロードキャストされる",
      "mid_df.repartition(1) すればブロードキャストになる",
      "mid_df.persist(StorageLevel.DISK_ONLY) を指定する"
    ],
    answer: 0,
    explanation: "閾値を超える表を明示的にブロードキャストするには broadcast() ヒントを使う（または autoBroadcastJoinThreshold を引き上げる）。cache / persist / repartition はブロードキャストを発生させず、shuffle.partitions=1 はむしろ危険。",
    concept: "ブロードキャスト結合は、小さい表を全 executor に配布して大きい表のシャッフルを回避する結合方式。spark.sql.autoBroadcastJoinThreshold（既定10MB）以下は自動適用され、超える場合は broadcast(df) ヒントで明示できる。cache/persist は再計算の回避、repartition はパーティション数変更で、いずれもブロードキャスト化はしない。"
  },
  {
    id: 21, domain: "transformation",
    question: "全列が完全に重複する行を1件に集約したい。正しいものはどれか。",
    options: [
      "df.dropDuplicates()",
      "df.distinct()",
      "df.drop('duplicates')",
      "df.groupBy().count()",
      "A も B も正しい（全列対象なら等価）"
    ],
    answer: 4,
    explanation: "全列対象なら df.dropDuplicates()（引数なし）と df.distinct() は等価に重複を除去する。drop('duplicates') は列削除、groupBy().count() は件数集計で重複除去ではない。",
    concept: "重複除去：distinct() は全列一致の重複を除去。dropDuplicates() は引数なしなら distinct() と等価、dropDuplicates(['col1','col2']) のように部分列を指定すると、その列の組み合わせで重複を除去できる（部分列指定は distinct では不可）。drop() は列の削除、groupBy().count() は集計で用途が別。"
  },
  {
    id: 22, domain: "transformation",
    question: "左テーブルの全行を残し、右テーブルに一致が無い行は右側の列を NULL で埋めたい。適切な結合はどれか。",
    options: [
      "inner join",
      "left (outer) join",
      "right (outer) join",
      "left semi join",
      "left anti join"
    ],
    answer: 1,
    explanation: "左を全件残し右不一致をNULLにするのは left outer join。inner は一致のみ、right は右基準、left semi は左のうち一致する行のみ（右列は返さない）、left anti は左のうち一致しない行のみ。",
    concept: "結合の種類：inner（両方一致のみ）、left outer（左を全件・右不一致はNULL）、right outer（右を全件）、full outer（両方全件）、left semi（左のうち右に一致がある行だけ・右の列は返さない）、left anti（左のうち右に一致が無い行だけ）、cross（直積）。"
  },

  /* ===== Lakeflow Jobs ===== */
  {
    id: 23, domain: "jobs",
    question: "下流タスク finalize を、上流タスクが『1つも失敗していない（スキップは許容）』場合に実行したい。依存条件（run if）に設定すべき値はどれか。",
    options: [ "ALL_SUCCESS", "ALL_DONE", "NONE_FAILED", "AT_LEAST_ONE_SUCCESS", "AT_LEAST_ONE_FAILED" ],
    answer: 2,
    explanation: "NONE_FAILED は依存が全て完了し失敗が1つも無ければ実行（スキップは許容）。ALL_SUCCESS は成功のみ（スキップも不可）、ALL_DONE は成否問わず、AT_LEAST_ONE_SUCCESS/FAILED は別条件。",
    concept: "Lakeflow Jobs の「run if（依存条件）」一覧：ALL_SUCCESS（全依存が成功・既定）、ALL_DONE（成否問わず全て完了）、NONE_FAILED（失敗が1つも無い＝スキップは許容）、AT_LEAST_ONE_SUCCESS（1つ以上成功）、AT_LEAST_ONE_FAILED（1つ以上失敗）。分岐や後処理の実行条件を細かく制御できる。"
  },
  {
    id: 24, domain: "jobs",
    question: "上流タスクの成否に関わらず、必ず実行したい通知タスクがある。依存条件（run if）に設定すべき値はどれか。",
    options: [ "ALL_SUCCESS", "ALL_DONE", "NONE_FAILED", "AT_LEAST_ONE_SUCCESS", "AT_LEAST_ONE_FAILED" ],
    answer: 1,
    explanation: "成否を問わず必ず実行は ALL_DONE。ALL_SUCCESS/NONE_FAILED は失敗時に実行されず、AT_LEAST_ONE_* は特定条件のみ。",
    concept: "ALL_DONE は上流タスクが成功・失敗・スキップのいずれで終わっても、全て「完了」しさえすれば下流を実行する。クリーンアップ、通知、後片付けなど「必ず走らせたい」タスクに使う。ALL_SUCCESS（既定）だと上流が1つでも失敗すると下流はスキップされる点と対比して覚える。"
  },
  {
    id: 25, domain: "jobs",
    question: "上流の Delta テーブルが更新されたタイミングでジョブを起動したい（cron の空振りは避けたい）。Lakeflow Jobs のトリガー種別はどれか。",
    options: [
      "スケジュール（cron）トリガー",
      "ファイル到着（file arrival）トリガー",
      "テーブル更新（table update）トリガー",
      "連続（continuous）トリガー",
      "Webhook トリガー"
    ],
    answer: 2,
    explanation: "Lakeflow Jobs のトリガーは scheduled / file arrival / table update。テーブル更新起動には table update トリガーを使う。continuous は常時稼働、file arrival はファイル用。",
    concept: "Lakeflow Jobs のトリガー種別：scheduled（時刻/cron の時間ベース）、file arrival（指定ロケーションへのファイル到着）、table update（指定テーブルの更新）。file arrival と table update は「データ駆動トリガー」で、データが揃った時だけ起動でき、cron の空振りや遅延を避けられる。continuous は常時稼働のストリーミング実行モード。"
  },
  {
    id: 26, domain: "jobs",
    question: "10タスクのジョブが7番目のタスクで失敗した。原因を修正した後、成功済みの1〜6を再実行せず、7番目以降だけを流し直したい。最適な操作はどれか。",
    options: [
      "ジョブ全体を最初から再実行する",
      "Repair run（修復実行）で失敗・未実行タスクのみ再実行する",
      "ジョブを削除して新規に作り直す",
      "クラスターを再起動する",
      "各タスクを手動でノートブックから順に実行する"
    ],
    answer: 1,
    explanation: "Repair run は失敗/未実行タスクだけを再実行し、成功済みタスクをスキップできる。全体再実行や作り直しは無駄が多い。",
    concept: "Repair run（修復実行）は、失敗した実行に対して失敗・未実行のタスクだけを再実行し、既に成功したタスクの結果を再利用する機能。時間とコストを節約でき、非冪等な処理の二重実行も避けられる。マルチタスクジョブのDAG（依存グラフ）が前提。"
  },
  {
    id: 27, domain: "jobs",
    question: "あるタスクで計算した値を、同一ジョブの後続タスクへ渡したい。Lakeflow Jobs の正しい仕組みはどれか。",
    options: [
      "dbutils.jobs.taskValues.set() / get()（タスク値）を使う",
      "Python のグローバル変数に代入して参照する",
      "ドライバのローカルファイルに書いて後続で読む",
      "print してログから値を拾う",
      "タスク間で値は一切共有できない"
    ],
    answer: 0,
    explanation: "タスク間の値受け渡しは dbutils.jobs.taskValues.set()/get()（タスク値）で行う。グローバル変数やローカルファイルは別タスク（別実行環境）に共有されない。",
    concept: "タスク値（task values）は dbutils.jobs.taskValues.set(key, value) で保存し、後続タスクで dbutils.jobs.taskValues.get(taskKey, key) で取得する、タスク間の値受け渡し機構。各タスクは別のプロセス/クラスタで動くため、Python のグローバル変数やドライバのローカルファイルは共有されない。ジョブパラメータは実行時の入力値で用途が別。"
  },
  {
    id: 28, domain: "jobs",
    question: "外部連携が『毎日おおよそ2〜5時の不定時刻』に1ファイルを配置する。処理を確実かつ無駄なく起動するには、どのトリガーが最適か。",
    options: [
      "03:00 の cron で固定起動",
      "05:00 の cron で固定起動",
      "1分ごとの cron でポーリングし続ける",
      "ファイル到着（file arrival）トリガー",
      "continuous トリガーで常時稼働させる"
    ],
    answer: 3,
    explanation: "到着時刻が不定なので、ファイル到着トリガーが最も確実かつ無駄がない。固定cronは早すぎると未到着、遅すぎると遅延。1分ポーリングやcontinuousはコストが増える。",
    concept: "トリガー選択の指針：到着時刻が固定なら時間ベース（cron）、不定ならデータ駆動（ファイル到着/テーブル更新）が適切。データ駆動トリガーは「データが揃った時だけ」起動するため、空振り実行や到着遅延によるSLA違反を避けられる。高頻度ポーリングや常時稼働はコスト増になりやすい。"
  },

  /* ===== CI/CD ===== */
  {
    id: 29, domain: "cicd",
    question: "CI で、バンドル構成の検証 → dev への配置 → ジョブ実行、の順に自動化したい。正しい Databricks CLI コマンドの順序はどれか。",
    options: [
      "databricks bundle deploy → validate → run",
      "databricks bundle validate → deploy → run",
      "databricks bundle run → deploy → validate",
      "databricks bundle test → deploy",
      "git push → databricks bundle run"
    ],
    answer: 1,
    explanation: "validate（検証）→ deploy（配置）→ run（実行）の順。順序違いや test/push だけでは配置・実行は成立しない。",
    concept: "Databricks CLI のバンドル系サブコマンド：validate（databricks.yml の構文・構成を検証）、deploy（リソースを対象ターゲットへ配置）、run（配置済みジョブ/パイプラインを実行）、destroy（配置を削除）。CI/CD では validate → deploy →（必要なら）run の流れが定石。"
  },
  {
    id: 30, domain: "cicd",
    question: "databricks.yml で、dev は小さいクラスタと dev カタログ、prod は大きいクラスタと prod カタログを使いたい。単一コードベースで実現する正しい方法はどれか。",
    options: [
      "targets 配下に dev/prod を定義し、各ターゲットで variables やリソースの overrides を指定する",
      "環境ごとに別の databricks.yml をコピーして手で保守する",
      "prod の値をハードコードし dev でも同じ値を使う",
      "ノートブック内で if env=='prod' を大量に分岐させる",
      "変数機能は使わずコメントで区別する"
    ],
    answer: 0,
    explanation: "バンドルの targets（dev/prod 等）ごとに変数・オーバーライドを定義し、同一コードで環境差を吸収する。コピー保守やハードコードは再現性を損なう。",
    concept: "Automation Bundle の targets は dev/test/prod などの環境を表し、各ターゲットで variables（変数）や resources の overrides（上書き）を定義して環境差（カタログ名、クラスタサイズ、スケジュール等）を吸収する。1つのコードベースを各環境へ再現可能に昇格（promote）できるのがバンドルの要。"
  },
  {
    id: 31, domain: "cicd",
    question: "Automation Bundle（旧 Databricks Asset Bundles）が、従来の手動デプロイ（UI操作/手動エクスポート）に対して持つ利点として、誤っているものはどれか。",
    options: [
      "ジョブ・パイプライン等をコードとして版管理できる",
      "dev/test/prod へ再現可能に昇格できる",
      "CLI から CI で自動デプロイできる",
      "デプロイのたびに手作業での微調整が必要になる",
      "環境差を変数・オーバーライドで吸収できる"
    ],
    answer: 3,
    explanation: "バンドルの利点はコード化・再現性・自動化・環境差の吸収。『毎回手作業で微調整が必要』は利点ではなく、むしろ従来手法の欠点。",
    concept: "Automation Bundle（旧 Databricks Asset Bundles / DAB）は、ジョブ・パイプライン・ノートブック等の定義を YAML（databricks.yml）でコード化する IaC の仕組み。利点は「版管理できる／CIから自動デプロイできる／dev-test-prod へ再現可能に昇格できる／環境差を変数で吸収できる」。手作業の微調整が要るのは従来の手動デプロイの欠点。"
  },
  {
    id: 32, domain: "cicd",
    question: "Databricks Repos（Git 統合）に関する説明として、誤っているものはどれか。",
    options: [
      "ブランチの作成・切替ができる",
      "コミット・プッシュができる",
      "Gitプロバイダ上でプルリクエストを作成できる",
      "ワークスペースUIから変更を管理できる",
      "外部Gitと同期せず、Databricks 独自のGit履歴だけで完全独立運用する"
    ],
    answer: 4,
    explanation: "Repos は外部Gitプロバイダと同期して動作する（独自Git履歴での独立運用ではない）。ブランチ操作・コミット・プッシュ・PR作成は可能。",
    concept: "Databricks Repos（Git フォルダ）は、GitHub/GitLab/Azure DevOps などの外部 Git プロバイダと連携する機能。ワークスペースUIからブランチ作成・切替、コミット、プッシュ、プルリク作成ができ、開発ワークフローをコードとして管理する。あくまで外部Gitと同期する仕組みで、独自の閉じたGitではない。"
  },
  {
    id: 33, domain: "cicd",
    question: "Automation Bundle の databricks.yml に定義する要素として、含まれないものはどれか。",
    options: [
      "bundle（名前などのメタ情報）",
      "targets（dev/prod などの環境）",
      "resources（jobs, pipelines など）",
      "variables（変数）",
      "クラスターの物理ホスト名やIPアドレス"
    ],
    answer: 4,
    explanation: "バンドルは bundle / targets / resources / variables などを宣言的に定義する。物理ホスト名やIPは扱わない（コンピュートは論理的に指定する）。",
    concept: "databricks.yml の主な構成要素：bundle（名前などのメタ）、targets（dev/test/prod 環境）、resources（jobs, pipelines, experiments 等のワークスペース資産）、variables（変数）、artifacts（ビルド成果物）。コンピュートはクラスタ仕様として論理的に記述し、物理ホスト名やIPは扱わない。"
  },
  {
    id: 34, domain: "cicd",
    question: "バンドルを prod ターゲットへ配置する、正しい Databricks CLI コマンドはどれか。",
    options: [
      "databricks bundle deploy -t prod",
      "databricks deploy bundle prod",
      "databricks bundle push prod",
      "databricks bundle release --env prod",
      "databricks jobs deploy --prod"
    ],
    answer: 0,
    explanation: "databricks bundle deploy -t/--target prod が正しい。push / release / deploy bundle / jobs deploy のような語順・サブコマンドは誤り。",
    concept: "配置コマンドは databricks bundle deploy で、対象環境は -t（--target）フラグで指定する（例：-t prod）。ターゲットは databricks.yml の targets に定義しておく。push / release といったサブコマンドは存在しない。"
  },

  /* ===== 監視・トラブルシューティング・最適化 ===== */
  {
    id: 35, domain: "monitoring",
    question: "Liquid Clustering に関する説明として、誤っているものはどれか。",
    options: [
      "CLUSTER BY (col) で有効化し、パーティショニング＋ZORDER を置き換える",
      "クラスタリングキーは後から変更でき、既存データの全書き換えは不要",
      "OPTIMIZE を実行するとクラスタリングが適用・維持される",
      "PARTITIONED BY と同じ列で必ず併用しなければならない",
      "高カーディナリティ列やアクセスパターンが変化するケースに向く"
    ],
    answer: 3,
    explanation: "Liquid Clustering はパーティショニングを置き換えるもので、PARTITIONED BY との必須併用はない（むしろ併用しない）。他の記述は正しい。",
    concept: "Liquid Clustering は Delta のデータレイアウト最適化機能で、CLUSTER BY (cols) で指定する。従来のパーティショニング＋ZORDER を置き換え、クラスタリングキーを後から変更しても既存データの全書き換えが不要（柔軟）。OPTIMIZE でクラスタリングが適用・維持される。CLUSTER BY AUTO で自動選択も可能。PARTITIONED BY との併用は不要。"
  },
  {
    id: 36, domain: "monitoring",
    question: "あるステージで、大半のタスクは数秒で終わるが1タスクだけ10分かかり、そのタスクの入力レコード数だけ突出している。最も可能性が高い原因と対策はどれか。",
    options: [
      "データスキュー。ソルティングやスキュー結合の最適化、AQE 有効化で緩和する",
      "ドライバ不足。ドライバを大型化すれば必ず解決する",
      "ネットワーク遅延。リトライすれば解決する",
      "ディスク不足。VACUUM を実行すれば解決する",
      "乱数シードの問題。シードを固定すれば解決する"
    ],
    answer: 0,
    explanation: "特定タスクだけ入力・実行時間が突出＝データスキュー。ソルティング、スキュー対応結合、AQEのスキュー結合最適化で緩和する。ドライバ大型化やVACUUM等は無関係。",
    concept: "データスキュー＝特定キーにデータが偏り、担当パーティション（＝1タスク）だけが極端に重くなる現象。Spark UI ではステージ内のタスク時間・入力サイズのばらつきで診断する。対策は AQE（適応的クエリ実行）のスキュー結合最適化、ソルティング（キーに乱数を付加して分散）、broadcast 化など。"
  },
  {
    id: 37, domain: "monitoring",
    question: "Spark UI で shuffle spill（memory/disk）が大量に発生している。緩和策として最も効果が薄いものはどれか。",
    options: [
      "spark.sql.shuffle.partitions を増やして1タスクのデータ量を減らす",
      "不要な列を早めに drop してシャッフルデータ量を減らす",
      "executor のメモリを増やす",
      "AQE を有効化してパーティションを最適化する",
      "クラスターの auto-termination（自動終了）を無効化する"
    ],
    answer: 4,
    explanation: "spill 対策はパーティション調整・データ量削減・メモリ増強・AQE。auto-termination の無効化はコストが増えるだけで spill 緩和とは無関係。",
    concept: "spill（スピル）＝シャッフルや集計の中間データが executor のメモリに収まらず、ディスクへ退避される現象で、性能低下の兆候。対策は1タスクあたりのデータ量を減らす（パーティション数調整、不要列の早期削除、フィルタの前倒し）、メモリ増強、AQE による最適化など。auto-termination はアイドル時にクラスタを止める課金対策で、spill とは無関係。"
  },
  {
    id: 38, domain: "monitoring",
    question: "あるジョブの実行時間が『先週まで約5分、今週は約30分』に悪化した。原因調査の第一歩として最も適切なのはどれか。",
    options: [
      "Lakeflow Jobs の run history で過去実行と比較し、遅くなったタスク/時期を特定する",
      "まずクラスターを2倍のサイズにする",
      "ジョブを削除して作り直す",
      "Git のコミットログだけを確認する",
      "全タスクのコードをゼロから書き直す"
    ],
    answer: 0,
    explanation: "まず run history で過去と比較し、どのタスクがいつから遅くなったかを切り分けるのが定石。増強や作り直しは原因特定前の過剰対応。",
    concept: "Lakeflow Jobs の run history（実行履歴）ビューは、過去の実行時間・成否・各タスクの所要時間を一覧・比較できる。まずここで「いつから・どのタスクが」遅くなったかを特定（ベースライン比較）し、必要に応じて Spark UI でボトルネックを深掘りするのがトラブルシュートの定石。原因特定前の増強や作り直しは非効率。"
  },
  {
    id: 39, domain: "monitoring",
    question: "Predictive Optimization を有効化した。期待できる挙動として正しいものはどれか。",
    options: [
      "UC管理テーブルに対し、Databricks が必要に応じて OPTIMIZE / VACUUM 等を自動実行する",
      "すべてのクエリが必ず2倍速になる",
      "クラスターのVM料金が無料になる",
      "Auto Loader が不要になる",
      "すべてのテーブルが自動的に外部テーブルになる"
    ],
    answer: 0,
    explanation: "Predictive Optimization は UC管理テーブルのメンテナンス（OPTIMIZE/VACUUM 等）を自動判断・自動実行する。クエリが必ず倍速、料金無料、取り込み不要などは誤り。",
    concept: "Predictive Optimization（予測的最適化）は、Unity Catalog 管理テーブルに対し、どのテーブルにいつ OPTIMIZE（ファイルのコンパクション）や VACUUM（不要ファイル削除）等のメンテナンスを行うべきかを Databricks が学習・自動実行する機能。手動のメンテナンス運用を不要にする。OPTIMIZE は小ファイルをまとめてクエリを速くし、VACUUM は古い未参照ファイルを削除してストレージを節約する。"
  },
  {
    id: 40, domain: "monitoring",
    question: "あるジョブで out-of-memory（OOM）が頻発している。原因として最も関係が薄いものはどれか。",
    options: [
      "巨大パーティション（スキュー）で1タスクのデータが過大",
      "collect() で大量データをドライバ側に集約している",
      "過大な broadcast で各 executor のメモリを圧迫している",
      "UDF 内で巨大なオブジェクトを大量生成している",
      "テーブル名にマルチバイト文字を使っている"
    ],
    answer: 4,
    explanation: "OOM はデータ量過多・collect・過大 broadcast・UDF のメモリ大量消費などが原因。テーブル名の文字種はメモリ使用と無関係。",
    concept: "OOM（メモリ不足）の主因：スキューによる巨大パーティション、collect()/toPandas() で大量データをドライバに集約、閾値超えの broadcast による executor メモリ圧迫、UDF 内での大量オブジェクト生成など。なお collect 系はドライバ OOM、シャッフル/broadcast は executor OOM を招きやすい点も区別する。テーブル名の文字種はメモリ使用量に無関係。"
  },

  /* ===== ガバナンス・セキュリティ ===== */
  {
    id: 41, domain: "governance",
    question: "analysts グループに、スキーマ sales_data の読み取り専用アクセスを付与したい（USE CATALOG / USE SCHEMA は付与済み）。正しいSQLはどれか。",
    options: [
      "GRANT ALL PRIVILEGES ON SCHEMA sales_data TO analysts;",
      "GRANT SELECT ON SCHEMA sales_data TO analysts;",
      "GRANT INSERT ON SCHEMA sales_data TO analysts;",
      "GRANT USAGE ON SCHEMA sales_data TO analysts;",
      "GRANT READ ON SCHEMA sales_data TO analysts;"
    ],
    answer: 1,
    explanation: "スキーマ配下の読み取りは GRANT SELECT ON SCHEMA。ALL PRIVILEGES は過剰、INSERT は書き込み、USAGE は使用権のみで読み取りにならず、READ という権限名は無い。",
    concept: "Unity Catalog の権限はメタストア→カタログ→スキーマ→テーブルの階層で、上位に USE CATALOG / USE SCHEMA（＝旧 USAGE、その階層を「使える」権限）が必要。実データの読み取りは SELECT。スキーマに SELECT を付与すると配下テーブルに継承される。最小権限の原則に沿い、ALL PRIVILEGES の乱用は避ける。READ という権限名は存在しない。"
  },
  {
    id: 42, domain: "governance",
    question: "email 列を、pii_reader グループ以外にはマスク表示したい。Unity Catalog での正しい適用手順はどれか。",
    options: [
      "マスク用の SQL UDF を作成し、ALTER TABLE t ALTER COLUMN email SET MASK mask_func で適用する",
      "CREATE MASK ON t.email FOR pii_reader",
      "ALTER TABLE t ALTER COLUMN email ENCRYPT",
      "GRANT MASK ON t.email TO pii_reader",
      "動的ビューを作り、元テーブルは全員から REVOKE する"
    ],
    answer: 0,
    explanation: "列マスクは SQL UDF（マスク関数）を作り、ALTER TABLE ... ALTER COLUMN ... SET MASK <func> で適用する。CREATE MASK / ENCRYPT / GRANT MASK のような構文は無く、動的ビューは旧来の代替手段で最適ではない。",
    concept: "列マスク（column mask）は、列の値を閲覧者に応じて隠す機能。手順は (1) マスク処理を書いた SQL UDF を作成（例：is_account_group_member('pii_reader') で分岐）、(2) ALTER TABLE ... ALTER COLUMN <col> SET MASK <func> で列に適用。行の可視性を制御する「行フィルタ」と対をなす。CREATE MASK 等の専用DDLは無い。"
  },
  {
    id: 43, domain: "governance",
    question: "外部テーブル ext_t（LOCATION 指定）とマネージドテーブル mng_t がある。それぞれ DROP TABLE したときの挙動として正しいものはどれか。",
    options: [
      "ext_t はメタデータのみ削除しデータは残る / mng_t はメタデータとデータの両方を削除",
      "両方ともデータも削除される",
      "両方ともメタデータのみ削除される",
      "ext_t は両方削除 / mng_t はメタデータのみ削除",
      "どちらも DROP できない"
    ],
    answer: 0,
    explanation: "外部テーブルは DROP でメタデータのみ削除され、データは外部ロケーションに残る。マネージドテーブルは DROP でデータも削除される。",
    concept: "マネージドテーブル＝データもメタデータもUCが管理し、DROP するとデータファイルも削除される。外部テーブル＝LOCATION で指定した外部の場所のデータを参照するだけで、DROP してもメタデータのみ削除されデータは残る。既存データを他システムと共有する場合は外部テーブル、UCに委ねる場合はマネージドテーブルを選ぶ。"
  },
  {
    id: 44, domain: "governance",
    question: "全社の数百テーブルで『pii タグの付いた列は既定でマスクし、解除は限定グループのみ』を、最小の運用負荷で一元管理したい。最適なアプローチはどれか。",
    options: [
      "Unity Catalog の ABAC ポリシーを定義し、タグ条件で列マスク/行フィルタを横断適用する",
      "テーブルごとにマスクUDFを手作業で SET MASK する",
      "テーブルごとに動的ビューを作成する",
      "全ユーザーから SELECT を REVOKE する",
      "列を物理的に暗号化して保存する"
    ],
    answer: 0,
    explanation: "タグ＋ABACポリシーで多数オブジェクトへ横断的にマスク/行フィルタを一元適用でき、運用が最小。個別 SET MASK やビュー量産は規模的に破綻し、物理暗号化は条件付き表示の要件に合わない。",
    concept: "ABAC（属性ベースのアクセス制御）は、オブジェクトに付与したタグ（属性）とポリシーを組み合わせ、多数のテーブル/列へ横断的に行フィルタ・列マスクを一元適用する仕組み。「pii タグの列は自動でマスク」のようなルールを一度定義すれば全社に効く。個別 GRANT や個別マスク、動的ビューの量産は規模が大きいと運用が破綻する。"
  },
  {
    id: 45, domain: "governance",
    question: "同一テーブルで、営業担当が自分の region の行だけを閲覧できるようにしたい。Unity Catalog での実現方法はどれか。",
    options: [
      "行フィルタ用の SQL UDF を作り、ALTER TABLE t SET ROW FILTER filter_func ON (region) で適用する",
      "各クエリに WHERE region = ... を手で書かせる運用にする",
      "region ごとにテーブルを物理分割し、個別に GRANT する",
      "region 列に列マスクを適用する",
      "GRANT SELECT ON ROW ... という専用構文を使う"
    ],
    answer: 0,
    explanation: "行レベルセキュリティは、行フィルタ UDF を作り ALTER TABLE ... SET ROW FILTER ... ON (col) で適用する。列マスクは列の値を隠す機能で行制御ではない。手書きWHEREや物理分割は運用が破綻し、GRANT SELECT ON ROW のような構文は存在しない。",
    concept: "行フィルタ（row filter＝行レベルセキュリティ）は、閲覧者に応じて見える「行」を制限する機能。手順は (1) 真偽を返す SQL UDF を作成（例：所属 region と行の region を比較）、(2) ALTER TABLE ... SET ROW FILTER <func> ON (<col>) で適用。列の値を隠す「列マスク」と対で、両方 UDF ベースで UC が一元管理する。"
  },

  /* ===== 追加：本番寄せ・カタカナ強化（46〜59） ===== */

  /* --- CI/CD：バンドル と コマンドラインインターフェース の主従を切り分ける --- */
  {
    id: 46, domain: "cicd",
    question: "あるチームは、開発環境で作成したジョブ定義（ノートブックのタスク・クラスター設定・スケジュール）を、変数だけを切り替えて開発用と本番用の各ワークスペースへ宣言的（Infrastructure as Code）にデプロイし、その定義一式を Git でバージョン管理したい。最も適したものはどれか。",
    options: [
      "Databricksコマンドラインインターフェース",
      "Databricksアセットバンドル",
      "Databricksソフトウェア開発キット",
      "Databricks Connect",
      "Partner Connect"
    ],
    answer: 1,
    explanation: "アセットバンドルは databricks.yml にジョブ・クラスター・スケジュール等の定義とターゲット（dev/prod）ごとの変数をまとめ、Git でバージョン管理して各環境へ宣言的にデプロイできる。コマンドラインインターフェースはバンドルを『デプロイする手段（databricks bundle deploy）』であって定義の枠組みそのものではない。ソフトウェア開発キットはプログラムから API を呼ぶライブラリ、Databricks Connect は IDE/アプリからリモート計算へ接続する仕組み、Partner Connect は外部 SaaS 連携で、いずれも IaC のパッケージ化とは異なる。",
    concept: "カタカナ用語の対応：コマンドラインインターフェース＝CLI（databricks コマンド）／ソフトウェア開発キット＝SDK（Python 等のライブラリ）／アセットバンドル＝Asset Bundle（新版考纲では Automation Bundle とも）。バンドルは『何をデプロイするかを定義する枠組み（YAML＋Git）』、CLI は『それをデプロイ・実行する道具』という主従関係。試験ではこの両者を混同させる選択肢が頻出。"
  },
  {
    id: 47, domain: "cicd",
    question: "databricks.yml に prod ターゲットのジョブを定義済みで、この定義を本番ワークスペースへ反映（作成/更新）したい。コマンドラインインターフェースで実行すべきコマンドはどれか。",
    options: [
      "databricks bundle deploy -t prod",
      "databricks bundle run -t prod",
      "databricks bundle validate -t prod",
      "databricks jobs run-now --job-id <id>",
      "databricks fs cp ./job.yml dbfs:/prod/"
    ],
    answer: 0,
    explanation: "デプロイ（定義をワークスペースに作成/更新）は bundle deploy。bundle run は既にデプロイ済みのジョブを『実行』するコマンドで反映ではない。validate は構文検証のみ。jobs run-now は個別ジョブの実行、fs cp はファイルコピーで、いずれも宣言的デプロイではない。",
    concept: "バンドルの基本フロー：validate（検証）→ deploy（ワークスペースへ反映）→ run（デプロイ済みのジョブ/パイプラインを実行）。-t／--target で環境を指定。『deploy＝反映』と『run＝実行』の違いが問われやすい。"
  },
  {
    id: 48, domain: "cicd",
    question: "ノートブックを外部の Git プロバイダ（GitHub 等）のリポジトリと連携し、ワークスペース内でブランチの切り替え・コミット・プルを行いながらバージョン管理したい。使うべき機能はどれか。",
    options: [
      "Databricks Git フォルダ（旧称 Repos）",
      "DBFS にノートブックを .py で保存する",
      "ワークスペースのエクスポート/インポートを手動で行う",
      "Unity Catalog のボリューム",
      "MLflow モデルレジストリ"
    ],
    answer: 0,
    explanation: "Databricks Git フォルダ（旧 Repos）は、ワークスペース内で Git リポジトリをクローンし、ブランチ・コミット・プル等の Git 操作を行える機能。DBFS 保存や手動エクスポートはバージョン管理を提供しない。ボリュームは非表形式データの格納、MLflow は ML 実験/モデル管理で用途が異なる。",
    concept: "用語の変遷（新版考纲）：Repos → 『Databricks Git フォルダ（Git Folders）』に改称。CI/CD 領域では、Git フォルダ（人手の対話開発を Git 連携）と アセットバンドル（自動デプロイ）を役割で使い分ける点が重要。"
  },

  /* --- 変換・モデリング：見える範囲 / アップサート / 変更データフィード --- */
  {
    id: 49, domain: "transformation",
    question: "2つのテーブルの結合結果を、現在の作業セッション内だけで参照したい。物理データは複製したくなく、他のユーザーや他のセッションからは見えてはならない。作成すべきオブジェクトはどれか。",
    options: [
      "Delta テーブル",
      "ビュー（VIEW）",
      "一時ビュー（TEMP VIEW）",
      "グローバル一時ビュー（GLOBAL TEMP VIEW）",
      "マテリアライズドビュー"
    ],
    answer: 2,
    explanation: "一時ビューはセッションスコープで、物理データを持たず、そのセッションでのみ有効・他者からは不可視。通常のビューはメタストアに永続化され他セッション/他ユーザーからも見える。グローバル一時ビューは同一クラスター上の他セッションからも global_temp 経由で参照できるため『他セッション不可視』の条件に反する。Delta テーブルとマテリアライズドビューは物理データを保存する。",
    concept: "見える範囲の広さ：一時ビュー（自セッションのみ）＜ グローバル一時ビュー（同クラスターの全セッション、global_temp スキーマ）＜ ビュー（メタストアに永続、権限次第で全員）。マテリアライズドビュー＝結果を実体化して保存し増分更新する別物。『物理データを持たない＝ビュー系』だが、共有範囲の条件で正解が変わる点が本問の狙い。"
  },
  {
    id: 50, domain: "transformation",
    question: "日次で届く更新データ（source）を、キー一致なら更新・不一致なら挿入・source 側で削除フラグが立っていれば物理削除、という形で対象テーブル（target）へ1文で反映したい。適切な SQL はどれか。",
    options: [
      "MERGE INTO target t USING source s ON t.id = s.id WHEN MATCHED AND s.deleted THEN DELETE WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *",
      "INSERT OVERWRITE target SELECT * FROM source",
      "INSERT INTO target SELECT * FROM source",
      "UPDATE target SET * FROM source WHERE target.id = source.id",
      "COPY INTO target FROM source"
    ],
    answer: 0,
    explanation: "アップサート＋条件付き削除は MERGE INTO で、複数の WHEN 句（MATCHED AND 条件 → DELETE、MATCHED → UPDATE、NOT MATCHED → INSERT）を1文で表現できる。INSERT OVERWRITE は全置換、INSERT INTO は追記のみ、UPDATE...FROM * の構文は無効、COPY INTO はファイルからの取り込み用。",
    concept: "MERGE INTO（マージ＝アップサート）：ON でキー照合し、WHEN MATCHED / WHEN NOT MATCHED [BY SOURCE] ごとに UPDATE/DELETE/INSERT を指定。SET * / INSERT * は列名一致で全列を対応付ける糖衣構文。Delta の代表的なべき等更新手段。"
  },
  {
    id: 51, domain: "transformation",
    question: "下流の増分処理のために、ある Delta テーブルへの行レベルの変更（挿入・更新・削除、および更新前後の値）を継続的に取得したい。まず行うべき設定はどれか。",
    options: [
      "ALTER TABLE t SET TBLPROPERTIES (delta.enableChangeDataFeed = true)",
      "SELECT * FROM t VERSION AS OF 5 で過去バージョンを読む",
      "ALTER TABLE t SET TBLPROPERTIES (delta.appendOnly = true)",
      "VACUUM t RETAIN 0 HOURS を実行する",
      "OPTIMIZE t ZORDER BY (id) を実行する"
    ],
    answer: 0,
    explanation: "変更データフィード（CDF）を有効化すると、行レベルの変更を _change_type 付きで取得でき、table_changes() やストリーム（readChangeFeed）で増分読み出しできる。VERSION AS OF は時間トラベルでスナップショット参照に過ぎず行レベルの差分は返さない。appendOnly は更新/削除を禁止、VACUUM は不要ファイル削除、OPTIMIZE/ZORDER は最適化で用途が異なる。",
    concept: "変更データフィード（Change Data Feed, CDF）：delta.enableChangeDataFeed=true で有効化。読み出しは SQL の table_changes('t', 開始ver[, 終了ver]) か、Structured Streaming の option('readChangeFeed','true')。時間トラベル（VERSION/TIMESTAMP AS OF）は『特定時点の全体像』、CDF は『変更そのもの（差分）』という違い。"
  },

  /* --- 取り込み：Auto Loader と COPY INTO の使い分け --- */
  {
    id: 52, domain: "ingestion",
    question: "クラウドストレージに大量かつ継続的に到着する JSON ファイルを、スキーマの進化に追随しつつ、一度取り込んだファイルは二度と再処理しない形で増分取り込みしたい。最も適した方法はどれか。",
    options: [
      "Auto Loader（cloudFiles）で readStream ＋ checkpointLocation を使う",
      "毎回 spark.read.json でディレクトリ全体を読み直して上書きする",
      "COPY INTO を1回だけ実行する",
      "CREATE TABLE ... USING JSON の外部テーブルを1つ作る",
      "dbutils.fs.ls で新規ファイルを自作スクリプトで判定して読む"
    ],
    answer: 0,
    explanation: "Auto Loader（cloudFiles）はチェックポイントで処理済みファイルを追跡して増分取り込みし、スキーマ推論/進化にも対応、大規模・継続到着に最適。全体読み直しは非効率で再処理が発生、COPY INTO 1回では継続増分にならない、外部テーブルは取り込み処理ではない、自作判定は再発明で堅牢性に欠ける。",
    concept: "増分取り込みの二本柱：Auto Loader（cloudFiles、ストリーミング／大規模・継続到着・スキーマ進化に強い、チェックポイントで既処理を追跡）と COPY INTO（SQL、べき等バッチ、既ロードのファイルはスキップ、周期的な取り込み向き）。『継続・大量・スキーマ進化』なら Auto Loader が定番。"
  },
  {
    id: 53, domain: "ingestion",
    question: "毎時、同じ取り込み先フォルダを対象に COPY INTO を再実行するバッチがある。前回までに取り込み済みのファイルを重複ロードせず、新規ファイルだけを追加取り込みするために役立つ、COPY INTO の性質はどれか。",
    options: [
      "既に取り込んだファイルを追跡し、再実行時に自動でスキップするべき等性",
      "実行のたびに宛先テーブルを TRUNCATE してから全件ロードする性質",
      "取り込み前に必ず手動でファイル一覧を管理する必要がある性質",
      "重複を防ぐには MERGE を併用するしか方法がないという制約",
      "COPY INTO は常に全ファイルを再読み込みするという挙動"
    ],
    answer: 0,
    explanation: "COPY INTO は取り込み済みファイルを内部で追跡し、再実行時に同じファイルをスキップするべき等な取り込みを行うため、繰り返し実行しても新規分だけが追加される。TRUNCATE 前提や手動管理は不要で、全再読み込みするという記述も誤り。",
    concept: "COPY INTO のべき等性：一度ロードしたファイルを記録し、再実行時はスキップ。『同じコマンドを何度流しても結果が同じ』になり、単純な増分バッチに向く。大量・継続なら Auto Loader、周期バッチなら COPY INTO、という使い分けが問われる。"
  },

  /* --- Lakeflow ジョブ：修復実行 / ファイル到着トリガー --- */
  {
    id: 54, domain: "jobs",
    question: "5つのタスクからなる Lakeflow ジョブが、4番目のタスクで失敗した。原因を修正した後、成功済みの1〜3番目を再実行せず、失敗箇所以降だけを効率よく流し直したい。最適な操作はどれか。",
    options: [
      "失敗した実行に対して『修復実行（Repair run）』を行う",
      "ジョブ全体を最初から Run now で再実行する",
      "新しいジョブを作り直して実行する",
      "4番目のタスクを削除して実行する",
      "クラスターを再起動してから全タスクを流す"
    ],
    answer: 0,
    explanation: "修復実行（Repair run）は、失敗した実行に対して失敗/未実行のタスクだけを再実行でき、成功済みタスクの再計算を避けられる。全体再実行は成功分まで無駄に流し、作り直しやタスク削除は不適切。",
    concept: "Lakeflow ジョブ（旧称 Databricks Jobs／Workflows）：複数タスクを DAG（依存関係）で結び、タスク単位でリトライ・条件分岐が可能。失敗後は『修復実行』で失敗タスク以降のみ再実行するのが定石。"
  },
  {
    id: 55, domain: "jobs",
    question: "外部システムがクラウドストレージの特定フォルダに不定期にファイルを置く。そのたびに（固定スケジュールではなく）取り込みジョブを起動したい。最も適したトリガーはどれか。",
    options: [
      "ファイル到着トリガー（file arrival trigger）",
      "Cron による毎分スケジュール",
      "手動の Run now を運用でカバーする",
      "連続（continuous）トリガーで常時起動しておく",
      "別ジョブからの単純なリトライ"
    ],
    answer: 0,
    explanation: "ファイル到着トリガーは、指定した場所への新規ファイル到着を検知してジョブを起動でき、不定期到着に最適。毎分 Cron は無駄な起動が多くコスト増、手動運用は非現実的、連続トリガーは常時処理向けで到着駆動とは異なる。",
    concept: "Lakeflow ジョブのトリガー種別：スケジュール（Cron）／ファイル到着（指定ロケーションの新規ファイルで起動）／連続（停止まで動き続ける）／手動。『不定期のファイル到着で起動』はファイル到着トリガーが定番。"
  },

  /* --- ガバナンス：ABAC / ダイナミックビュー --- */
  {
    id: 56, domain: "governance",
    question: "組織全体で、PII とタグ付けした列には所属グループに応じてマスクを、機密とタグ付けした行にはフィルタを、多数のテーブルへ一括かつ一元的に適用したい。テーブルごとに個別設定するのは避けたい。新版で最も適した仕組みはどれか。",
    options: [
      "属性ベースアクセス制御（ABAC）で、タグ（属性）に対してポリシーを定義する",
      "各テーブルに ALTER TABLE で列マスク/行フィルタを個別に適用する",
      "テーブルごとにダイナミックビューを1つずつ作る",
      "GRANT/REVOKE を各テーブルに手動で設定する",
      "テーブルを機密度ごとに物理分割する"
    ],
    answer: 0,
    explanation: "属性ベースアクセス制御（ABAC）は、列/行に付与したタグ（属性）に対してマスクやフィルタのポリシーを定義し、多数のテーブルへ一元的・自動的に適用できる。個別の ALTER TABLE やテーブルごとのダイナミックビューは同じ結果を出せてもスケールせず一元管理にならない。GRANT は粒度が粗く、物理分割は運用が破綻する。",
    concept: "ABAC（Attribute-Based Access Control、属性ベースアクセス制御）：Unity Catalog のタグ（ガバナンス属性）に基づき、列マスク・行フィルタ等のポリシーを横断的に適用する新しめの機能。『タグを付ければ対象全体にポリシーが効く』のがテーブル個別設定との違い。新版考纲の重点トピック。"
  },
  {
    id: 57, domain: "governance",
    question: "1つのテーブルを共有しつつ、管理者グループのメンバーには本来の値を、それ以外にはマスクした値を返したい。ビュー定義内で使う関数として適切なものはどれか。",
    options: [
      "is_account_group_member('admins') を CASE 式で判定する",
      "current_timestamp() で時刻により切り替える",
      "input_file_name() で判定する",
      "user() を必ず 'admin' という文字列と比較する",
      "rand() で確率的に返す"
    ],
    answer: 0,
    explanation: "ダイナミックビューでは is_account_group_member('グループ名') や current_user() を CASE 式で使い、閲覧者の属性に応じて列値をマスク/表示できる。current_timestamp/input_file_name/rand はアクセス主体の判定に使えず、単純な文字列比較も安全な会員判定にはならない。",
    concept: "ダイナミックビュー：ビューの SELECT 内で current_user()（現在の利用者）や is_account_group_member('g')（アカウントグループの所属判定）を用い、CASE WHEN で列マスクや行フィルタを表現する古典的手法。UC の列マスク/行フィルタ関数や ABAC はこれをより宣言的・一元的にした発展形。"
  },

  /* --- 監視・最適化：スキュー / リキッドクラスタリング --- */
  {
    id: 58, domain: "monitoring",
    question: "大きなシャッフルを伴う結合が非常に遅い。Spark UI を見ると、大多数のタスクは数秒で終わるのに1〜2個のタスクだけが極端に長く、そのタスクで大量のディスクスピルが発生している。最も可能性が高い原因はどれか。",
    options: [
      "結合キーのデータ偏り（データスキュー）",
      "Photon が有効になっていないこと",
      "ドライバノードのメモリ不足",
      "クラスターの自動終了設定",
      "ノートブックのセル数が多いこと"
    ],
    answer: 0,
    explanation: "『少数のタスクだけが極端に長く、そこで大量のスピル』は、特定キーにデータが集中するデータスキューの典型症状。パーティション間で処理量が偏り、重いパーティションがメモリに収まらずディスクへスピルする。Photon 有効化やドライバメモリ、自動終了、セル数はこの偏りの説明にならない。",
    concept: "Spark UI の読み方：タスク時間の分布が偏る＝スキュー、Shuffle Spill（Memory/Disk）が大きい＝そのタスクがメモリに収まらずディスク退避。対処は、偏るキーの見直し、AQE（Adaptive Query Execution）のスキュー結合最適化、事前集計や再パーティション等。スピル＝メモリ圧迫のサイン。"
  },
  {
    id: 59, domain: "monitoring",
    question: "高カーディナリティで、かつ問い合わせで頻繁に絞り込みに使う列がある。その列でパーティション分割すると小さすぎるファイルが大量にでき、手動の ZORDER 再実行も運用負担になっている。この列でのデータスキップ性能を、パーティション設計や手動最適化なしに継続的に得たい。最適な方法はどれか。",
    options: [
      "Liquid Clustering（CLUSTER BY <col>）を使う",
      "その列で PARTITIONED BY にする",
      "毎日 OPTIMIZE ... ZORDER BY (<col>) を手動実行する",
      "bucketing（バケッティング）でファイルを固定分割する",
      "何もせず全件スキャンに任せる"
    ],
    answer: 0,
    explanation: "Liquid Clustering はクラスタリングキーに基づきデータ配置を継続的・自動的に最適化し、高カーディナリティ列でも小ファイルの乱立を招かずデータスキップを効かせられる。固定パーティションは高カーディナリティで小ファイル問題を悪化させ、手動 ZORDER は運用負担が残り、bucketing は固定的で柔軟性に欠ける。",
    concept: "Liquid Clustering（リキッドクラスタリング）：従来のパーティション分割＋ZORDER を置き換える新しいデータレイアウト。CREATE TABLE ... CLUSTER BY (col) で指定し、クラスタリングキーは後から変更でき、OPTIMIZE で継続的に整理される。高カーディナリティ・進化するアクセスパターンに強い。新版考纲の重点トピック。"
  },

  /* ===== 追加：構文・コマンド細部（60〜73）＝『1語違いで不正解』ドリル ===== */

  {
    id: 60, domain: "ingestion",
    question: "COPY INTO で一度取り込み済みのファイルは通常スキップされる。あえて全ファイルを再取り込み（再処理）させたい。正しい書き方はどれか。",
    options: [
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = PARQUET COPY_OPTIONS ('force' = 'true')",
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = PARQUET FORMAT_OPTIONS ('force' = 'true')",
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = PARQUET OVERWRITE",
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = PARQUET REPROCESS = TRUE",
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = PARQUET COPY_OPTIONS ('mergeSchema' = 'true')"
    ],
    answer: 0,
    explanation: "再処理は COPY_OPTIONS ('force' = 'true')。force は『コピーの挙動』を制御するオプションなので COPY_OPTIONS 側に置く。FORMAT_OPTIONS は『ファイル形式の解釈』（区切り文字・ヘッダ等）用で force は効かない。OVERWRITE / REPROCESS = TRUE という構文は存在せず、mergeSchema はスキーマ進化用で再処理とは無関係。",
    concept: "COPY INTO の2種類のオプションを混同させる頻出パターン：FORMAT_OPTIONS＝入力ファイルの読み方（例 'header'='true', 'delimiter'=','）／COPY_OPTIONS＝取り込み動作（'force'='true' で既処理も再取り込み、'mergeSchema'='true' でスキーマ進化）。どちらに何を書くかが問われる。"
  },
  {
    id: 61, domain: "ingestion",
    question: "COPY INTO で、新しく増えた列を持つファイルが来ても取り込みを失敗させず、宛先 Delta テーブルのスキーマを自動拡張したい。正しい書き方はどれか。",
    options: [
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = JSON COPY_OPTIONS ('mergeSchema' = 'true')",
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = JSON EVOLVE SCHEMA",
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = JSON WITH SCHEMA EVOLUTION",
      "COPY INTO t FROM 's3://b/p' FILEFORMAT = JSON FORMAT_OPTIONS ('force' = 'true')",
      "ALTER TABLE t ENABLE SCHEMA EVOLUTION; COPY INTO t FROM 's3://b/p' FILEFORMAT = JSON"
    ],
    answer: 0,
    explanation: "スキーマ進化は COPY_OPTIONS ('mergeSchema' = 'true')。EVOLVE SCHEMA / WITH SCHEMA EVOLUTION / ENABLE SCHEMA EVOLUTION といった構文は存在しない。force は再処理用でスキーマ拡張はしない。",
    concept: "mergeSchema は『既存スキーマ ∪ 新ファイルのスキーマ』で列を足し込む。COPY INTO では COPY_OPTIONS に書く。MERGE 文の withSchemaEvolution や DataFrame の option('mergeSchema','true') と文脈で書き方が異なる点に注意。"
  },
  {
    id: 62, domain: "ingestion",
    question: "Auto Loader で JSON ファイルを増分取り込みする。readStream に指定する format 文字列と、形式指定オプションの組み合わせとして正しいものはどれか。",
    options: [
      ".format('cloudFiles').option('cloudFiles.format', 'json')",
      ".format('autoLoader').option('autoLoader.format', 'json')",
      ".format('cloudfiles').option('cloudFiles.type', 'json')",
      ".format('json').option('autoLoader', 'true')",
      ".format('cloudFiles').option('format', 'json')"
    ],
    answer: 0,
    explanation: "Auto Loader の format は必ず 'cloudFiles'（キャメルケース）。ファイル形式は 'cloudFiles.format' オプションで指定する。'autoLoader' という format 名は存在せず、'cloudfiles'（小文字）は不正、'cloudFiles.type' や素の 'format' というキーも誤り。",
    concept: "Auto Loader の要点：spark.readStream.format('cloudFiles') を起点に、cloudFiles.format（json/csv/parquet…）、cloudFiles.schemaLocation（スキーマ/進化の保存先）を option で与える。書き込み側は checkpointLocation を指定。product 名『Auto Loader』と format 名『cloudFiles』は別物。"
  },
  {
    id: 63, domain: "ingestion",
    question: "現在ストレージにある全データを複数のマイクロバッチで処理し、処理し終えたら自動停止するストリーミング書き込みを、厳密1回（exactly-once）で行いたい。正しい writeStream はどれか。",
    options: [
      ".writeStream.option('checkpointLocation', '/ckpt').trigger(availableNow=True).table('t')",
      ".writeStream.trigger(availableNow=True).table('t')",
      ".writeStream.option('checkpointLocation', '/ckpt').trigger(continuous='5 seconds').table('t')",
      ".write.option('checkpointLocation', '/ckpt').trigger(availableNow=True).saveAsTable('t')",
      ".writeStream.option('checkpoint', '/ckpt').trigger(batch=True).table('t')"
    ],
    answer: 0,
    explanation: "『今ある全データを複数バッチで処理し終えたら停止』は trigger(availableNow=True)。厳密1回のために checkpointLocation が必須。checkpoint 無し（B）は再開/重複排除ができない、continuous は常時稼働で自動停止しない、.write（D）はバッチAPIでストリームではない、'checkpoint' というキー名や trigger(batch=True) は存在しない。",
    concept: "トリガー：availableNow（今ある分を複数バッチで処理→停止、増分バッチの定番）／once（1バッチで全処理、旧式）／processingTime='x'（定間隔）／continuous（超低遅延・常時）。checkpointLocation はストリームの進捗と厳密1回を支える必須設定（キー名は 'checkpointLocation'）。"
  },

  {
    id: 64, domain: "transformation",
    question: "source を target にアップサート（一致で更新・不一致で挿入）する。構文として正しいものはどれか。",
    options: [
      "MERGE INTO target t USING source s ON t.id = s.id WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *",
      "MERGE target t USING source s ON t.id = s.id WHEN MATCHED THEN UPDATE SET *",
      "MERGE INTO target t USING source s WHERE t.id = s.id WHEN MATCHED THEN UPDATE SET *",
      "MERGE INTO target t USING source s ON t.id = s.id WHEN MATCHED UPDATE SET *",
      "UPSERT INTO target USING source ON target.id = source.id"
    ],
    answer: 0,
    explanation: "正：MERGE INTO ... USING ... ON <条件> WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...。B は INTO 欠落、C は照合が ON でなく WHERE、D は THEN 欠落、E は UPSERT という文自体が存在しない。",
    concept: "MERGE の骨格：MERGE INTO（INTO 必須）／USING（ソース）／ON（結合条件、WHERE ではない）／WHEN MATCHED [AND 条件] THEN UPDATE|DELETE ／WHEN NOT MATCHED THEN INSERT。各 WHEN 句に THEN が必要。SET * / INSERT * は列名一致の糖衣構文。"
  },
  {
    id: 65, domain: "transformation",
    question: "クエリ結果から新しいマネージド Delta テーブルを1文で作成（CTAS）したい。正しい構文はどれか。",
    options: [
      "CREATE TABLE t AS SELECT * FROM src",
      "CREATE TABLE t SELECT * FROM src",
      "CREATE TABLE t AS PARQUET SELECT * FROM src",
      "CREATE TABLE t FROM SELECT * FROM src",
      "SELECT * FROM src INTO TABLE t"
    ],
    answer: 0,
    explanation: "CTAS は CREATE TABLE <名> AS SELECT ...。AS が必須（B は欠落）。Delta が既定形式なので USING は省略可だが、書くなら 'USING DELTA' で 'AS PARQUET' のような形式指定は不正（C）。FROM SELECT や INTO TABLE という構文は存在しない。",
    concept: "テーブル作成の型：CREATE TABLE t (...);（空作成）／CREATE TABLE t AS SELECT ...;（CTAS）／CREATE OR REPLACE TABLE ...;（置換）／CREATE TABLE IF NOT EXISTS ...;（冪等）。形式は既定 Delta、指定は USING DELTA を CREATE 直後に置く。"
  },
  {
    id: 66, domain: "monitoring",
    question: "大きな Delta テーブルで、小さなファイルを圧縮しつつ、頻繁に絞り込む列でのデータスキップを効かせる最適化を実行したい。正しい構文はどれか。",
    options: [
      "OPTIMIZE t ZORDER BY (col)",
      "OPTIMIZE t ORDER BY (col)",
      "ZORDER t BY (col)",
      "OPTIMIZE TABLE t ZORDER (col)",
      "ALTER TABLE t ZORDER BY (col)"
    ],
    answer: 0,
    explanation: "正：OPTIMIZE t ZORDER BY (col)。OPTIMIZE がファイル圧縮（コンパクション）、ZORDER BY が指定列でのデータ配置最適化。ORDER BY は通常のソート句で最適化命令ではない（B）。ZORDER 単独文（C）、OPTIMIZE TABLE や BY 欠落（D）、ALTER TABLE への ZORDER（E）はいずれも不正。",
    concept: "OPTIMIZE：小ファイルをまとめて読み取り効率を上げる。ZORDER BY (列)：相関の高い列で近い値を同じファイルに寄せ、データスキップを強化。範囲を絞るなら OPTIMIZE t WHERE 条件 ZORDER BY (列)。なお新版では手動 ZORDER に代えて Liquid Clustering（CLUSTER BY）が推奨される。"
  },
  {
    id: 67, domain: "monitoring",
    question: "Delta テーブルの参照されなくなった古いデータファイルを削除して保存容量を回収したい。保持期間を168時間としてクリーンアップする、正しい構文はどれか。",
    options: [
      "VACUUM t RETAIN 168 HOURS",
      "VACUUM t RETAIN 168",
      "VACUUM t RETAIN 7 DAYS",
      "VACUUM t OLDER THAN 168 HOURS",
      "PURGE t RETAIN 168 HOURS"
    ],
    answer: 0,
    explanation: "正：VACUUM t RETAIN 168 HOURS。単位 HOURS が必須（B は欠落）で、DAYS は受け付けない（C）。OLDER THAN や PURGE という構文は存在しない（D, E）。",
    concept: "VACUUM は不要になった旧ファイルを物理削除する（既定保持は7日＝168時間）。RETAIN <数> HOURS のみ指定可（DAYS 不可）。保持を短くしすぎると時間トラベルや実行中クエリを壊すため下限チェックがある。時間トラベルの履歴自体は保持期間内のみ有効。"
  },
  {
    id: 68, domain: "transformation",
    question: "変更データフィード（CDF）を有効化済みのテーブル t について、バージョン2以降の行レベル変更を SQL で読み出したい。正しい書き方はどれか。",
    options: [
      "SELECT * FROM table_changes('t', 2)",
      "SELECT * FROM t CHANGES SINCE VERSION 2",
      "SELECT * FROM read_change_feed('t', 2)",
      "SELECT * FROM t VERSION AS OF 2",
      "SELECT changes(*) FROM t WHERE _version >= 2"
    ],
    answer: 0,
    explanation: "CDF の SQL 読み出しはテーブル値関数 table_changes('テーブル名', 開始[, 終了])。開始/終了はバージョン整数かタイムスタンプ文字列。CHANGES SINCE や read_change_feed という SQL 構文は存在せず、VERSION AS OF は時間トラベル（差分ではなくその時点の全体像）で用途が違う。",
    concept: "CDF：ALTER TABLE ... SET TBLPROPERTIES (delta.enableChangeDataFeed=true) で有効化 → SQL は table_changes('t', 開始[,終了])、ストリームは .option('readChangeFeed','true')。結果には _change_type（insert/update_preimage/update_postimage/delete）等の列が付く。時間トラベル＝スナップショット、CDF＝変更差分。"
  },
  {
    id: 69, domain: "transformation",
    question: "Delta テーブル t を『バージョン5の内容で参照』し、さらに『テーブル自体をバージョン5の状態へ恒久的に戻す』ことをしたい。正しい構文の組み合わせはどれか。",
    options: [
      "SELECT * FROM t VERSION AS OF 5 ／ RESTORE TABLE t TO VERSION AS OF 5",
      "SELECT * FROM t AS OF VERSION 5 ／ ROLLBACK TABLE t TO VERSION 5",
      "SELECT * FROM t AT VERSION 5 ／ RESTORE t VERSION 5",
      "SELECT * FROM t VERSION 5 ／ REVERT TABLE t TO 5",
      "SELECT * FROM t WHERE _version = 5 ／ RESTORE TABLE t 5"
    ],
    answer: 0,
    explanation: "参照は SELECT ... FROM t VERSION AS OF 5（または TIMESTAMP AS OF '日時'）。恒久的な巻き戻しは RESTORE TABLE t TO VERSION AS OF 5。AS OF VERSION の語順、AT VERSION、VERSION 5（AS OF 欠落）、ROLLBACK/REVERT、_version 列参照はいずれも存在しない/誤り。",
    concept: "時間トラベル：SELECT ... VERSION AS OF <int> ／ TIMESTAMP AS OF '<ts>'（短縮記法 t@v5 / t@yyyyMMddHHmmssSSS もある）。巻き戻しは RESTORE TABLE ... TO VERSION AS OF / TIMESTAMP AS OF。履歴は VACUUM の保持期間内でのみ辿れる。"
  },
  {
    id: 70, domain: "transformation",
    question: "既存テーブル src から、データも含めて完全に独立した複製を1文で作りたい（複製後に元を変更しても複製に影響せず、複製の変更も元に影響しない）。正しい構文はどれか。",
    options: [
      "CREATE TABLE t_copy DEEP CLONE src",
      "CREATE TABLE t_copy SHALLOW CLONE src",
      "CREATE TABLE t_copy AS CLONE src",
      "CLONE TABLE src TO t_copy",
      "COPY TABLE src INTO t_copy"
    ],
    answer: 0,
    explanation: "データまで独立にコピーするのは DEEP CLONE。SHALLOW CLONE はメタデータのみを複製し、データファイルは元テーブルのものを参照するため独立ではない（元の VACUUM 等の影響を受ける）。AS CLONE / CLONE TABLE / COPY TABLE という構文は存在しない。",
    concept: "CLONE：CREATE TABLE 複製名 DEEP|SHALLOW CLONE 元名。DEEP＝データファイルも物理コピー（独立、バックアップ/移行向き）。SHALLOW＝メタデータのみ複製しファイルは共有（高速だが元に依存、短命なテスト/検証向き）。CREATE OR REPLACE や IF NOT EXISTS も併用可。"
  },
  {
    id: 71, domain: "monitoring",
    question: "高カーディナリティ列 region でのデータスキップを、パーティション分割ではなく Liquid Clustering で得たい。テーブル作成時の正しい構文はどれか。",
    options: [
      "CREATE TABLE t (id INT, region STRING) CLUSTER BY (region)",
      "CREATE TABLE t (id INT, region STRING) PARTITIONED BY (region)",
      "CREATE TABLE t (id INT, region STRING) CLUSTERED BY (region) INTO 8 BUCKETS",
      "CREATE TABLE t (id INT, region STRING) ZORDER BY (region)",
      "CREATE TABLE t (id INT, region STRING) CLUSTER ON (region)"
    ],
    answer: 0,
    explanation: "Liquid Clustering は CLUSTER BY (列)。PARTITIONED BY は従来のパーティション分割（高カーディナリティでは小ファイル乱立）で別物。CLUSTERED BY ... INTO n BUCKETS は Hive のバケッティング、ZORDER BY は CREATE 句には書けない（OPTIMIZE 時に使う）、CLUSTER ON は存在しない。",
    concept: "Liquid Clustering：CREATE TABLE ... CLUSTER BY (列)。後から ALTER TABLE t CLUSTER BY (別列) で変更でき、CLUSTER BY AUTO で自動選択も可。整理は OPTIMIZE で継続実行。似た語 CLUSTERED BY（Hive バケッティング）や PARTITIONED BY と1語違いで混同しやすい。"
  },
  {
    id: 72, domain: "ingestion",
    question: "Lakeflow 宣言型パイプライン（旧 Delta Live Tables）で、ソースから増分取り込みするストリーミングテーブルを、現行の推奨 SQL 構文で定義したい。正しいものはどれか。",
    options: [
      "CREATE OR REFRESH STREAMING TABLE t AS SELECT * FROM STREAM(source)",
      "CREATE STREAMING LIVE TABLE t AS SELECT * FROM source",
      "CREATE OR REFRESH LIVE TABLE t AS SELECT * FROM source",
      "CREATE OR REFRESH MATERIALIZED VIEW t AS SELECT * FROM STREAM(source)",
      "CREATE OR REPLACE STREAMING TABLE t AS SELECT * FROM source"
    ],
    answer: 0,
    explanation: "現行は CREATE OR REFRESH STREAMING TABLE ... AS SELECT ... FROM STREAM(...)。STREAMING LIVE TABLE / LIVE TABLE は旧 DLT の古い構文。マテリアライズドビューは増分ストリーム取り込み用ではない。OR REPLACE ではなく OR REFRESH を使う。",
    concept: "用語刷新（新版考纲）：DLT → 『Lakeflow 宣言型パイプライン』。STREAMING LIVE TABLE → STREAMING TABLE、LIVE TABLE → MATERIALIZED VIEW。増分・追記型ソースは STREAMING TABLE ＋ STREAM(...)／read_files、変換の再計算ビューは MATERIALIZED VIEW。CREATE OR REFRESH が定型。"
  },

  {
    id: 73, domain: "governance",
    question: "Unity Catalog で、既存テーブル t の email 列に列マスク関数 mask_email を適用したい。正しい構文はどれか。",
    options: [
      "ALTER TABLE t ALTER COLUMN email SET MASK mask_email",
      "ALTER TABLE t ADD MASK mask_email ON (email)",
      "ALTER TABLE t ALTER COLUMN email ADD MASK mask_email",
      "ALTER TABLE t SET COLUMN MASK email = mask_email",
      "GRANT MASK mask_email ON COLUMN email TO users"
    ],
    answer: 0,
    explanation: "列マスクは ALTER TABLE ... ALTER COLUMN <列> SET MASK <関数>。SET であって ADD ではない（C）。ADD MASK ON / SET COLUMN MASK / GRANT MASK という構文は存在しない。",
    concept: "UC の細粒度アクセス制御（いずれも SQL UDF ベース）：列マスク＝ALTER TABLE t ALTER COLUMN c SET MASK f [USING COLUMNS (...)]、行フィルタ＝ALTER TABLE t SET ROW FILTER f ON (列)。解除は DROP MASK / DROP ROW FILTER。多数テーブルへ一元適用したい場合はタグ＋ABAC が発展形。"
  },

  /* ===== 追加：コンピュート応用・シナリオ（74〜83） ===== */

  {
    id: 74, domain: "platform",
    question: "複数のデータエンジニア／アナリストが同じクラスターにノートブックをアタッチし、対話的にコードを試しながら共同で開発したい。最適なコンピュートはどれか。",
    options: [
      "汎用（All-purpose）クラスター",
      "ジョブクラスタ",
      "サーバーレス SQL ウェアハウス",
      "シングルノードのジョブクラスタ",
      "クラスタープールのみ（クラスターは作らない）"
    ],
    answer: 0,
    explanation: "対話的な共同開発は汎用（All-purpose）クラスター。ノートブックをアタッチして複数人で試行錯誤できる。ジョブクラスタは自動ジョブ実行専用で、ジョブ終了とともに消えるため対話開発に使えない。SQL ウェアハウスは SQL/BI 用。プールは起動を速める土台で、それ単体は計算実体ではない。",
    concept: "コンピュートの用途別：汎用（対話・共同開発、DBU 単価高）／ジョブ（自動ジョブ実行、実行時のみ起動し DBU 単価安）／SQL ウェアハウス（SQL/BI）／サーバーレス各種（Databricks 管理・即応）。まず『対話開発か、自動実行か、SQL/BI か』で切り分ける。"
  },
  {
    id: 75, domain: "platform",
    question: "毎晩スケジュール実行される本番 ETL ジョブを、実行時のみ起動して完了後は自動で終了し、対話開発用より低コストで動かしたい。最適なのはどれか。",
    options: [
      "ジョブクラスタ（またはサーバーレスジョブ）",
      "汎用クラスターを常時起動しておく",
      "SQL ウェアハウス",
      "シングルノードの汎用クラスターを常時起動",
      "手動起動の汎用クラスター"
    ],
    answer: 0,
    explanation: "自動化された本番ジョブはジョブクラスタ（またはサーバーレスジョブ）が定石。実行時のみ起動し完了で自動終了、DBU 単価も汎用より安い。汎用の常時起動はアイドル課金と高い単価でコスト増。SQL ウェアハウスは用途違い。",
    concept: "ジョブ compute はジョブごとに起動→終了するため、スケジュール実行の本番 ETL に最適でコスト効率が高い。対話開発用の汎用クラスターを本番自動ジョブに流用するのはアンチパターン。"
  },
  {
    id: 76, domain: "platform",
    question: "サーバーレス SQL ウェアハウスで、昼間に多数のアナリストが同時にクエリを投げてキューイング（待ち）が発生している。1 クエリあたりのデータ量は変わっていない。まず調整すべきはどれか。",
    options: [
      "最大クラスタ数を増やしてスケールアウトする",
      "ウェアハウスのサイズ（2X-Small→Small→…）を上げる",
      "Photon を無効化する",
      "自動停止を無効化する",
      "ノートブックの数を増やす"
    ],
    answer: 0,
    explanation: "同時実行によるキューイングは『クラスタ数』を増やすスケールアウトで解消する。サイズ（t シャツサイズ）を上げるのは 1 クエリの処理能力・大データ向けのスケールアップで、同時実行数の問題は解けない。Photon 無効化や自動停止無効化、ノートブック数は無関係。",
    concept: "SQL ウェアハウスの 2 つのスケール軸：クラスタ数（最小〜最大）＝同時実行数（キュー）に応じ横に増減（スケールアウト）／サイズ＝1 クエリの性能・扱えるデータ量（スケールアップ）。『同時実行が詰まる＝クラスタ数』『1 クエリが重い＝サイズ』と切り分ける。"
  },
  {
    id: 77, domain: "platform",
    question: "対話開発用の汎用クラスターを使い終わって放置すると、夜間もアイドル状態で課金され続けてしまう。無駄なアイドル課金を防ぐ最適な設定はどれか。",
    options: [
      "一定アイドル時間での自動終了（auto-termination）を設定する",
      "クラスターサイズを大きくする",
      "Photon を有効化する",
      "自動スケーリングを無効化する",
      "ドライバをより大きいインスタンスにする"
    ],
    answer: 0,
    explanation: "自動終了（auto-termination）は、指定したアイドル時間が経過すると自動でクラスターを停止し、アイドル課金を止める。サイズ拡大・Photon・スケーリング無効化・ドライバ大型化はいずれもアイドル課金の抑制策ではない。",
    concept: "アイドル課金対策の基本は自動終了。サーバーレスは使い終わると即座に自動停止するのが既定で、この手の放置課金が起きにくいのも利点。"
  },
  {
    id: 78, domain: "platform",
    question: "あるジョブは処理の途中で負荷が大きく変動し、固定ワーカー数だと時に不足・時に余剰になる。負荷に応じてワーカー数を自動で増減させたい。設定はどれか。",
    options: [
      "自動スケーリング（最小〜最大ワーカー）を有効化する",
      "クラスタープールを使う",
      "ドライバをより大きいインスタンスにする",
      "自動終了を無効化する",
      "シングルノードクラスターにする"
    ],
    answer: 0,
    explanation: "自動スケーリングは負荷に応じてワーカーを『最小〜最大』の範囲で自動増減させる。クラスタープールは起動を速める仕組みで増減とは別物、ドライバ大型化・自動終了無効化・シングルノードはいずれも負荷変動への自動対応策ではない。",
    concept: "自動スケーリング＝ワーカー数を負荷に合わせ動的に増減（スケールアウト/イン）。クラスタープール＝起動時の VM 調達待ちを短縮（別問題）。混同しやすいので用途で区別する。"
  },
  {
    id: 79, domain: "governance",
    question: "Unity Catalog 配下で、複数ユーザーが 1 つのクラスターを共有しつつ、各自のアイデンティティ（権限）で UC のガバナンスを効かせて使いたい。設定すべきアクセスモードはどれか。",
    options: [
      "共有（標準 / Standard、旧 Shared）アクセスモード",
      "シングルユーザー（専用 / Dedicated、旧 Single user）アクセスモード",
      "分離なし（No isolation）アクセスモード",
      "汎用アクセスモード",
      "サーバーレスアクセスモード"
    ],
    answer: 0,
    explanation: "複数ユーザーが各自の ID で安全に共用し UC のガバナンスを適用するのは共有（標準）アクセスモード。シングルユーザー（専用）は 1 ユーザー/1 プリンシパル専有向け。分離なしは UC 非対応で非推奨。『汎用/サーバーレスアクセスモード』というモード名は存在しない。",
    concept: "UC クラスターのアクセスモード：共有（標準/Standard）＝複数ユーザーが各自の ID で共用、UC 適用／シングルユーザー（専用/Dedicated）＝1 ユーザーまたは 1 サービスプリンシパルに割当。No isolation は UC を強制できないレガシー。名称は Shared→Standard、Single user→Dedicated に改称。"
  },
  {
    id: 80, domain: "governance",
    question: "Unity Catalog 環境で、機械学習ランタイムを使いたい／共有モードでは未サポートのライブラリや機能が必要／あるいはジョブを特定のサービスプリンシパルとして実行したい。適したアクセスモードはどれか。",
    options: [
      "シングルユーザー（専用 / Dedicated）アクセスモード",
      "共有（標準 / Standard）アクセスモード",
      "分離なし（No isolation）アクセスモード",
      "SQL ウェアハウス",
      "Photon"
    ],
    answer: 0,
    explanation: "ML ランタイムの利用、共有モードで未対応の機能・ライブラリ、特定プリンシパルでの実行はシングルユーザー（専用）アクセスモードが適する。共有（標準）は複数ユーザー向けで一部機能に制約がある。SQL ウェアハウスや Photon はアクセスモードではない。",
    concept: "迷ったときの指針：複数人で安全に共用＝共有（標準）／フル機能・特定 ID 専有（ML ランタイム、一部ライブラリ、サービスプリンシパル実行など）＝シングルユーザー（専用）。"
  },
  {
    id: 81, domain: "platform",
    question: "あるジョブは、OS レベルの依存を入れるカスタム init スクリプトと特定のインスタンスタイプを必要とする。サーバーレスジョブでは構成できなかった。適切な代替はどれか。",
    options: [
      "クラシックのジョブクラスタを使い、自分で構成する",
      "要件を無視してサーバーレスを使い続ける",
      "SQL ウェアハウスに切り替える",
      "データエクスプローラーを使う",
      "Unity カタログを使う"
    ],
    answer: 0,
    explanation: "サーバーレスは省運用・即応な反面、カスタム init スクリプトや任意のインスタンスタイプ指定など細かな構成に制約がある。そうした要件があるならクラシックのジョブクラスタで自分で構成するのが適切。SQL ウェアハウス／データエクスプローラー／Unity カタログは用途が異なる。",
    concept: "サーバーレスは既定・第一候補だが万能ではない：カスタム init スクリプト、特定インスタンスタイプ、GPU、特定 DBR バージョンなどが必要な場合はクラシック（ジョブ/汎用）クラスタが必要になることがある。『serverless が使えない要件』を見抜くのがポイント。"
  },
  {
    id: 82, domain: "platform",
    question: "多数の短時間ジョブを高頻度で起動しており、そのたびの起動待ち（クラウド VM 調達で数分）を避けたい。次のうち最も適切な判断はどれか。",
    options: [
      "サーバーレスジョブが使えるならそれを第一候補にし（秒起動・プール管理不要）、使えない事情でクラシックなら クラスタープールで起動待ちを短縮する",
      "汎用クラスターを常時起動して使い回す",
      "ドライバを大型インスタンスにすれば起動が速くなる",
      "Photon を有効化すれば起動待ちが消える",
      "自動終了を無効化して起動しっぱなしにする"
    ],
    answer: 0,
    explanation: "起動待ち対策の第一候補はサーバーレス（Databricks 側で温存され数秒で起動、プール管理も不要）。クラシックしか使えない事情がある場合の対策がクラスタープール（自アカウントにアイドル VM を事前確保）。両者は同じ問題への別ルート。汎用常時起動はコスト増、ドライバ大型化や Photon は起動待ちを解消しない。",
    concept: "起動待ちの二択：サーバーレス（プロバイダ側が温存、pool 不要、新版の既定路線）／クラスタープール（classic 用に自分でアイドル VM 確保）。空きプール VM に Databricks の DBU は課金されないが、クラウドの VM 料金は発生する点も要注意。"
  },
  {
    id: 83, domain: "monitoring",
    question: "中断されても再試行で回復できる耐障害性のあるバッチ処理について、コストを最小化したい。最もコスト効率の良い構成はどれか。",
    options: [
      "ワーカーにスポット（プリエンプティブル）インスタンス、ドライバはオンデマンドにする",
      "ドライバもワーカーもすべて最大サイズのオンデマンドにする",
      "ドライバもワーカーもすべてスポットに固定する",
      "汎用クラスターを常時起動しておく",
      "自動終了を無効化する"
    ],
    answer: 0,
    explanation: "スポットは大幅に安いが予告付きで回収（中断）されうる。回復可能なワーカーにスポットを使い、失うとジョブ全体が落ちるドライバはオンデマンドにするのが定石。全部スポットはドライバ喪失のリスクが高く、全部オンデマンド最大は割高。",
    concept: "スポット／プリエンプティブルインスタンス＝クラウドの余剰 VM を安価に使うが回収されることがある。耐障害ワークロードのワーカーに向く。ドライバはオンデマンドで守るのがセオリー。"
  },

  /* ===== 追加：大綱ギャップ補完（84〜95） ===== */

  {
    id: 84, domain: "ingestion",
    question: "企業の SaaS / RDB（Salesforce、SQL Server 等）から、コネクタを設定するだけで Unity Catalog 管理テーブルへ確実に取り込みたい。自前のストリーミングコードは書きたくない。最適な方法はどれか。",
    options: [
      "Lakeflow Connect のマネージドコネクタを使う",
      "Auto Loader（cloudFiles）でクラウドストレージを監視する",
      "COPY INTO を毎時実行する",
      "Databricks Connect で IDE から接続する",
      "Partner Connect で BI ツールを繋ぐ"
    ],
    answer: 0,
    explanation: "SaaS/RDB 等の企業ソースからコード無しで UC 管理テーブルへ取り込むのは Lakeflow Connect（マネージド/標準コネクタ）。Auto Loader と COPY INTO は『クラウドストレージ上のファイル』取り込み用で SaaS/DB 直結ではない。Databricks Connect は開発接続、Partner Connect は外部ツール連携の入口で取り込みエンジンではない。",
    concept: "取り込み方式の使い分け（新版考纲の重点）：Auto Loader / COPY INTO＝クラウドストレージのファイル ／ Lakeflow Connect＝SaaS・RDB 等の企業ソース（マネージドコネクタ＝Databricks 運用、標準コネクタ）。データ量・頻度・ソース種別・UC ガバナンス要件で選ぶ。"
  },
  {
    id: 85, domain: "ingestion",
    question: "Auto Loader で、ソースディレクトリに膨大な数のファイルがあり、ディレクトリ一覧の走査コストが高くなっている。新規ファイル検知をより低コスト・低レイテンシにしたい。どうするか。",
    options: [
      "ファイル通知（file notification）モードを使う",
      "ディレクトリ一覧（directory listing）モードのままにする",
      "COPY INTO に切り替える",
      "trigger(availableNow=True) にする",
      "cloudFiles.schemaLocation を削除する"
    ],
    answer: 0,
    explanation: "大量ファイルではディレクトリ一覧の走査が高コスト。ファイル通知モードはクラウドの通知サービス（イベント＋キュー）で新規ファイルを検知し、一覧走査を避けて低コスト・低レイテンシになる。既定はディレクトリ一覧。trigger や schemaLocation は検知方式とは無関係。",
    concept: "Auto Loader の2つのファイル検知モード：ディレクトリ一覧（既定、少〜中規模で設定簡単）／ファイル通知（クラウドの通知＋キューを使い、超大量ファイルで効率的・低レイテンシ）。cloudFiles.useNotifications 等で切替。"
  },
  {
    id: 86, domain: "transformation",
    question: "billing_df を billing_date ごとに集計し、日次の合計金額と『ユニークな請求書数（billing_id の重複なし件数）』を出したい。正しい PySpark はどれか。",
    options: [
      "billing_df.groupBy('billing_date').agg(sum('amount').alias('rev'), count_distinct('billing_id').alias('inv'))",
      "billing_df.groupBy('billing_date').agg(sum('amount'), sum('billing_id'))",
      "billing_df.groupBy('billing_date').agg(sum('amount'), count('billing_id'))",
      "billing_df.groupBy('billing_date').agg(count('amount'), count_distinct('patient_id'))",
      "billing_df.groupBy('billing_date').agg(avg('amount'), count('*'))"
    ],
    answer: 0,
    explanation: "ユニーク件数は count_distinct（重複を除いた個数）。sum('billing_id') は ID を足す無意味な計算、count('billing_id') は重複込みの件数、patient_id は請求書ではなく患者、avg/count('*') は要件と別。合計は sum('amount')。",
    concept: "代表的な集計関数：sum（合計）／count（件数・重複込み）／count_distinct（重複なし件数）／approx_count_distinct（近似の重複なし件数・大規模で高速）／avg・mean（平均）。『ユニーク数』は count_distinct、超大規模で速度優先なら approx_count_distinct。"
  },
  {
    id: 87, domain: "transformation",
    question: "2つの DataFrame を縦に連結したい。重複行も取り除かずそのまま残す、最も一般的な方法はどれか。",
    options: [
      "df1.union(df2)",
      "df1.union(df2).distinct() を必ず使う",
      "df1.join(df2)",
      "df1.intersect(df2)",
      "df1.exceptAll(df2)"
    ],
    answer: 0,
    explanation: "Spark の DataFrame .union() は SQL の UNION ALL 相当で、重複行を残したまま縦に連結する（列は位置で対応）。重複を除きたい場合のみ後段に .distinct() を付ける。join は横結合、intersect は共通行のみ、exceptAll は差分で用途が違う。",
    concept: "縦結合：SQL では UNION（重複除去）と UNION ALL（重複保持）が別。ただし Spark DataFrame の .union() は『列位置で対応・重複保持』＝UNION ALL 挙動。列名で揃えたいなら unionByName、重複除去は .union().distinct()。"
  },
  {
    id: 88, domain: "transformation",
    question: "大きなシャッフルを伴う集計が遅い。シャッフル後のパーティション数を調整して並列度を最適化したい。まず見るべき設定はどれか。",
    options: [
      "spark.sql.shuffle.partitions",
      "spark.sql.autoBroadcastJoinThreshold",
      "spark.driver.memory",
      "spark.executor.cores",
      "delta.enableChangeDataFeed"
    ],
    answer: 0,
    explanation: "シャッフル後のパーティション数は spark.sql.shuffle.partitions（既定 200）。autoBroadcastJoinThreshold はブロードキャスト結合の閾値、driver.memory はドライバメモリ、executor.cores は並列コア数、CDF は変更フィードで用途が異なる。",
    concept: "主なチューニングパラメータ：spark.sql.shuffle.partitions（シャッフル後の分割数）／spark.sql.autoBroadcastJoinThreshold（この閾値以下のテーブルを自動ブロードキャスト結合）／spark.executor|driver.memory（メモリ）／spark.default.parallelism。症状に合わせ調整→再計測。"
  },
  {
    id: 89, domain: "transformation",
    question: "Gold 層で、BI 向けに『複数テーブルを結合・集計した結果を実体化し、ソース更新に応じて増分的に再計算される』オブジェクトを作りたい。最適なのはどれか。",
    options: [
      "マテリアライズドビュー（Materialized View）",
      "通常のビュー（View）",
      "ストリーミングテーブル（Streaming Table）",
      "一時ビュー（Temp View）",
      "グローバル一時ビュー（Global Temp View）"
    ],
    answer: 0,
    explanation: "結合・集計の結果を実体化し増分再計算するのはマテリアライズドビュー。通常ビューは都度計算で実体化しない、ストリーミングテーブルは追記型の増分取り込み向け（集計の再計算用ではない）、一時/グローバル一時ビューはセッションスコープで永続共有できない。",
    concept: "Gold 層オブジェクトの使い分け：ビュー（都度計算・保存なし）／マテリアライズドビュー（結果を実体化・増分更新、集計/結合の高速化）／ストリーミングテーブル（追記・増分取り込み）／テーブル（実体）。BI 集計の実体化ならマテリアライズドビュー。"
  },
  {
    id: 90, domain: "transformation",
    question: "PySpark で、列 old_name を new_name に改名し、不要な列 tmp を削除したい。正しい組み合わせはどれか。",
    options: [
      "df.withColumnRenamed('old_name','new_name').drop('tmp')",
      "df.rename('old_name','new_name').dropColumn('tmp')",
      "df.withColumn('new_name','old_name').remove('tmp')",
      "df.alias('new_name').drop('tmp')",
      "df.select(rename('old_name')).drop('tmp')"
    ],
    answer: 0,
    explanation: "改名は withColumnRenamed(既存, 新)、列削除は drop('列')。rename / dropColumn / remove は PySpark DataFrame のメソッドとして存在せず、withColumn は列の追加・式での置換で改名ではない、alias は DataFrame 別名で列改名ではない。",
    concept: "列・行操作：withColumnRenamed（改名）／drop（列削除）／withColumn（列追加・式で置換）／select（射影）／filter・where（行絞り込み）／explode（配列を行展開）。メソッド名を正確に覚える。"
  },
  {
    id: 91, domain: "jobs",
    question: "Lakeflow ジョブで、1つのジョブに『ノートブック実行 → SQL クエリ → LDP パイプライン更新 → ダッシュボード更新』を依存関係を付けて並べたい。最も正しい記述はどれか。",
    options: [
      "ノートブック/SQL/パイプライン/ダッシュボード等の複数タスクタイプを DAG（依存関係）で1ジョブに構成できる",
      "1ジョブには1タスクしか置けない",
      "タスクはノートブックタイプしか存在しない",
      "タスク間に依存関係は設定できず、常に並列実行になる",
      "SQL はジョブのタスクとして実行できない"
    ],
    answer: 0,
    explanation: "Lakeflow ジョブは複数のタスクタイプ（ノートブック、SQL クエリ、LDP パイプライン、ダッシュボード更新 等）を DAG の依存関係で1つのジョブに組める。1タスク限定・依存不可・SQL 不可などはすべて誤り。",
    concept: "Lakeflow ジョブのタスクタイプ：ノートブック／SQL（クエリ・ファイル）／LDP パイプライン／ダッシュボード更新／dbt／Python スクリプト・wheel／他ジョブ実行 等。タスクは DAG で依存関係・条件分岐（run if）・リトライを設定できる。"
  },
  {
    id: 92, domain: "monitoring",
    question: "あるジョブクラスターが起動直後に失敗する。ログにはインストール予定の Python ライブラリのバージョン競合が出ている。第一に疑い・対処すべきはどれか。",
    options: [
      "クラスターにインストールするライブラリ（依存）の競合を解消する",
      "テーブルのデータスキューを是正する",
      "OPTIMIZE ... ZORDER を実行する",
      "シャッフルパーティション数を増やす",
      "ダッシュボードを更新する"
    ],
    answer: 0,
    explanation: "『起動直後に失敗＋ライブラリのバージョン競合ログ』なら、原因はライブラリ/依存の競合。互換バージョンに揃える、クラスタライブラリや init スクリプトを見直す。データスキュー・ZORDER・パーティション数・ダッシュボードは実行時の性能や BI の話で、起動失敗とは層が違う。",
    concept: "クラスター起動失敗の主因：ライブラリ/依存の競合、init スクリプトのエラー、権限やクラウド VM 調達の失敗、非対応の DBR/インスタンス。ログの該当メッセージから切り分ける。実行時の遅さ（スキュー/spill）とは別レイヤ。"
  },
  {
    id: 93, domain: "governance",
    question: "クラウドストレージ上の既存データ場所を Unity Catalog から参照し、DROP してもファイルは残る形（外部テーブル）で作りたい。正しいのはどれか。",
    options: [
      "CREATE TABLE ext_t (...) USING DELTA LOCATION 's3://.../ext_t'",
      "CREATE TABLE ext_t (...) USING DELTA（LOCATION は書かない）",
      "CREATE EXTERNAL DATABASE ext_t LOCATION 's3://.../ext_t'",
      "CREATE MANAGED TABLE ext_t LOCATION 's3://.../ext_t'",
      "CREATE TABLE ext_t (...) EXTERNAL = true"
    ],
    answer: 0,
    explanation: "LOCATION を明示して作ると外部テーブルになり、DROP してもストレージ上のデータファイルは残る。LOCATION 省略はマネージドテーブル（DROP でデータも削除）。CREATE EXTERNAL DATABASE / CREATE MANAGED TABLE / EXTERNAL = true という構文は存在しない。",
    concept: "マネージド vs 外部テーブル：LOCATION 省略＝マネージド（UC がデータも管理、DROP で実データも消える）／LOCATION 明示＝外部（UC はメタデータのみ管理、DROP してもファイルは残る）。外部管理データの参照・移行に外部テーブルを使う。"
  },
  {
    id: 94, domain: "governance",
    question: "あるグループから、以前付与したスキーマ s への SELECT 権限を取り消したい。正しい SQL はどれか。",
    options: [
      "REVOKE SELECT ON SCHEMA s FROM analysts",
      "GRANT SELECT ON SCHEMA s TO analysts WITH DENY",
      "DROP GRANT SELECT ON SCHEMA s FROM analysts",
      "DELETE PERMISSION SELECT ON SCHEMA s",
      "UNGRANT SELECT ON SCHEMA s FROM analysts"
    ],
    answer: 0,
    explanation: "付与の取り消しは REVOKE ... FROM。DROP GRANT / DELETE PERMISSION / UNGRANT / WITH DENY という構文は存在しない。明示的に禁止したい場合は別途 DENY 文を使う（REVOKE＝付与を外す、DENY＝明示的に拒否し継承より優先）。",
    concept: "UC の権限操作：GRANT（付与）／REVOKE（付与の取り消し）／DENY（明示的な拒否、継承より優先）。対象は principals（ユーザー/グループ/サービスプリンシパル）。下位を使うには上位の USE CATALOG・USE SCHEMA も必要（階層的権限）。"
  },
  {
    id: 95, domain: "platform",
    question: "Delta Lake が ACID トランザクション・タイムトラベル・スキーマ強制を実現する中核の仕組みはどれか。",
    options: [
      "トランザクションログ（_delta_log、JSON＋チェックポイント）",
      "ファイル名の命名規則だけ",
      "Hive メタストアのテーブル定義",
      "CSV のヘッダー行",
      "クラスターのメモリキャッシュ"
    ],
    answer: 0,
    explanation: "Delta はテーブルディレクトリ内のトランザクションログ（_delta_log）に各コミットを順序付きで記録し、これが ACID・タイムトラベル（過去バージョン参照）・スキーマ強制/進化を支える。ファイル名規則やメタストア定義、CSV ヘッダ、メモリキャッシュではない。",
    concept: "Delta Lake ＝ Parquet データ ＋ トランザクションログ（_delta_log）。ログがコミット履歴を持つため、ACID、タイムトラベル（VERSION/TIMESTAMP AS OF）、スキーマ強制・進化、MERGE/UPDATE/DELETE が可能になる。Lakehouse の基盤フォーマット。"
  },

];
