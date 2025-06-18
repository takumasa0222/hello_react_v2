import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Duration, Stack } from 'aws-cdk-lib'
import { StageStackProps } from '../../interfaces/stack-props';
import { LAMBDA, LAMBDA_ENV } from '../../constants/lambda.constants';
import { createResourceName } from '../../utils/naming';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { STAGES } from '../../constants';


interface LambdaStackProps extends StageStackProps {
	tableName: string;
	bucket : s3.IBucket;
	secretArn?: string;
	dbName?: string;
	clusterArn?: string;
}

export class LambdaConstruct extends Construct {
	public readonly fn: lambda.Function;
	
	
	constructor (scope: Construct, id: string, props: LambdaStackProps) {
		super(scope, id);
		const codeVersionId = this.node.tryGetContext('codeVersionId');
		const functionName = createResourceName(props.appname, LAMBDA.BASE_NAME, props.stage);
		const environment: Record<string, string> = {
			[LAMBDA_ENV.TABLE_NAME]: props.tableName,
		  };
		  
		if (props.stage === STAGES.PROD) {
			environment['SECRET_ARN'] = props.secretArn!;
			environment['DB_NAME'] = props.dbName!;
			environment['CLUSTER_ARN'] = props.clusterArn!;
		}
		  
		this.fn = new lambda.Function(this, 'Function', {
			functionName,
			runtime: lambda.Runtime.NODEJS_22_X,
			code : props.stage === STAGES.PROD
			  ? lambda.Code.fromBucketV2(
				props.bucket, 
				`${props.appname}/${props.stage}${LAMBDA.CODE_ASSET_PATH}`, 
				{objectVersion: codeVersionId })
			  : lambda.Code.fromBucket(
				props.bucket,
				`${props.appname}/${props.stage}${LAMBDA.CODE_ASSET_PATH}`),
			handler: LAMBDA.HANDLER,
			timeout: Duration.seconds(LAMBDA.TIMEOUT_SECONDS),
			memorySize: LAMBDA.MEMORY_MB,
			environment: environment,
		});
		props.bucket.grantRead(this.fn);
	}
}
