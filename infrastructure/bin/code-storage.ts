#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BackendCodeS3Construct } from '../lib/stacks/shared/repository-s3-construct';
import { StageStackProps } from '../lib/interfaces/stack-props';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');
const appname = app.node.tryGetContext('appname');

class CodeStorageStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  constructor(scope: Construct, id: string, props: StageStackProps) {
    super(scope, id, props);
    const backendS3Stack = new BackendCodeS3Construct(this, `${appname}-BackendCodeS3`, props);
    this.bucket = backendS3Stack.bucket;
    new cdk.CfnOutput(this, 'RepoBucketName', {
        value: this.bucket.bucketName,
        exportName: `${props.appname}-BackendRepoBucket-${props.stage}`,
	});
  }
}

new CodeStorageStack(app, `${appname}-CodeStorageStack-${stage}`, {
  stage,
  appname,
});
