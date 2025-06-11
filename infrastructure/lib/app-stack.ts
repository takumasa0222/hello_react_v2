import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StageStackProps } from './types/stack-props';
import { DynamoDBConstruct } from './stacks/db/dynamodb-construct';
import { LambdaConstruct } from './stacks/backend/lambda-construct';
import { ApiGatewayConstruct } from './stacks/backend/api-gateway-construct'; 
import { FrontendS3Construct } from './stacks/frontend/frontend-s3-construct';
import { createResourceName } from './utils/naming';
import { CloudFrontConstruct } from './stacks/frontend/cloudfront-construct'; 
import { API_GATEWAY } from './constants/index'; 
import * as s3 from 'aws-cdk-lib/aws-s3';
import { S3 as S3_CONST } from './constants/s3.constants';


export class AppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: StageStackProps) {
        super(scope, id, props);

        const dynamo = new DynamoDBConstruct(this, `${props.appname}-DynamoDB-${props.stage}`, props);
        const buckeName =  createResourceName(props.appname, S3_CONST.REPO, props.stage).toLowerCase();
        const codeBucket = s3.Bucket.fromBucketAttributes(this, `${props.appname}-CodeBucket-${props.stage}`, {
          bucketName: buckeName, 
        });
        const lambda = new LambdaConstruct(this, `${props.appname}-Lambda-${props.stage}`, {
            ...props,
            table: dynamo.table,
            bucket: codeBucket
        });
        const apigw= new ApiGatewayConstruct(this, `${props.appname}-ApiGateway-${props.stage}`, {
            ...props,
            lambdaFunction: lambda.fn
        });

        new cdk.CfnOutput(this, 'ApiUrl', {
            value: `https://${apigw.restApi.restApiId}.execute-api.${cdk.Stack.of(this).region}.amazonaws.com/${API_GATEWAY.PATH}`,
            exportName: `ApiUrl-${props.stage}`,
          });
        const frontendS3 = new FrontendS3Construct(this, `${props.appname}-Frontend-S3-${props.stage}`, props);
        new CloudFrontConstruct(this, `${props.appname}-Cloudfront-${props.stage}`, {
            ...props,
            bucket: frontendS3.bucket,
            apiDomainName: `${apigw.restApi.restApiId}.execute-api.${cdk.Stack.of(this).region}.amazonaws.com`,
        });
        new cdk.CfnOutput(this, 'FrontendBucketName', {
            value:frontendS3.bucket.bucketName,
        });
    }
}
