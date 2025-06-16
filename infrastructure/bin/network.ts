import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/network/network-stack';


const app = new cdk.App();
const stage = app.node.tryGetContext('stage') || 'dev';
const appname = app.node.tryGetContext('appname');

new NetworkStack(app, `${appname}-Network-${stage}`, {
  stage: stage,
  appname: appname,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, 
	region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1"},
});
