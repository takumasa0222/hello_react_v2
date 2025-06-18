import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { StageStackProps } from './stack-props';

export interface AuroraClusterConstructProps extends StageStackProps{
	readonly vpc: ec2.IVpc;
	readonly subnets: ec2.ISubnet[];
	readonly securityGroup?: ec2.ISecurityGroup;
}
