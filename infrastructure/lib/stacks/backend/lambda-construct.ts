import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib'
import { StageStackProps } from '../../types/stack-props';
import { LAMBDA, LAMBDA_ENV } from '../../constants/lambda.constants';
import { createResourceName } from '../../utils/naming';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';

interface LambdaStackProps extends StageStackProps {
	table: dynamodb.Table;
	bucket : s3.IBucket;
}

export class LambdaConstruct extends Construct {
	public readonly fn: lambda.Function;
	
	constructor (scope: Construct, id: string, props: LambdaStackProps) {
		super(scope, id);
		const codeVersionId = this.node.tryGetContext('codeVersionId');
		const functionName = createResourceName(props.appname, LAMBDA.BASE_NAME, props.stage);
		this.fn = new lambda.Function(this, 'Function', {
			functionName,
			runtime: lambda.Runtime.NODEJS_22_X,
			code : lambda.Code.fromBucketV2(props.bucket, `${props.appname}/${props.stage}${LAMBDA.CODE_ASSET_PATH}`, 
			  {objectVersion: codeVersionId }),
			handler: LAMBDA.HANDLER,
			timeout: Duration.seconds(LAMBDA.TIMEOUT_SECONDS),
			memorySize: LAMBDA.MEMORY_MB,
			environment: {
				[LAMBDA_ENV.TABLE_NAME]: props.table.tableName,
			},
		});
		props.table.grantReadData(this.fn);
		props.bucket.grantRead(this.fn);
	}
}
