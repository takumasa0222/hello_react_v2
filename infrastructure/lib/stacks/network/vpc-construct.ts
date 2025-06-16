// lib/network/vpc-construct.ts
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { createResourceName } from '../../utils/naming';
import { StageStackProps } from '../../interfaces/stack-props';
import { VPC } from '../../constants/vpc.constants';

export class VpcConstruct extends Construct {
  public readonly vpc: ec2.Vpc;
  public readonly privateSubnets: ec2.ISubnet[];
  public readonly publicSubnets: ec2.ISubnet[];

  constructor(scope: Construct, id: string, props: StageStackProps) {
    super(scope, id);
	const vpcName= createResourceName(props.appname, VPC.BASE_NAME, props.stage);
    this.vpc = new ec2.Vpc(this, vpcName, {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        {
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    this.privateSubnets = this.vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_ISOLATED }).subnets;
    this.publicSubnets = this.vpc.publicSubnets;
  }
}