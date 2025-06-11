#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BackendCodeS3Stack } from '../lib/stacks/repository-s3-stack';
import { StageStackProps } from '../lib/types/stack-props';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');
const appname = app.node.tryGetContext('appname');

class CodeStorageStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  constructor(scope: Construct, id: string, props: StageStackProps) {
    super(scope, id, props);
    const backendS3Stack = new BackendCodeS3Stack(this, `${appname}-BackendCodeS3`, props);
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
