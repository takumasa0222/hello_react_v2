import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs'
import { StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

export class GithubOidcProviderStack extends cdk.Stack {
	public readonly oidcProvider: iam.OpenIdConnectProvider;
  
	constructor(scope: Construct, id: string, props?: StackProps) {
	  super(scope, id, props);
	  this.oidcProvider = new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
		url: 'https://token.actions.githubusercontent.com',
		clientIds: ['sts.amazonaws.com'],
	  });
	}
  }