import { ApiGatewayConstruct } from './api-gateway-construct';
import { LambdaConstruct } from './lambda-construct';
import { DYNAMODB } from '../../constants/dynamodb.constants';
import { createResourceName } from '../../utils/naming';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { S3 as S3_CONST } from '../../constants/s3.constants';
import { API_GATEWAY } from "../../constants/api-gateway.constants";
import * as cdk from 'aws-cdk-lib';
import { StageStackProps } from '../../interfaces/stack-props';

export class BackendStack extends Stack {
	constructor(scope: Construct, id: string, props: StageStackProps) {
	  super(scope, id, props);
	  const apiGatewayName = createResourceName(props.appname, API_GATEWAY.BASE_NAME, props.stage);
	  const tableName = createResourceName(props.appname, DYNAMODB.BASE_NAME, props.stage);
	  const bucketName = createResourceName(props.appname, S3_CONST.REPO, props.stage).toLowerCase();
	  const codeBucket = s3.Bucket.fromBucketAttributes(this, `${props.appname}-CodeBucket-${props.stage}`, {
		bucketName: bucketName, 
	  });
	  const lambda = new LambdaConstruct(this, `${props.appname}-Lambda-${props.stage}`, {
		appname:props.appname,
		stage:props.stage,
		tableName: tableName, 
		bucket: codeBucket,
	  });

	  const apigw = new ApiGatewayConstruct(this, `${props.appname}-ApiGateway-${props.stage}`, {
		appname:props.appname,
		stage:props.stage,
		lambdaFunction: lambda.fn
	  });

	  new cdk.CfnOutput(this, 'ApiGatewayIdOutput', {
		exportName: apiGatewayName,
		value: apigw.restApi.restApiId,
	  });
	}
  }