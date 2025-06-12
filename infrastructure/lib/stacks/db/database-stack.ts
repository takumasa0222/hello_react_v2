import { Stack } from "aws-cdk-lib";
import { StageStackProps } from "../../interfaces/stack-props";
import { Construct } from "constructs";
import { STAGES } from "../../constants";
import { DynamoDBGreetomgsConstruct } from "./dynamodb-greetings-construct";
import { createResourceName } from "../../utils/naming";

export class DatabaseStack extends Stack  {
	constructor(scope: Construct, id: string, props: StageStackProps) {
		super(scope, id, props);
		if (props.stage != STAGES.PROD) {
			const dynamodbName = createResourceName(props.appname, "DynamoDB", props.stage);
			new DynamoDBGreetomgsConstruct(this, dynamodbName, props);
		} else {

		}
	}
}
