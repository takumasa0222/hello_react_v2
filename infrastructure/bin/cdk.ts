#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { createResourceName } from '../lib/utils/naming';
import { DatabaseStack } from '../lib/stacks/db/database-stack';
import { BackendStack } from '../lib/stacks/backend/backend-stack';
import { FrontendStack } from '../lib/stacks/frontend/frontend-stack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');
const appname = app.node.tryGetContext('appname');


const commonEnv = {
	account: process.env.CDK_DEFAULT_ACCOUNT,
	region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
  };
  
  const commonProps = {
	stage,
	appname,
	env: commonEnv,
  };
  
  const dbStack = new DatabaseStack(app, createResourceName(appname, 'DB', stage), commonProps);
  const backendStack = new BackendStack(app, createResourceName(appname, 'Backend', stage), commonProps);
  const frontendStack = new FrontendStack(app, createResourceName(appname, 'Frontend', stage), commonProps);
  
  backendStack.addDependency(dbStack);
  frontendStack.addDependency(backendStack);

