import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { StageStackProps } from './stack-props';

export interface DBStackprops extends StageStackProps{
	readonly vpc?: ec2.IVpc;
}
