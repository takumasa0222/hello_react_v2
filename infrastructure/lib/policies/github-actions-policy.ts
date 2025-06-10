import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { S3, LAMBDA, DYNAMODB } from '../constants/index'; 
import { createResourceName } from '../utils/naming';

export function createGithubActionsPolicy(stack: Stack, appname: string, stage: string): iam.ManagedPolicy {
  const region = Stack.of(stack).region;
  const account = Stack.of(stack).account;

  const bucketName = createResourceName(appname, S3.BASE_NAME, stage);
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
          `arn:aws:s3:::${bucketName}`,
          `arn:aws:s3:::${bucketName}/*`,
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
      
    ],
  });
}
