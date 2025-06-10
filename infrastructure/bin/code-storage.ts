#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BackendCodeS3Stack } from '../lib/stacks/repository-s3-stack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');
const appname = app.node.tryGetContext('appname');

new BackendCodeS3Stack(app, `${appname}-BackendCodeS3-${stage}`, 
    {
      stage: stage,
      appname: appname,
    }
    
);


