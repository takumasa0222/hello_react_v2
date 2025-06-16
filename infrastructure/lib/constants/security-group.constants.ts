export const SECURITY_GROUP = {
	BASE_NAME: 'SG',
	LAMBDA_TO_AURORA_SG: 'LambdaToAuroraSG',
	LAMBDA_TO_AURORA_SG_DESC: 'SG for Lambda to connect to Aurora',
	AURORA_SG: 'AuroraSG',
	AURORA_SG_DESC: 'SG for Aurora to accept Lambda connections',
	INDEX_DOCUMENT: 'index.html',
	ERROR_DOCUMENT: 'error.html',
	POSTGRESQL_DEFAULT_PORT: 5432,
	AURORA_INGRESS_RULE_DESC:'Allow Lambda to connect to Aurora (PostgreSQL)',
}
