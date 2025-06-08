export const STAGES = {
	DEV: 'dev',
	PROD: 'prod',
	STG: 'stg',
	TEST: 'test',
} as const;

export type Stage = typeof STAGES[keyof typeof STAGES];
