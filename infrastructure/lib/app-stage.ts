import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StageStackProps } from './interfaces/stack-props';
import { FrontendStack } from './stacks/frontend/frontend-stack';
import { BackendStack } from './stacks/backend/backend-stack';
import { createResourceName } from './utils/naming';
import { DatabaseStack } from './stacks/db/database-stack';
// import { DynamoDBConstruct } from './stacks/db/dynamodb-construct';
// import { LambdaConstruct } from './stacks/backend/lambda-construct';
// import { ApiGatewayConstruct } from './stacks/backend/api-gateway-construct'; 
// import { FrontendS3Construct } from './stacks/frontend/frontend-s3-construct';
// import { CloudFrontConstruct } from './stacks/frontend/cloudfront-construct'; 
// import { API_GATEWAY } from './constants/index'; 
// import * as s3 from 'aws-cdk-lib/aws-s3';
// import { S3 as S3_CONST } from './constants/s3.constants';


export class AppStage extends cdk.Stage  {
    constructor(scope: Construct, id: string, props: StageStackProps) {
        super(scope, id, props);
		const databaseStackName =  createResourceName(props.appname, "DB", props.stage);
		new DatabaseStack(this, databaseStackName, props)
		const backendStackName =  createResourceName(props.appname, "Backend", props.stage);
        new BackendStack(this, backendStackName, props);
		const frontendStackName =  createResourceName(props.appname, "Frontend", props.stage);
        new FrontendStack(this, frontendStackName, props);

        // const dynamo = new DynamoDBConstruct(this, `${props.appname}-DynamoDB-${props.stage}`, props);
        // const bucketName =  createResourceName(props.appname, S3_CONST.REPO, props.stage).toLowerCase();
        // const codeBucket = s3.Bucket.fromBucketAttributes(this, `${props.appname}-CodeBucket-${props.stage}`, {
        //   bucketName: bucketName, 
        // });
        // const lambda = new LambdaConstruct(this, `${props.appname}-Lambda-${props.stage}`, {
        //     ...props,
        //     tableName: dynamo.table.tableName,
        //     bucket: codeBucket
        // });
        // const apigw= new ApiGatewayConstruct(this, `${props.appname}-ApiGateway-${props.stage}`, {
        //     ...props,
        //     lambdaFunction: lambda.fn
        // });

        // new cdk.CfnOutput(this, 'ApiUrl', {
        //     value: `https://${apigw.restApi.restApiId}.execute-api.${cdk.Stack.of(this).region}.amazonaws.com/${API_GATEWAY.PATH}`,
        //     exportName: `ApiUrl-${props.stage}`,
        //   });
        // const frontendS3 = new FrontendS3Construct(this, `${props.appname}-Frontend-S3-${props.stage}`, props);
        // new CloudFrontConstruct(this, `${props.appname}-Cloudfront-${props.stage}`, {
        //     ...props,
        //     bucket: frontendS3.bucket,
        //     apiDomainName: `${apigw.restApi.restApiId}.execute-api.${cdk.Stack.of(this).region}.amazonaws.com`,
        // });
        // new cdk.CfnOutput(this, 'FrontendBucketName', {
        //     value:frontendS3.bucket.bucketName,
        // });
    }
}
