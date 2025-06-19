// repositories/base-repository.ts
import { SqlParameter } from '@aws-sdk/client-rds-data';
import { DBService } from '../services/db-service.js';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly db: DBService,
    protected readonly tableName: string
  ) {}

  abstract fromRow(row: any): T;

  protected async findBySql(sql: string, params: SqlParameter[] = []): Promise<T[]> {
    const rows = await this.db.query<any>(sql, params);
    return rows.map(this.fromRow.bind(this));
  }
}
