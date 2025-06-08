import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StageStackProps } from './types/stack-props';
import { DynamoDBStack } from './stacks/dynamodb-stack';
import { LambdaStack } from './stacks/lambda-stack';
import { ApiGatewayStack } from './stacks/api-gateway-stack'; 
import { S3Stack } from './stacks/s3-stack';
import { CloudFrontStack } from './stacks/cloudfront-stack'; 
import { API_GATEWAY } from './constants/index'; 


export class AppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: StageStackProps) {
        super(scope, id, props);

        const dynamo = new DynamoDBStack(this, `DynamoDB-${props.stage}`, props);
        const lambda = new LambdaStack(this, `Lambda-${props.stage}`, {
            ...props,
            table: dynamo.table,
        });
        const apigw= new ApiGatewayStack(this, `ApiGateway-${props.stage}`, {
            ...props,
            lambdaFunction: lambda.fn
        });

        new cdk.CfnOutput(this, 'ApiUrl', {
            value: `https://${apigw.restApi.restApiId}.execute-api.${cdk.Stack.of(this).region}.amazonaws.com/${API_GATEWAY.PATH}`,
            exportName: `ApiUrl-${props.stage}`,
          });
        const s3 = new S3Stack(this, `S3-${props.stage}`, props);
        new CloudFrontStack(this, `cloudfront-${props.stage}`, {
            ...props,
            bucket: s3.bucket,
            apiDomainName: `${apigw.restApi.restApiId}.execute-api.${cdk.Stack.of(this).region}.amazonaws.com`,
        });
        new cdk.CfnOutput(this, 'FrontendBucketName', {
            value:s3.bucket.bucketName,
        });
    }
}
