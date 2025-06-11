import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IAM } from '../../constants/iam.constants';
import { createResourceName } from '../../utils/naming';
import { createGithubActionsPolicy } from '../../policies/github-actions-policy';

export class GithubOidcRoleStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props);
    const appname = this.node.tryGetContext("appname");
    const stage = this.node.tryGetContext("stage");
    const githubRepo = this.node.tryGetContext("github_repository");

    const GITHUB_OIDC_PROVIDER_URL = 'token.actions.githubusercontent.com';
    const GITHUB_REPO = githubRepo;
    const roleName = createResourceName(appname, IAM.BASE_NAME, stage);

    const oidcProvider = new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
      url: `https://${GITHUB_OIDC_PROVIDER_URL}`,
      clientIds: ['sts.amazonaws.com'],
    });

    const githubRole = new iam.Role(this, 'GithubActionsRole', {
      roleName: roleName,
      assumedBy: new iam.WebIdentityPrincipal(oidcProvider.openIdConnectProviderArn, {
        'StringLike': {
          [`${GITHUB_OIDC_PROVIDER_URL}:sub`]: `repo:${GITHUB_REPO}:*`
        }
      }),
      description: 'Role assumed by GitHub Actions via OIDC',
    });
    const githubPolicies= createGithubActionsPolicy(this, appname, stage);
    githubRole.addManagedPolicy(githubPolicies);
  }
}
