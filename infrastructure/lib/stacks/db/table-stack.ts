import { createResourceName } from '../../utils/naming';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { StageStackProps } from '../../interfaces/stack-props';
import { AURORA } from '../../constants/auroracluster.constants';
import { TableInitializerConstruct } from './table-initializer-construct';
import { TABLE_INIT } from '../../constants/table.constants';

export class TableStack extends Stack {
	constructor(scope: Construct, id: string, props: StageStackProps) {
	  super(scope, id, props);
	  const clusterArn = cdk.Fn.importValue(createResourceName(props.appname, AURORA.BASE_RESOURCE_NAME, props.stage));
	  const tableInitiName= createResourceName(props.appname, TABLE_INIT.BASE_NAME, props.stage); 
	  new TableInitializerConstruct(this, tableInitiName, {
		  clusterArn: clusterArn,
		  appname:props.appname,
		  stage: props.stage
	  });
	}
  }