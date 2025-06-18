// lib/network/security-group-construct.ts
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import{ SECURITY_GROUP } from '../../constants/security-group.constants'
import { createResourceName } from '../../utils/naming';
import { Stage } from '../../constants/stage.constants';

export interface NetworkConstructProps {
  readonly vpc: ec2.IVpc;
  	stage: Stage;
	appname: string;
}

export class SecurityGroupConstruct extends Construct {
  public readonly lambdaToAuroraSG: ec2.SecurityGroup;
  public readonly auroraSG: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: NetworkConstructProps) {
    super(scope, id);

	const lambdaToAuroraSGName = createResourceName(props.appname,  SECURITY_GROUP.LAMBDA_TO_AURORA_SG, props.stage);
	const auroraSGName = createResourceName(props.appname,  SECURITY_GROUP.AURORA_SG, props.stage);
    this.lambdaToAuroraSG = new ec2.SecurityGroup(this, lambdaToAuroraSGName, {
      vpc: props.vpc,
      description: SECURITY_GROUP.LAMBDA_TO_AURORA_SG_DESC,
      allowAllOutbound: true,
    });

    this.auroraSG = new ec2.SecurityGroup(this, auroraSGName, {
      vpc: props.vpc,
      description: SECURITY_GROUP.AURORA_SG_DESC,
      allowAllOutbound: true,
    });

    this.auroraSG.addIngressRule(
      this.lambdaToAuroraSG,
      ec2.Port.tcp(SECURITY_GROUP.POSTGRESQL_DEFAULT_PORT),
      SECURITY_GROUP.AURORA_INGRESS_RULE_DESC
    );
  }
}
