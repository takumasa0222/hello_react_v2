import { Stack } from "aws-cdk-lib";
import { StageStackProps } from "../../interfaces/stack-props";
import { Construct } from "constructs";
import { DynamoDBGreetingsConstruct } from "./dynamodb-greetings-construct";
import { createResourceName } from "../../utils/naming";
import { STAGES } from "../../constants";
import { AuroraClusterConstruct } from "./aurora-serverless-v2-construct";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { VPC } from "../../constants/vpc.constants";
import { AURORA } from "../../constants/auroracluster.constants";
import { BackendStackProps } from "../../interfaces/backend-props";

export class DatabaseStack extends Stack  {
	constructor(scope: Construct, id: string, props: BackendStackProps) {
		super(scope, id, props);

		if (props.stage == STAGES.PROD) {
			const auroraName = createResourceName(props.appname, AURORA.BASE_RESOURCE_NAME, props.stage);
			let vpc = props.vpc;
			if (!vpc)
			{
				const vpcName= createResourceName(props.appname, VPC.BASE_NAME, props.stage);
				vpc = ec2.Vpc.fromLookup(this, 'ImportedVpc', {
					tags: {
					  Name: vpcName,
					},
				  });
			}
			const subnetSelection = vpc.selectSubnets({
				subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
			  });
			new AuroraClusterConstruct(this, auroraName, {
				vpc: vpc,
				subnets: subnetSelection.subnets,
				appname:props.appname,
				stage: props.stage
			});
		} else {
			const dynamodbName = createResourceName(props.appname, "DynamoDB", props.stage);
			new DynamoDBGreetingsConstruct(this, dynamodbName, props);
		}

	}
}
