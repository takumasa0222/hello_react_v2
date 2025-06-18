// lib/network/security-group-construct.ts
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { createResourceName } from '../../utils/naming';
import { Stage } from '../../constants/stage.constants';
import { VPC_ENDPOINT } from '../../constants/vpc-endpoint.constants';

export interface NetworkConstructProps {
  readonly vpc: ec2.IVpc;
  	stage: Stage;
	appname: string;
}

export class VpcEndpoint extends Construct {

  constructor(scope: Construct, id: string, props: NetworkConstructProps) {
    super(scope, id);
	const secretManagerEndpoint = createResourceName(props.appname, VPC_ENDPOINT.SECRET_MANAGER_EP , props.stage);
	new ec2.InterfaceVpcEndpoint(this, secretManagerEndpoint, {
		vpc: props.vpc,
		service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
		privateDnsEnabled: true,
	  });
  }
}
