import {
  RDSDataClient,
  ExecuteStatementCommand,
} from '@aws-sdk/client-rds-data';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { TABLE_SCRIPTS } from './greetings-script.constants.js';

const clusterArn = process.env.CLUSTER_ARN!;
const secretArn = process.env.SECRET_ARN!;
const dbName = process.env.DB_NAME!;
const region = process.env.AWS_REGION!;

const client = new RDSDataClient({ region });

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.log(`Event type: ${JSON.stringify(event)}`);

  if (event.RequestType === 'Delete') {
    return { PhysicalResourceId: 'init-table-custom-resource' };
  }

  const tableCreateCommand = new ExecuteStatementCommand({
    resourceArn: clusterArn,
    secretArn,
    database: dbName,
    sql: TABLE_SCRIPTS.CREATE_TABLE_SQL,
  });
  await client.send(tableCreateCommand);

  const insertCommand = new ExecuteStatementCommand({
    secretArn,
    resourceArn: clusterArn,
    database: dbName,
    sql: TABLE_SCRIPTS.INSERT_DEFAULT_VAL_SQL,
  });

  await client.send(insertCommand);

  return {
    PhysicalResourceId: 'init-table-custom-resource',
  };
};
