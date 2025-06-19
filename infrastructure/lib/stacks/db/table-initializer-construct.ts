import * as path from 'path';
import { Construct } from 'constructs';
import { Duration, CustomResource } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { StageStackProps } from '../../interfaces/stack-props';
import { createDBName, createResourceName } from '../../utils/naming';
import { AURORA, SECRET } from '../../constants/auroracluster.constants';
import { TABLE_INIT } from '../../constants/table.constants';
import { createDataAPIPolicyStatement } from '../../policies/data-api-policy';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

interface Props extends StageStackProps{
  clusterArn: string;
}

export class TableInitializerConstruct extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
	const secretArn = cdk.Fn.importValue(createResourceName(props.appname, SECRET.BASE_DB_SECRET_NAME, props.stage));
    const secret = secretsmanager.Secret.fromSecretCompleteArn (this, 'ImportedSecret', secretArn);
	const dbname = createDBName(props.appname, AURORA.BASE_DB_NAME, props.stage);
	const fn = new lambda.Function(this, 'TableInitFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: TABLE_INIT.HANDLER,
      code: lambda.Code.fromAsset(path.join(__dirname, TABLE_INIT.CODE_PATH)),
      timeout: Duration.seconds(30),
      environment: {
        CLUSTER_ARN: props.clusterArn,
        SECRET_ARN: secretArn,
        DB_NAME: dbname	,
      },
    });
	const dataapipolcy= createDataAPIPolicyStatement(props.clusterArn);
	fn.addToRolePolicy(dataapipolcy);
	secret.grantRead(fn)
    new CustomResource(this, 'InitGreetingsTable', {
      serviceToken: fn.functionArn,
    });
  }
}
