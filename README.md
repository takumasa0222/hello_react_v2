# Hello React Project

このリポジトリは、React によるシンプルなフロントエンドアプリケーションと、AWS のサーバーレスアーキテクチャを組み合わせた Web サービスのデモプロジェクトです。インフラはすべて AWS CDK によってコードで管理されており、CI/CD パイプラインを通じて完全自動でデプロイされます。
V2 では、アプリケーションコード・インフラコードを分割し、DB のマイグレーションや新規作成に強いコードを作成しました。
また、Bootstrap を組み込むことによって、初回のみ実行が必要であるコードとそのほかのコードを分けました。
AWS 環境における命名規則に従うことによって、より柔軟にアプリケーションのデプロイを行うことが可能です。
現在の命名規則：
<アプリケーション名>-<AWS リソース名>-<環境名>

---

## 🚀 主な機能と構成

### フロントエンド
- React + TypeScript による SPA
- CloudFront 経由で S3 にホストされた静的ファイルを配信

### バックエンド
- API Gateway + AWS Lambda による REST API 構成
- DynamoDB をデータストアとして使用
- CORS 対応済みのサーバーレス API

### インフラストラクチャ
- AWS CDK (TypeScript) による Infrastructure as Code
- ステージ（`dev`, `prod`）ごとの動的構成切り替え
- Lambda, API Gateway, S3, CloudFront, DynamoDB を定義・管理

### CI/CD
- GitHub Actions による自動ビルド＆デプロイ
- コミットまたは手動トリガーによる CDK デプロイと S3 アップロード

---

## ディレクトリ構成

hello_react_v2/
├── backend/ # Lambda 関数のソースコード
├── frontend/ # React アプリケーション
├── infrastructure/ # AWS CDK スタック定義
├── .github/workflows/ # GitHub Actions 定義
├── .env.deploy # CI で読み込む定数ファイル
└── cdk-outputs.json # CDK 実行時の出力ファイル

---

## 技術スタック

- Frontend: **React (v19)** + **TypeScript**
- Backend: **Node.js v22** + **AWS Lambda**
- Infra as Code: **AWS CDK (TypeScript)**
- API: **API Gateway**
- DB: **DynamoDB**
- CDN & Hosting: **CloudFront** + **S3**
- CI/CD: **GitHub Actions**

---

## 環境変数
ローカル・CI 環境で使用する変数は .env.deploy にて管理されています。CI 上では $GITHUB_ENV 経由で渡され、各ディレクトリを柔軟に切り替えることが可能です。

例：

CDK_DIR=infrastructure
FRONTEND_DIR=frontend
BACKEND_DIR=backend
AWS_REGION=ap-northeast-1

---