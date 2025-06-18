// lib/database/aurora-cluster-construct.ts
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import { AuroraClusterConstructProps } from '../../interfaces/aurora-cluster-props';
import { createDBName, createResourceName } from '../../utils/naming';
import { AURORA } from '../../constants/auroracluster.constants';
import { SecretConstruct } from '../shared/secret-construct';

export class AuroraClusterConstruct extends Construct {
  public readonly cluster: rds.DatabaseCluster;

  constructor(scope: Construct, id: string, props: AuroraClusterConstructProps) {
    super(scope, id);

	const dbname = createDBName(props.appname, AURORA.BASE_DB_NAME, props.stage);
	const clustername = createResourceName(props.appname, AURORA.BASE_RESOURCE_NAME, props.stage);
	const clusterwritername = createResourceName(props.appname, AURORA.BASE_WRITER_INSTANCE_NAME, props.stage);
	const clustersecretkeyname = createResourceName(props.appname, AURORA.BASE_KEY_NAME, props.stage);
	const secretname = createResourceName(props.appname, AURORA.BASE_SECRET_NAME, props.stage);
	const dbSecretConstruct = new SecretConstruct(this, secretname, { 
		username: clustersecretkeyname, 
		resourcename: AURORA.BASE_RESOURCE_NAME,
		stage:props.stage,
		appname:props.appname
	});

    this.cluster = new rds.DatabaseCluster(this, clustername, {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
		version: rds.AuroraPostgresEngineVersion.VER_17_4
	  }),
      vpc: props.vpc,
      vpcSubnets: {
        subnets: props.subnets,
      },
    //   securityGroups: [props.securityGroup],
      defaultDatabaseName:dbname,
	  credentials: rds.Credentials.fromSecret(dbSecretConstruct.secret),
	  writer: rds.ClusterInstance.serverlessV2(clusterwritername),
      serverlessV2MinCapacity: 0.0,
      serverlessV2MaxCapacity: 1.0,
	  enableDataApi: true,
    });
  }
}
