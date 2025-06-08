import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../stacks/backend-stack';
import { CodeStorageStack } from '../stacks/code-storage-stack';
import { DynamoDbStack } from '../stacks/dynamodb-stack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') || 'dev';
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

// 依存するスタックを生成
const dynamo = new DynamoDbStack(app, `DynamoDbStack-${stage}`, { stage, env });
const code = new CodeStorageStack(app, `CodeStorageStack-${stage}`, { stage, env });

// backend だけ対象
new BackendStack(app, `BackendStack-${stage}`, {
  stage,
  env,
  table: dynamo.table,
  codeBucket: code.codeBucket,
});
