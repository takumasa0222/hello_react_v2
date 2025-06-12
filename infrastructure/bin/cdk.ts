#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AppStage } from '../lib/app-stage';
import { createResourceName } from '../lib/utils/naming';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');
const appname = app.node.tryGetContext('appname');
const stagename = createResourceName(appname, "AppStack", stage);

new AppStage(app, stagename, {
  stage: stage,
  appname: appname,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, 
		region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1"},

});

