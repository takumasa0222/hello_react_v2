import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/db/database-stack';
import { TableStack } from '../lib/stacks/db/table-stack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') || 'dev';
const appname = app.node.tryGetContext('appname');

const databaseStack = new DatabaseStack(app, `${appname}-Database-${stage}`, {
  stage: stage,
  appname: appname,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, 
	region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1"},
});

const tableStack = new TableStack(app, `${appname}-Database-${stage}`,{
	stage: stage,
	appname: appname,
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, 
	  region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1"},
});

tableStack.addDependency(databaseStack);
