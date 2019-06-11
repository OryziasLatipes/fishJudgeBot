# diagnosticImaging-app

LINEに送信された画像からCustom visionで画像分類を行い、もっとも可能性の高いタグをBingで検索、判定結果と検索結果のURLをLINEに返却

## 環境変数

* アプリケーション設定

| 名前                   | 説明                           |
| -------------------- | ---------------------------- |
| CHANNEL_ACCESS_TOKEN | LINEのチャネルのアクセストークン           |
| CHANNEL_SECRET       | LINEのチャネルのChannel Secret     |
| PREDICTION_KEY       | Custom visionのPrediction-Key |
| SUBSCRIPTION_KEY     | Custom visionのサブスクリプションキー    |
| BING_SEARCH_KEY      | Custom search v7のサブスクリプションキー |
|WEBSITE_SLOT_NAME | Production |
|FUNCTIONS_EXTENSION_VERSION | ~2 |
|WEBSITE_NODE_DEFAULT_VERSION | 10.14.1 |
|AzureWebJobsStorage |ストレージ情報 |
|FUNCTIONS_WORKER_RUNTIME | node |

## セットアップ

* Function App作成
    * ランタイムスタック　`Javascript`
    * 新しい関数の作成　`HTTP trigger`
* リソースの作成（Custom vision）
* リソースの作成（Custom search v7）
* LINEとFunctionを接続
* FunctionとCustom visionを接続
* Custom visionの学習データを作成
* Custom search v7とFunctionを接続


## 参照

- [Custom search v7](https://docs.microsoft.com/ja-jp/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference) 
- [Custom vision](https://southcentralus.dev.cognitive.microsoft.com/docs/services/fde264b7c0e94a529a0ad6d26550a761/operations/59568ae208fa5e09ecb9983a)
- [LINE Developers](https://developers.line.biz/ja/reference/)
- [Function App](https://docs.microsoft.com/ja-jp/azure/azure-functions/)





