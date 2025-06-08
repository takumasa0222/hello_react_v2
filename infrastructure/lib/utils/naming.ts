export const createResourceName = (app:string, base: string, stage: string): string => {
	return `${app}-${base}-${stage}`;
};
