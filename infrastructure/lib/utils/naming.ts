export const createResourceName = (app:string, base: string, stage: string): string => {
	return `${app}-${base}-${stage}`;
};

export const createDBName = (app: string, base: string, stage: string): string => {
	const normalized = (s: string) =>
	  s.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^[_\d]+/, '').slice(0, 63);
  
	return normalized(`${app}_${base}_${stage}`);
  };
  