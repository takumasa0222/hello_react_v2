# Hello React Project

このリポジトリは、React によるシンプルなフロントエンドアプリケーションと、AWS のサーバーレスアーキテクチャを組み合わせた Web サービスのデモプロジェクトです。インフラはすべて AWS CDK によってコードで管理されており、CI/CD パイプラインを通じて完全自動でデプロイされます。
V2 では、アプリケーションコード・インフラコードを分割し、DB のマイグレーションや新規作成に強いコードを作成しました。

また、Bootstrap を分割することによって、初回のみ実行が必要であるコードとそのほかのコードを分けました。
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
- Prod 環境では Aurora Serveless v2、Dev 環境では DynamoDB をデータストアとして使用
- Prod 環境では、VPC を用意。
- CORS 対応済みのサーバーレス API

### インフラストラクチャ
- AWS CDK (TypeScript) による Infrastructure as Code
- ステージ（`dev`, `prod`）ごとの動的構成切り替えを実装。Dev ではより速い開発を目指すため、特に Backend Stack を構成する際にインフラストラクチャの再構成は行わず、コードをアップデートします。
- Lambda, API Gateway, S3, CloudFront, DynamoDB, Aurora Serveless v2, VPC, IAM policy, SecurityGroup を定義・管理

### CI/CD
- GitHub Actions による半自動ビルド＆デプロイ
- 手動トリガーによる CDK デプロイと S3 アップロード

---

### 設計戦略とアーキテクチャ上の工夫
本プロジェクトでは、開発・本番環境の違いに応じた 柔軟性 と 拡張性 を重視した設計を採用
### 初回デプロイと更新の完全分離

- 初期化専用の Bootstrap スタックにて、OIDC ロール・S3 バケット・Secrets Manager などを初回のみ作成。
- 通常のデプロイではスタック単位で差分を検出し、必要なリソースのみを安全に更新。

### Dev / Prod で異なるデプロイ戦略

| 環境 | 特徴 |
|------|------|
| Dev | Lambda コードを即時反映。CloudFormation を経由せず、バックエンドコードのアップデート実行。 |
| Prod | CloudFormation による厳密な構成管理。S3 バージョニングと Lambda の `VersionId` 指定による安定した更新を実現。 |

### アプリケーションコードとインフラコードの分離

- Lambda コード・フロントエンドビルドはそれぞれ S3 に保存され、インフラ構成とは独立してデプロイ。
- コード更新は S3 アップロード後、環境に応じて Lambda にバージョンIDを指定して反映。(Prod 環境ではバージョン管理)

### CI/CD のモジュール化

- frontend / backend / db / network ごとにワークフローを独立させ、変更のあった部分のみを個別にデプロイ可能。
- 初回のみ必要なワークフロー（Bootstrap）も明示的に分離。
- `cdk deploy` を Bash スクリプトで自動化。

### 命名規則と依存解決の工夫

- `<アプリ名>-<リソース名>-<環境名>` の命名規則に統一し、スタック間での参照を動的に解決。
- 依存関係（例: Lambda → S3, Secrets Manager / Lambda → API Gateway）を IAM ポリシーやバケットポリシーで適切に制御。

---

##  セキュアな構成：Secrets Manager の活用

- 本番環境では Secrets Manager を使用し、Aurora Serverless の接続情報などを暗号化して保存。
- Lambda 関数には IAM ポリシーを用いて最低限のアクセス権限を付与し、安全かつ動的に参照。
- Dev 環境では必要に応じて Systems Manager Parameter Store を併用し、環境ごとの切り替えを柔軟に実現。

---

## ディレクトリ構成
```
hello_react_v2/
├── backend/ # Lambda 関数のソースコード
├── frontend/ # React アプリケーション
├── infrastructure/ # AWS CDK スタック定義
├── .github/workflows/ # GitHub Actions 定義
├── .env.deploy # CI で読み込む定数ファイル
└── cdk-outputs.json # CDK 実行時の出力ファイル
```
---

## 技術スタック

- Frontend: **React (v19)** + **TypeScript**
- Backend: **Node.js v22** + **AWS Lambda**
- Infra as Code: **AWS CDK (TypeScript)**
- API: **API Gateway**
- DB: **DynamoDB または  Aurora Serveless v2**
- CDN & Hosting: **CloudFront** + **S3**
- CI/CD: **GitHub Actions**

---

## 環境変数
Github リポジトリ変数に下記の値を設定いただくことで、動作します。
```markdown
 Type             | Variable name           | 用途                   
------------------|-------------------------|-----------------------
 Variable         | `aws_account_id`        | AWS アカウント ID      
 Variable         | `aws_region`            | リージョン名           
 Variable         | `cdk_role_name`         | CDK 実行ロール名       
 Variable         | `cdk_dir`               | CDK のディレクトリ名    
 Variable         | `frontend_dir`          | フロントエンドのパス    
 Variable         | `backend_dir`           | バックエンドのパス      
 Secret（初回用）  | `aws_access_key_id`     | OIDC ロール作成時に使用 
 Secret（初回用）  | `aws_secret_access_key` | 同上                   
---
