import * as cdk from 'aws-cdk-lib';
import { Stage } from '../constants/stage.constants';

export interface StageStackProps extends cdk.StackProps {
	stage: Stage;
	appname: string;
}
