import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/stacks/frontend/frontend-stack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') || 'dev';
const appname = app.node.tryGetContext('appname');

new FrontendStack(app, `${appname}-Frontend-${stage}`, {
  stage: stage,
  appname: appname,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, 
	region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1"},
});
