import {
    RDSDataClient,
    ExecuteStatementCommand,
  } from '@aws-sdk/client-rds-data';
  import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
  import { TABLE_SCRIPTS } from './greetings-script.constants.js';
  
  import * as https from 'https';
  import * as url from 'url';
  
  const clusterArn = process.env.CLUSTER_ARN!;
  const secretArn = process.env.SECRET_ARN!;
  const dbName = process.env.DB_NAME!;
  const region = process.env.AWS_REGION!;
  
  const client = new RDSDataClient({ region });
  
  const sendResponse = (
    event: CloudFormationCustomResourceEvent,
    context: Context,
    status: 'SUCCESS' | 'FAILED',
    physicalResourceId: string,
    reason?: string,
  ) => {
    const responseBody = JSON.stringify({
      Status: status,
      Reason: reason || 'See CloudWatch Logs',
      PhysicalResourceId: physicalResourceId,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: {},
    });
  
    const parsedUrl = url.parse(event.ResponseURL);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': responseBody.length,
      },
    };
  
    return new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        response.on('data', () => {});
        response.on('end', resolve);
      });
  
      request.on('error', reject);
      request.write(responseBody);
      request.end();
    });
  };
  
  export const handler = async (
    event: CloudFormationCustomResourceEvent,
    context: Context,
  ) => {
    console.log(`Event type: ${JSON.stringify(event)}`);
  
    const physicalResourceId = 'init-table-custom-resource';
  
    try {
      if (event.RequestType === 'Delete') {
        await sendResponse(event, context, 'SUCCESS', physicalResourceId);
        return;
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
  
      await sendResponse(event, context, 'SUCCESS', physicalResourceId);
    } catch (error) {
      console.error('Error:', error);
      await sendResponse(event, context, 'FAILED', physicalResourceId, String(error));
    }
  };
  