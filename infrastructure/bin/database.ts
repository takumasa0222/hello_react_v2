import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/db/database-stack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') || 'dev';
const appname = app.node.tryGetContext('appname');

new DatabaseStack(app, `${appname}-Database-${stage}`, {
  stage: stage,
  appname: appname,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, 
	region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1"},
});
