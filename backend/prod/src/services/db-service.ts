// services/db-service.ts
import {
	RDSDataClient,
	ExecuteStatementCommand,
	ExecuteStatementCommandInput,
	Field,
	SqlParameter
  } from '@aws-sdk/client-rds-data';
  
  export class DBService {
	private client: RDSDataClient;
  
	constructor(
	  private clusterArn: string,
	  private secretArn: string,
	  private dbName: string,
	  region: string
	) {
	  this.client = new RDSDataClient({ region });
	}
  
	async query<T>(sql: string, parameters: SqlParameter[] = []): Promise<T[]> {
	  try {
	    const input: ExecuteStatementCommandInput = {
	  	  resourceArn: this.clusterArn,
	  	  secretArn: this.secretArn,
	  	  database: this.dbName,
	  	  sql,
	  	  parameters,
	  	  includeResultMetadata: true,
	    };
    
	    const result = await this.client.send(new ExecuteStatementCommand(input));
	    const metadata = result.columnMetadata || [];
    
	    return (result.records || []).map((record) => {
	  	  const row: any = {};
	  	  metadata.forEach((meta, i) => {
	  	    const key = meta.name || `col${i}`;
	  	    const field: Field = record[i];
	  	    row[key] = Object.values(field)[0]; 
	  	  });
	      return row as T;
	    });
	  } catch (err) {
		console.error('DB query error:', err);
		throw new Error('DB query failed');
	  }
	}
  }
  