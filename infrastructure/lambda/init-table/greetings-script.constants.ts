export const TABLE_SCRIPTS = {
  CREATE_TABLE_SQL: `CREATE TABLE IF NOT EXISTS greetings (
  lang TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  PRIMARY KEY (lang, type))`,
 INSERT_DEFAULT_VAL_SQL: `INSERT INTO greetings (lang, type, message)
  VALUES ('en', 'hello', 'Hello World!!')
  ON CONFLICT (lang, type) DO NOTHING;`
}