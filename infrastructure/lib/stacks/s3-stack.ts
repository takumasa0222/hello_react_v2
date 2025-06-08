import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { StageStackProps } from '../types/stack-props';
import { S3 as S3_CONST } from '../constants/s3.constants'
import { createResourceName } from '../utils/naming';
import { RemovalPolicy } from 'aws-cdk-lib';

export class S3Stack extends Construct {
	public readonly bucket: s3.Bucket;

	constructor (scope: Construct, id: string, props: StageStackProps) {
		super(scope, id);
		
		const bucketName = createResourceName(props.appname, S3_CONST.BASE_NAME, props.stage).toLocaleLowerCase();
		this.bucket = new s3.Bucket(this, 'Bucket', {
			bucketName,

			removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
			autoDeleteObjects: props.stage === 'prod' ? false : true,
		});
	}
}
