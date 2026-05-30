/**
 * lib/orm/seed-on-boot.ts  —  STARTER concern (NOT part of @mostajs/orm core).
 * ---------------------------------------------------------------------------
 * Anti-"empty-page" guard for the in-memory / WebContainer (Bolt.new) demo.
 *
 * Why this lives in the starter, not in the ORM:
 *   @mostajs/orm is domain-agnostic — it knows nothing about User/Post/Comment.
 *   Seeding demo data is an APPLICATION decision, so it belongs here.
 *
 * Strategy (see docs/ROADMAP-ADOPTION-IA.md §6 + Q2):
 *   On Bolt.new the DB is `:memory:` (fastest boot, zero native-binary failure
 *   surface). A fresh in-memory DB is empty → the app would show a blank page,
 *   which frustrates first-time visitors. `seedIfEmpty()` populates demo data
 *   ONCE, idempotently, the first time the connection is opened.
 *
 * Idempotent: it checks `users.count({})` and returns early if data exists, so
 * it is safe to call on every boot (HMR, refresh) and on a persisted file DB.
 *
 * Author: Dr Hamid MADANI <drmdh@msn.com>
 * ---------------------------------------------------------------------------
 */

import { BaseRepository, type IDialect } from '@mostajs/orm';
import { UserSchema, PostSchema, CommentSchema } from './schemas';
import type { User, Post, Comment } from './repositories';

/** Demo dataset — 3 users, 5 posts (1 draft), 12 comments. */
const USERS: Omit<User, 'id'>[] = [
  { email: 'alice@example.com', name: 'Alice Martin', bio: 'Full-stack dev, TypeScript enthusiast.' },
  { email: 'bob@example.com',   name: 'Bob Nguyen',   bio: 'Backend engineer. Loves Postgres & MongoDB.' },
  { email: 'carol@example.com', name: 'Carol Diallo', bio: 'Tech writer and open-source contributor.' },
];

const POSTS: (Omit<Post, 'id' | 'author'> & { authorIndex: number })[] = [
  { authorIndex: 0, title: 'Getting started with @mostajs/orm',           slug: 'getting-started-mostajs-orm',     content: 'One API, 13 databases, zero codegen.',                 published: true },
  { authorIndex: 0, title: 'SQLite to PostgreSQL in one line',            slug: 'sqlite-to-postgres-one-line',     content: 'Change the dialect config, keep your code identical.',  published: true },
  { authorIndex: 1, title: 'MongoDB-style filters on a SQL database',     slug: 'mongodb-filters-on-sql',          content: 'Using $gte, $in and $or against PostgreSQL.',           published: true },
  { authorIndex: 1, title: 'Runs in the browser via WASM (sqljs)',        slug: 'sqljs-wasm-browser',              content: 'Zero native binary — boots in Bolt.new & the browser.', published: true },
  { authorIndex: 2, title: 'Draft: the built-in schema linter (24 rules)', slug: 'schema-linter-24-rules',         content: 'Catch soft-delete and lazy-relation bugs before runtime.', published: false },
];

const COMMENTS: { postIndex: number; authorIndex: number; body: string }[] = [
  { postIndex: 0, authorIndex: 1, body: 'Great intro, the zero-codegen part sold me.' },
  { postIndex: 0, authorIndex: 2, body: 'Finally an ORM that does both SQL and Mongo.' },
  { postIndex: 0, authorIndex: 0, body: 'Thanks! More tutorials coming soon.' },
  { postIndex: 1, authorIndex: 1, body: 'The one-line switch is wild. Tested on MySQL too.' },
  { postIndex: 1, authorIndex: 2, body: 'Would love a Spanner example next.' },
  { postIndex: 2, authorIndex: 0, body: '$or on Postgres without raw SQL is exactly what I needed.' },
  { postIndex: 2, authorIndex: 2, body: 'Does $regex map to ILIKE on Postgres?' },
  { postIndex: 2, authorIndex: 1, body: 'Yes, it maps to the dialect-appropriate operator.' },
  { postIndex: 3, authorIndex: 0, body: 'It really boots in Bolt.new on the first try.' },
  { postIndex: 3, authorIndex: 2, body: 'No better-sqlite3 binary headaches — nice.' },
  { postIndex: 3, authorIndex: 1, body: 'WASM everywhere. Edge-ready too.' },
  { postIndex: 1, authorIndex: 0, body: 'Updated with a MariaDB note, thanks Bob.' },
];

/**
 * Seed demo data once if the database is empty. Safe to call on every boot.
 * Disable with `ORM_SEED_ON_BOOT=0` (e.g. in production with real data).
 */
export async function seedIfEmpty(dialect: IDialect): Promise<void> {
  if (process.env.ORM_SEED_ON_BOOT === '0') return;

  const users    = new BaseRepository<User>(UserSchema, dialect);
  const posts    = new BaseRepository<Post>(PostSchema, dialect);
  const comments = new BaseRepository<Comment>(CommentSchema, dialect);

  if ((await users.count({})) > 0) return; // already seeded — idempotent

  const createdUsers: User[] = [];
  for (const u of USERS) createdUsers.push(await users.create(u));

  const createdPosts: Post[] = [];
  for (const { authorIndex, ...rest } of POSTS) {
    createdPosts.push(await posts.create({ ...rest, author: createdUsers[authorIndex].id }));
  }

  for (const c of COMMENTS) {
    await comments.create({
      body: c.body,
      post: createdPosts[c.postIndex].id,
      author: createdUsers[c.authorIndex].id,
    });
  }
}
