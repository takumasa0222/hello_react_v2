import * as cdk from 'aws-cdk-lib';
import { GithubOidcRoleStack } from '../lib/stacks/shared/github-oidc-role-stack';

const app = new cdk.App();
new GithubOidcRoleStack(app, 'GithubOidcRoleStack');
