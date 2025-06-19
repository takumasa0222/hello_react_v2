import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { createResourceName } from '../utils/naming';

export function createDataAPIPolicyStatement(rdsArn: string): iam.PolicyStatement {
//   const region = Stack.of(stack).region;
//   const account = Stack.of(stack).account;

//   const clusterName = createResourceName(appname, "AuroraCluster", stage);

  return new iam.PolicyStatement({
    sid: 'DataAPI',
    actions: [
		'rds-data:ExecuteStatement',
		'rds-data:BatchExecuteStatement',
		'rds-data:BeginTransaction',
		'rds-data:CommitTransaction',
		'rds-data:RollbackTransaction'
	  ],
    resources: [
		rdsArn,
	],
  })
};