import { Construct } from 'constructs';
import { BaseS3Bucket } from './base-s3-stack';
import { StageStackProps } from '../types/stack-props';
import { S3 as S3_CONST } from '../constants/s3.constants';
import * as cdk from 'aws-cdk-lib';

export class BackendCodeS3Stack extends BaseS3Bucket {
    constructor(scope: Construct, id: string, props: StageStackProps) {
        super(scope, id, { ...props, purpose: S3_CONST.REPO, versioned: true });
        new cdk.CfnOutput(this, 'RepoBucketName', {
            value:this.bucket.bucketName,
            exportName: `${props.appname}-BackendRepoBucket-${props.stage}`,
        });
    }

}
