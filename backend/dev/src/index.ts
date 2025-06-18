import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { STATUS_CODES, ERROR_MESSAGES } from './constants.js';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
	const query = event.queryStringParameters || {}
	const lang = query.lang;
	const type = query.type;
	
	if (!lang || !type) {
		return {
		  statusCode: STATUS_CODES.BAD_REQUEST,
		  headers: { 'Access-Control-Allow-Origin': '*' },
		  body: JSON.stringify({ error: ERROR_MESSAGES.MISSING_QUERY }),
		};
	  }
	try {
		const result = await client.send(
			new GetCommand({
				TableName: TABLE_NAME,
				Key: {
					lang: lang,
					type: type,
				},
			})
		);
		if (!result.Item) {
			return {
			  statusCode: STATUS_CODES.NOT_FOUND,
			  headers: { 'Access-Control-Allow-Origin': '*' },
			  body: JSON.stringify({ error: ERROR_MESSAGES.ITEM_NOT_FOUND }),
			};
		  }
	  
		return {
			statusCode: STATUS_CODES.OK,
			headers: { 'Access-Control-Allow-Origin': '*' },
			body: JSON.stringify(result.Item),
		};
	} catch (error) {
		console.error('DynamoDB error:', error);
		return {
		  statusCode: STATUS_CODES.INTERNAL_ERROR,
		  headers: { 'Access-Control-Allow-Origin': '*' },
		  body: JSON.stringify({ error: ERROR_MESSAGES.SERVER_ERROR }),
		};
	}
};
