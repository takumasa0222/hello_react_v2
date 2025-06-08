export const LAMBDA = {
	BASE_NAME: 'GreetingFunction',
	HANDLER: 'index.handler',
	TIMEOUT_SECONDS: 5,
	MEMORY_MB: 128,
	CODE_ASSET_PATH:'../backend/dist'
};

export const LAMBDA_ENV = {
	TABLE_NAME: 'TABLE_NAME',
  };
