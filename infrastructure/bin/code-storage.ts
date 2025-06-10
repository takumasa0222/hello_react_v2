#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BackendCodeS3Stack } from '../lib/stacks/repository-s3-stack';
import { StageStackProps } from '../lib/types/stack-props';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');
const appname = app.node.tryGetContext('appname');

class CodeStorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StageStackProps) {
    super(scope, id, props);
    new BackendCodeS3Stack(this, `${appname}-BackendCodeS3`, props);
  }
}

new CodeStorageStack(app, `${appname}-CodeStorageStack-${stage}`, {
  stage,
  appname,
});
