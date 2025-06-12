
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
		const cloudFrontDist = new CloudFrontConstruct(this, `${props.appname}-Cloudfront-${props.stage}`, {
			appname: props.appname,
			stage: props.stage,
			bucket: frontendS3.bucket,
			apiDomainName: `${apigwRestApiId}.execute-api.${cdk.Stack.of(this).region}.amazonaws.com`,
		});
		
		// frontend/cloudfront-construct.ts または frontend-stack.ts にて
		new cdk.CfnOutput(this, 'CloudFrontDistributionIdOutput', {
			exportName: `${props.appname}-CloudFrontDistributionId-${props.stage}`, // stage ごとに出し分け
			value: cloudFrontDist.distribution.distributionId,
		});
  
	}
} 