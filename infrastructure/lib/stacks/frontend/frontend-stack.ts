
import { FrontendS3Construct } from './frontend-s3-construct';
import { CloudFrontConstruct } from './cloudfront-construct'; 
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { API_GATEWAY } from "../../constants/api-gateway.constants";
import { createResourceName } from "../../utils/naming";
import { StageStackProps } from '../../interfaces/stack-props';

export class FrontendStack extends Stack {
	constructor(scope: Construct, id: string, props: StageStackProps) {
		super(scope, id, props);
		const apiGatewayName = createResourceName(props.appname, API_GATEWAY.BASE_NAME, props.stage);
		const apigwRestApiId  = cdk.Fn.importValue(apiGatewayName);
		const frontendS3 = new FrontendS3Construct(this, `${props.appname}-Frontend-S3-${props.stage}`, {
			appname: props.appname,
			stage: props.stage
		});
		new CloudFrontConstruct(this, `${props.appname}-Cloudfront-${props.stage}`, {
			appname: props.appname,
			stage: props.stage,
			bucket: frontendS3.bucket,
			apiDomainName: `${apigwRestApiId}.execute-api.${cdk.Stack.of(this).region}.amazonaws.com`,
		});
		
		new cdk.CfnOutput(this, 'FrontendBucketName', {
			value:frontendS3.bucket.bucketName,
		});
	}
} 