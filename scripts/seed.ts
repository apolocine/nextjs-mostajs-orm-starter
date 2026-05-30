/**
 * scripts/seed.ts — `npm run orm:seed`
 *
 * Wipes & reseeds the database (create-drop) with 3 users / 5 posts / 12 comments.
 * For the idempotent boot-time seed (Bolt / :memory:), see lib/orm/seed-on-boot.ts.
 *
 * @author Dr Hamid MADANI <drmdh@msn.com>
 */
import { createConnection } from '@mostajs/orm';
import { ALL_SCHEMAS } from '../lib/orm/schemas';
import { seedIfEmpty } from '../lib/orm/seed-on-boot';

async function main() {
  console.log('\n🌱 Seeding @mostajs/orm blog starter...\n');

  const dialect = await createConnection(
    {
      dialect: (process.env.DB_DIALECT as 'sqlite' | 'sqljs') ?? 'sqlite',
      uri: process.env.DATABASE_URL ?? './blog.db',
      // create-drop : efface puis recrée le schéma pour un seed propre.
      schemaStrategy: 'create-drop',
      showSql: false,
    },
    ALL_SCHEMAS,
  );

  // Force le seed même si ORM_SEED_ON_BOOT=0 (on est en commande explicite).
  process.env.ORM_SEED_ON_BOOT = '1';
  await seedIfEmpty(dialect);

  console.log('✅ Done. Run `npm run dev` and open http://localhost:3000\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:\n', err);
  process.exit(1);
});
