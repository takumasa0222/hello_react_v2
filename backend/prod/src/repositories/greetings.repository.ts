// repositories/greetings.repository.ts
import { BaseRepository } from './base-repository.js';
import { Greeting } from '../models/greeting.js'
import { DBService } from '../services/db-service.js';

export class GreetingsRepository extends BaseRepository<Greeting> {
  constructor(dbService: DBService) {
    super(dbService, 'greetings');
  }

  fromRow(row: any): Greeting {
    return {
      lang: row.lang,
      type: row.type,
      message: row.message,
    };
  }

  async findByLangAndType(lang: string, type: string): Promise<Greeting[]> {
    return this.findBySql(
      `SELECT * FROM ${this.tableName} WHERE lang = :lang AND type = :type`,
      [
        { name: 'lang', value: { stringValue: lang } },
        { name: 'type', value: { stringValue: type } },
      ]
    );
  }
}
