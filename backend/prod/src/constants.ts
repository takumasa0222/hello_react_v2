// constants.ts
export const STATUS_CODES = {
	OK: 200,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500,
  };
  
  export const ERROR_MESSAGES = {
	MISSING_QUERY: 'Missing lang or type query parameter',
	ITEM_NOT_FOUND: 'Item not found',
	SERVER_ERROR: 'Internal server error',
  };

  export const QUERIES = {
	SELECT_GREETINGS: "SELECT * FROM greetings WHERE lang = :lang AND type = :type"
  }

  export const DEFAULT_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Content-Type': 'application/json'
  };