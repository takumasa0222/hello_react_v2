#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { createResourceName } from '../lib/utils/naming';
import { DatabaseStack } from '../lib/stacks/db/database-stack';
import { BackendStack } from '../lib/stacks/backend/backend-stack';
import { FrontendStack } from '../lib/stacks/frontend/frontend-stack';
import { NetworkStack } from '../lib/stacks/network/network-stack';
import { STAGES } from '../lib/constants';
import { DBStackprops } from '../lib/interfaces/database-props';

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

  let dbProps:DBStackprops = {
	stage,
	appname,
	env: commonEnv,
  };

//   let networkStack;
//   if (stage == STAGES.PROD) {
//   	networkStack = new NetworkStack(app, createResourceName(appname, 'Network', stage), commonProps);
// 	  dbProps = {
// 		stage,
// 		appname,
// 		env: commonEnv,
// 		vpc: networkStack.vpc
// 	  };
//   }
  const dbStack = new DatabaseStack(app, createResourceName(appname, 'DB', stage), dbProps);
  const backendStack = new BackendStack(app, createResourceName(appname, 'Backend', stage), commonProps);
  const frontendStack = new FrontendStack(app, createResourceName(appname, 'Frontend', stage), commonProps);
  
//   if (stage == STAGES.PROD && networkStack) {
// 	dbStack.addDependency(networkStack);
//   }
  backendStack.addDependency(dbStack);
  frontendStack.addDependency(backendStack);

