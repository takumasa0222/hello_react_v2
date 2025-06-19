import { APIGatewayProxyHandler } from 'aws-lambda';
import { STATUS_CODES, ERROR_MESSAGES, DEFAULT_HEADERS } from './constants.js';
import { GreetingsRepository } from './repositories/greetings.repository.js';
import { DBService } from './services/db-service.js';

const secretArn = process.env.SECRET_ARN;
const dbName = process.env.DB_NAME;
const clusterArn = process.env.CLUSTER_ARN;
const region =  process.env.AWS_REGION;

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
	  const lang = event.queryStringParameters?.lang;
	  const type = event.queryStringParameters?.type;
  
	  if (!lang || !type || !secretArn || !dbName || !clusterArn || !region) {
		return {
		  statusCode: STATUS_CODES.BAD_REQUEST,
		  headers: DEFAULT_HEADERS,
		  body: JSON.stringify({ error: ERROR_MESSAGES.MISSING_QUERY }),
		};
	  }
	  const dbService = new DBService(clusterArn, secretArn, dbName, region);
	  const greetingsRepo = new GreetingsRepository(dbService);
	  const greetings = await greetingsRepo.findByLangAndType(lang, type);
	  if (!greetings) {
		return {
			statusCode: STATUS_CODES.NOT_FOUND,
			headers: DEFAULT_HEADERS,
			body: JSON.stringify({ error: ERROR_MESSAGES.ITEM_NOT_FOUND }),
		}
	  }

	  return {
		statusCode: STATUS_CODES.OK,
		headers: DEFAULT_HEADERS,
		body: JSON.stringify(greetings),
	  };
	} catch (err) {
	  console.error('Error in handler:', err);
	  return {
		statusCode: STATUS_CODES.INTERNAL_ERROR,
		headers: DEFAULT_HEADERS,
		body: JSON.stringify({ error: ERROR_MESSAGES.SERVER_ERROR }),
	  };
	}
  };