import { Stack } from "aws-cdk-lib";
import { StageStackProps } from "../../interfaces/stack-props";
import { Construct } from "constructs";
import { VpcConstruct } from "./vpc-construct";
import { createResourceName } from "../../utils/naming";
import { VPC } from "../../constants/vpc.constants";
import { SecurityGroupConstruct } from "./security-group-construct";
import { SECURITY_GROUP } from "../../constants/security-group.constants";
// import { VPC_ENDPOINT } from "../../constants/vpc-endpoint.constants";
// import { VpcEndpoint } from "./vpc-endpoint";

export class NetworkStack extends Stack  {
	constructor(scope: Construct, id: string, props: StageStackProps) {
		super(scope, id, props);
		const vpcName=  `${props.stage}-${VPC.BASE_NAME}`;
		const sgName= createResourceName(props.appname, SECURITY_GROUP.BASE_NAME, props.stage);
		const vpc = new VpcConstruct(this,vpcName ,props);
		new SecurityGroupConstruct(this,sgName, {
			vpc:vpc.vpc, 
			appname:props.appname, 
			stage: props.stage
		});
		// const vpcEpName= createResourceName(props.appname, VPC_ENDPOINT.BASE_NAME, props.stage);
		// new VpcEndpoint(this, vpcEpName, {
		// 	vpc:vpc.vpc, 
		// 	appname:props.appname, 
		// 	stage: props.stage
		// });
	}
}
