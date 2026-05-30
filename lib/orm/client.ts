/**
 * ORM connection (singleton) + seed-on-boot.
 *
 * Dialect & uri come from env so the SAME code runs:
 *   - in Bolt.new / WebContainer : sqljs (WASM) + :memory:  (fast boot, no native binary)
 *   - in local Node / production : sqlite (better-sqlite3) + ./blog.db  (durable)
 *
 * @author Dr Hamid MADANI <drmdh@msn.com>
 */
import { createConnection, type IDialect } from '@mostajs/orm';
import { ALL_SCHEMAS } from './schemas';
import { seedIfEmpty } from './seed-on-boot';

let _dialect: IDialect | null = null;

export async function getOrm(): Promise<IDialect> {
  if (_dialect) return _dialect;
  _dialect = await createConnection(
    {
      dialect: (process.env.DB_DIALECT as 'sqlite' | 'sqljs') ?? 'sqljs',
      uri: process.env.DATABASE_URL ?? ':memory:',
      schemaStrategy: process.env.NODE_ENV === 'production' ? 'validate' : 'update',
      showSql: process.env.NODE_ENV !== 'production',
    },
    ALL_SCHEMAS,
  );
  // Anti-page-vide : seed idempotent la 1re fois (surtout utile en :memory:).
  await seedIfEmpty(_dialect);
  return _dialect;
}
