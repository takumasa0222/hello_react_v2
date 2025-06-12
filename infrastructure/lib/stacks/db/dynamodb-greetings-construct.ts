import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { StageStackProps } from '../../interfaces/stack-props';
import { DYNAMODB } from '../../constants/dynamodb.constants';
import { createResourceName } from '../../utils/naming';

export class DynamoDBGreetomgsConstruct extends Construct {
	public readonly table: dynamodb.Table;

	constructor (scope: Construct, id: string, props: StageStackProps) {
		super(scope, id);
		const tableName = createResourceName(props.appname, DYNAMODB.BASE_NAME, props.stage);
		this.table = new dynamodb.Table(this, 'Table', {
			tableName,
			partitionKey: {
				name: DYNAMODB.PARTITION_KEY,
				type: dynamodb.AttributeType.STRING,
			},
			sortKey: {
				name: DYNAMODB.SORT_KEY,
				type: dynamodb.AttributeType.STRING,
			},
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
		});
		
	}
}
