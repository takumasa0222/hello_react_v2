import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { StageStackProps } from '../types/stack-props';
import { createResourceName } from '../utils/naming';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface BaseS3Props extends StageStackProps {
	purpose: string;
	versioned?: boolean;
}

export class BaseS3Bucket extends Construct {
	public readonly bucket: s3.Bucket;

	constructor(scope: Construct, id: string, props: BaseS3Props) {
		super(scope, id);

		const bucketName = createResourceName(props.appname, props.purpose, props.stage).toLowerCase();

		this.bucket = new s3.Bucket(this, 'Bucket', {
			bucketName,
			versioned: props.versioned ?? false,
			removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
			autoDeleteObjects: props.stage === 'prod' ? false : true,
		});
	}
}
