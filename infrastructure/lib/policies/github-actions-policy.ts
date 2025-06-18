import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { S3, LAMBDA, DYNAMODB } from '../constants/index'; 
import { createResourceName } from '../utils/naming';

export function createGithubActionsPolicy(stack: Stack, appname: string, stage: string): iam.ManagedPolicy {
  const region = Stack.of(stack).region;
  const account = Stack.of(stack).account;

  const frontendBucketName = createResourceName(appname, S3.FRONTEND, stage);
  const repoBucketName = createResourceName(appname, S3.REPO, stage);
  const tableName = createResourceName(appname, DYNAMODB.BASE_NAME, stage);
  const lambdaName = createResourceName(appname, LAMBDA.BASE_NAME, stage);
  const managedPolicyName = createResourceName(appname, "GithubActionsPolicy", stage);

  return new iam.ManagedPolicy(stack, 'GithubActionsPolicy', {
    managedPolicyName: managedPolicyName,
    statements: [
      new iam.PolicyStatement({
        sid: 'CDKBasic',
        actions: [
          'cloudformation:*',
          'iam:PassRole',
          'iam:GetRole',
          'iam:CreateRole',
          'iam:AttachRolePolicy',
          'iam:PutRolePolicy',
        ],
        resources: ['*'],
      }),

      new iam.PolicyStatement({
        sid: 'S3Access',
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject', 's3:ListBucket'],
        resources: [
          `arn:aws:s3:::${frontendBucketName}`,
          `arn:aws:s3:::${frontendBucketName}/*`,
		  `arn:aws:s3:::${repoBucketName}`,
          `arn:aws:s3:::${repoBucketName}/*`,
          `arn:aws:s3:::cdk-hnb659fds-assets-${account}-${region}`,
          `arn:aws:s3:::cdk-hnb659fds-assets-${account}-${region}/*`
        ],
      }),

      new iam.PolicyStatement({
        sid: 'LambdaAccess',
        actions: ['lambda:*'],
        resources: [
          `arn:aws:lambda:${region}:${account}:function:${lambdaName}`,
        ],
      }),

      new iam.PolicyStatement({
        sid: 'ApiGatewayAccess',
        actions: ['apigateway:*'],
        resources: ['*'],
      }),

      new iam.PolicyStatement({
        sid: 'DynamoAccess',
        actions: ['dynamodb:*'],
        resources: [
          `arn:aws:dynamodb:${region}:${account}:table/${tableName}`,
        ],
      }),

      new iam.PolicyStatement({
        sid: 'CloudFrontAccess',
        actions: ['cloudfront:*'],
        resources: ['*'],
      }),

      new iam.PolicyStatement({
        sid: 'CdkBootstrapSSMAccess',
        actions: ['ssm:GetParameter'],
        resources: [
          `arn:aws:ssm:${region}:${account}:parameter/cdk-bootstrap/*`,
        ],
      }),

      new iam.PolicyStatement({
        sid: 'CdkBootstrapAssumeRoles',
        actions: ['sts:AssumeRole'],
        resources: [
          `arn:aws:iam::${account}:role/cdk-hnb659fds-deploy-role-${account}-${region}`,
          `arn:aws:iam::${account}:role/cdk-hnb659fds-file-publishing-role-${account}-${region}`,
        ],
      }),
	  new iam.PolicyStatement({
		sid: 'VpcNetworkAccess',
		actions: [
		  'ec2:DescribeVpcs',
		  'ec2:CreateVpc',
		  'ec2:DescribeSubnets',
		  'ec2:CreateSubnet',
		  'ec2:DeleteSubnet',
		  'ec2:DescribeSecurityGroups',
		  'ec2:CreateSecurityGroup',
		  'ec2:AuthorizeSecurityGroupIngress',
		  'ec2:AuthorizeSecurityGroupEgress',
		  'ec2:RevokeSecurityGroupIngress',
		  'ec2:RevokeSecurityGroupEgress',
		  'ec2:DeleteSecurityGroup',
		  'ec2:CreateTags',
		  'ec2:DeleteTags',
		],
		resources: ['*'],
	  }),
	  new iam.PolicyStatement({
		sid: 'RdsAccess',
		actions: [
		  'rds:DescribeDBClusters',
		  'rds:CreateDBCluster',
		  'rds:DeleteDBCluster',
		  'rds:ModifyDBCluster',
		  'rds:DescribeDBInstances',
		  'rds:CreateDBInstance',
		  'rds:DeleteDBInstance',
		  'rds:ModifyDBInstance',
		  'rds:AddTagsToResource',
		  'rds:RemoveTagsFromResource',
		],
		resources: ['*'],
	  }),
	  new iam.PolicyStatement({
		sid: 'SecretsManagerAccess',
		actions: [
		  'secretsmanager:GetSecretValue',
		  'secretsmanager:CreateSecret',
		  'secretsmanager:UpdateSecret',
		  'secretsmanager:DeleteSecret',
		  'secretsmanager:DescribeSecret',
		  'secretsmanager:TagResource',
		],
		resources: ['*'],
	  }),
	  
	  
    ],
  });
}
