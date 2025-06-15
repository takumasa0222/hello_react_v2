import * as cdk from 'aws-cdk-lib';
import { GithubOidcRoleStack } from '../lib/stacks/shared/github-oidc-role-stack';
import { GithubOidcProviderStack } from '../lib/stacks/shared/github-oidc-provider-stack';
import { createResourceName } from '../lib/utils/naming';

const app = new cdk.App();
const appname = app.node.tryGetContext("appname");
const stage = app.node.tryGetContext("stage");

const oidcProviderStack = new GithubOidcProviderStack(app, 'GithubOidcProviderStack');
const roleName = createResourceName(appname, 'GithubOidcRoleStack' , stage);
const oidcRoleStack = new GithubOidcRoleStack(app, roleName, {
	stage: stage,
	appname: appname,
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, 
	  region: process.env.CDK_DEFAULT_REGION || "ap-northeast-1"},
  });

  oidcRoleStack.addDependency(oidcProviderStack);
