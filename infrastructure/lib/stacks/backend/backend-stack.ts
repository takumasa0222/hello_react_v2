import { ApiGatewayConstruct } from './api-gateway-construct';
import { LambdaConstruct } from './lambda-construct';
import { DYNAMODB } from '../../constants/dynamodb.constants';
import { createDBName, createResourceName } from '../../utils/naming';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { S3 as S3_CONST } from '../../constants/s3.constants';
import { API_GATEWAY } from "../../constants/api-gateway.constants";
import * as cdk from 'aws-cdk-lib';
import { StageStackProps } from '../../interfaces/stack-props';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { createDataAPIPolicyStatement } from '../../policies/data-api-policy';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { STAGES } from '../../constants';
import { AURORA } from '../../constants/auroracluster.constants';
import * as rds from 'aws-cdk-lib/aws-rds';

export class BackendStack extends Stack {
	constructor(scope: Construct, id: string, props: StageStackProps) {
	  super(scope, id, props);
	  const apiGatewayName = createResourceName(props.appname, API_GATEWAY.BASE_NAME, props.stage);
	  const tableName = createResourceName(props.appname, DYNAMODB.BASE_NAME, props.stage);
	  const bucketName = createResourceName(props.appname, S3_CONST.REPO, props.stage).toLowerCase();
	  const codeBucket = s3.Bucket.fromBucketAttributes(this, `${props.appname}-CodeBucket-${props.stage}`, {
		bucketName: bucketName, 
	  });
	  const secretname = createResourceName(props.appname, AURORA.BASE_SECRET_NAME, props.stage);
	  const secret = secretsmanager.Secret.fromSecretNameV2(this, 'ImportedSecret', secretname);
	  const clustername = createResourceName(props.appname, AURORA.BASE_RESOURCE_NAME, props.stage);
	  const clusterArn = `arn:aws:rds:${Stack.of(this).region}:${Stack.of(this).account}:cluster/${clustername}`;

	  const dbname = createDBName(props.appname, AURORA.BASE_DB_NAME, props.stage);

	  const lambda = new LambdaConstruct(this, `${props.appname}-Lambda-${props.stage}`, {
		appname:props.appname,
		stage:props.stage,
		tableName: tableName, 
		bucket: codeBucket,
		secretArn: secret?.secretArn,
		dbName: dbname,
		clusterArn: clusterArn
	  });

	  if (props.stage != STAGES.PROD)
	  {
	  	const importedTable = dynamodb.Table.fromTableName(this, 'ImportedTable', tableName);
	  	importedTable.grantReadData(lambda.fn);
	  } else {
		secret.grantRead(lambda.fn)
		const dataapipolcy= createDataAPIPolicyStatement(this, props.appname, props.stage);
		lambda.fn.addToRolePolicy(dataapipolcy);
	  }

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