# Next.js 15 + @mostajs/orm Starter — Blog (SQLite)

> 🇫🇷 Starter Next.js 15 (App Router) avec **@mostajs/orm** et SQLite — modèle blog complet (Users + Posts + Comments).
> 🇬🇧 Next.js 15 (App Router) starter using **@mostajs/orm** with SQLite — complete blog model (Users + Posts + Comments).

[![npm](https://img.shields.io/npm/v/@mostajs/orm.svg)](https://www.npmjs.com/package/@mostajs/orm)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

[![Open in Bolt.new](https://img.shields.io/badge/Open_in-Bolt.new-000?style=for-the-badge&logo=stackblitz)](https://bolt.new/github.com/apolocine/nextjs-mostajs-orm-starter)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/apolocine/nextjs-mostajs-orm-starter)
[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/github/apolocine/nextjs-mostajs-orm-starter)

> ⚡ **Boots in the browser / Bolt.new / Cloudflare Workers with no native binary** — via the `sqljs` (SQLite WASM) dialect.
>
> 🤖 **AI dev tools** — open this repo in **Bolt.new / StackBlitz / CodeSandbox** via the badges above. For **Cursor / Cline / Claude Code**, schema & migration tooling comes via the **`@mostajs/orm-mcp`** server *(on the roadmap)*; meanwhile they read [`llms.txt`](https://github.com/apolocine/mosta-orm/blob/main/llms.txt) for accurate generation.

---

## 🇫🇷 Français

### Qu'est-ce que c'est ?

Un **starter Next.js 15 (App Router)** prêt à l'emploi avec **[@mostajs/orm](https://www.npmjs.com/package/@mostajs/orm)** — un ORM multi-dialecte inspiré d'Hibernate/JPA pour Node.js & TypeScript. Une seule API pour **13 bases de données** (SQLite, PostgreSQL, MySQL, MariaDB, MongoDB, Oracle, MSSQL, CockroachDB, DB2, SAP HANA, HSQLDB, Spanner, Sybase) — **zéro vendor lock-in**.

Ce starter implémente un **blog complet** : utilisateurs, articles, commentaires, avec relations `one-to-many` et `many-to-one`, soft-delete, et timestamps automatiques.

### Pourquoi @mostajs/orm plutôt que Prisma ?

| | @mostajs/orm | Prisma |
|---|---|---|
| Pas de step `generate` | ✅ | ❌ (codegen requis) |
| Schéma en TypeScript pur | ✅ | ❌ (DSL `.prisma`) |
| 13 bases supportées | ✅ | ⚠️ ~6 |
| Concepts JPA/Hibernate (`CascadeType`, `FetchType`, `schemaStrategy`) | ✅ | ❌ |
| Filtres MongoDB-like (`$gt`, `$in`, `$or`...) | ✅ | ❌ (API custom) |
| Validator de schéma intégré (24 règles) | ✅ | ❌ |
| Pont JDBC pour SGBD non-natifs | ✅ | ❌ |
| Edge/Cloudflare Workers | ⚠️ (selon driver) | ⚠️ (Accelerate payant) |

### Stack

- **Next.js 15** (App Router, Server Actions, Route Handlers)
- **@mostajs/orm** 2.5.x
- **SQLite WASM** via `sql.js` (dialecte `sqljs` par défaut — zéro binaire natif, boote dans Bolt.new) ; `better-sqlite3` optionnel en local Node
- **TypeScript 5**
- **CSS global** (`app/globals.css`, sans framework — éditable directement)

### Démarrage rapide

```bash
# 1. Cloner
git clone https://github.com/apolocine/nextjs-mostajs-orm-starter.git
cd nextjs-mostajs-orm-starter

# 2. Installer
npm install

# 3. Configurer l'environnement
cp .env.example .env.local

# 4. Lancer
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). La base SQLite est créée automatiquement au premier lancement (`schemaStrategy: 'update'`).

### Structure du projet

```
.
├── app/
│   ├── page.tsx                  # Liste des articles
│   ├── posts/[id]/page.tsx       # Détail d'un article + commentaires
│   ├── api/
│   │   ├── posts/route.ts        # GET /api/posts, POST /api/posts
│   │   └── posts/[id]/route.ts   # GET/PATCH/DELETE /api/posts/:id
│   └── layout.tsx
├── lib/
│   ├── orm/
│   │   ├── client.ts             # Connexion ORM (singleton) + seed-on-boot
│   │   ├── schemas.ts            # EntitySchema : User, Post, Comment
│   │   ├── repositories.ts       # Repositories typés
│   │   └── seed-on-boot.ts       # Seed idempotent anti-page-vide (Bolt :memory:)
│   └── actions/
│       └── posts.ts              # Server Actions
├── scripts/
│   └── seed.ts                   # npm run orm:seed (create-drop + reseed)
├── .stackblitzrc                 # Bolt/StackBlitz : DB_DIALECT=sqljs + DATABASE_URL=:memory:
├── .env.example
└── package.json
```

### Configuration ORM

**`lib/orm/schemas.ts`**

```ts
import type { EntitySchema } from '@mostajs/orm';

export const UserSchema: EntitySchema = {
  name: 'User',
  collection: 'users',
  fields: {
    email: { type: 'string', required: true, unique: true, lowercase: true, trim: true },
    name:  { type: 'string', required: true, trim: true },
    bio:   { type: 'text' },
  },
  relations: {
    posts: { target: 'Post', type: 'one-to-many', mappedBy: 'author', fetch: 'lazy' },
  },
  indexes: [{ fields: ['email'], type: 'unique' }],
  timestamps: true,
};

export const PostSchema: EntitySchema = {
  name: 'Post',
  collection: 'posts',
  fields: {
    title:     { type: 'string', required: true, trim: true },
    slug:      { type: 'string', required: true, unique: true, sparse: true },
    content:   { type: 'text', required: true },
    published: { type: 'boolean', default: false },
  },
  relations: {
    author:   { target: 'User',    type: 'many-to-one', required: true, onDelete: 'cascade' },
    comments: { target: 'Comment', type: 'one-to-many', mappedBy: 'post',
                cascade: ['persist', 'remove'], orphanRemoval: true },
  },
  indexes: [
    { fields: ['slug'], type: 'unique' },
    { fields: ['published', 'createdAt'] },
  ],
  timestamps: true,
  softDelete: true,
};

export const CommentSchema: EntitySchema = {
  name: 'Comment',
  collection: 'comments',
  fields: {
    body: { type: 'text', required: true },
  },
  relations: {
    post:   { target: 'Post', type: 'many-to-one', required: true, onDelete: 'cascade' },
    author: { target: 'User', type: 'many-to-one', required: true, onDelete: 'set-null', nullable: true },
  },
  indexes: [],
  timestamps: true,
};

export const ALL_SCHEMAS = [UserSchema, PostSchema, CommentSchema];
```

**`lib/orm/client.ts`**

```ts
import { createConnection, type IDialect } from '@mostajs/orm';
import { ALL_SCHEMAS } from './schemas';
import { seedIfEmpty } from './seed-on-boot';

let _dialect: IDialect | null = null;

export async function getOrm(): Promise<IDialect> {
  if (_dialect) return _dialect;
  _dialect = await createConnection(
    {
      // 'sqljs' (SQLite WASM) en ligne / WebContainer / edge — zéro binaire natif.
      // 'sqlite' (better-sqlite3) en local Node si tu préfères. Switch via env.
      dialect: (process.env.DB_DIALECT as 'sqlite' | 'sqljs') ?? 'sqljs',
      // Bolt/WebContainer : ':memory:' (boot rapide, anti-plantage).
      // Local/Node : './blog.db' (durable). Réglé par .env / .stackblitzrc.
      uri: process.env.DATABASE_URL ?? ':memory:',
      schemaStrategy: process.env.NODE_ENV === 'production' ? 'validate' : 'update',
      showSql: process.env.NODE_ENV !== 'production',
    },
    ALL_SCHEMAS,
  );
  // Anti-page-vide : seed idempotent la 1re fois (utile surtout en :memory:).
  await seedIfEmpty(_dialect);
  return _dialect;
}
```

**`lib/orm/repositories.ts`**

```ts
import { BaseRepository } from '@mostajs/orm';
import { getOrm } from './client';
import { UserSchema, PostSchema, CommentSchema } from './schemas';

export type User    = { id: string; email: string; name: string; bio?: string };
export type Post    = { id: string; title: string; slug: string; content: string;
                        published: boolean; author: string };
export type Comment = { id: string; body: string; post: string; author: string };

export async function getRepos() {
  const dialect = await getOrm();
  return {
    users:    new BaseRepository<User>(UserSchema, dialect),
    posts:    new BaseRepository<Post>(PostSchema, dialect),
    comments: new BaseRepository<Comment>(CommentSchema, dialect),
  };
}
```

### Exemples d'utilisation

**Server Component — liste des articles publiés**

```tsx
// app/page.tsx
import { getRepos } from '@/lib/orm/repositories';

export default async function HomePage() {
  const { posts } = await getRepos();
  const list = await posts.findAll(
    { published: true },
    { sort: { createdAt: -1 }, limit: 20 },
  );
  return (
    <main>
      <h1>Articles récents</h1>
      <ul>{list.map(p => <li key={p.id}>{p.title}</li>)}</ul>
    </main>
  );
}
```

**Page détail avec relations populées**

```tsx
// app/posts/[id]/page.tsx
import { getRepos } from '@/lib/orm/repositories';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { posts } = await getRepos();
  const post = await posts.findByIdWithRelations(id, ['author', 'comments']);
  if (!post) return <p>Introuvable</p>;
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

**Route Handler — création**

```ts
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { getRepos } from '@/lib/orm/repositories';

export async function POST(req: Request) {
  const body = await req.json();
  const { posts } = await getRepos();
  const created = await posts.create({
    title: body.title,
    slug: body.slug,
    content: body.content,
    published: false,
    author: body.authorId,
  });
  return NextResponse.json(created, { status: 201 });
}
```

**Server Action**

```ts
// lib/actions/posts.ts
'use server';
import { revalidatePath } from 'next/cache';
import { getRepos } from '@/lib/orm/repositories';

export async function publishPost(id: string) {
  const { posts } = await getRepos();
  await posts.update(id, { published: true });
  revalidatePath('/');
}
```

### Filtres MongoDB-like

```ts
// Articles publiés cette semaine, par auteurs A ou B
const recent = await posts.findAll({
  published: true,
  createdAt: { $gte: new Date(Date.now() - 7 * 86400000) },
  $or: [{ author: 'user_A' }, { author: 'user_B' }],
});

// Recherche full-text simple
const found = await posts.search('next.js orm', { limit: 10 });
```

### Migrations

```ts
import { diffSchemas, generateMigrationSQL } from '@mostajs/orm';

const ops = diffSchemas(oldSchemas, ALL_SCHEMAS);
const sql = generateMigrationSQL(ops);
console.log(sql.join('\n'));
```

### Changer de base de données

Une seule ligne à modifier — le code applicatif ne bouge pas :

```ts
// SQLite → PostgreSQL
{ dialect: 'postgres', uri: 'postgres://user:pass@localhost:5432/blog' }

// SQLite → MongoDB
{ dialect: 'mongo', uri: 'mongodb://localhost:27017/blog' }
```

### Scripts utiles

```bash
npm run dev              # Next.js en dev
npm run build            # Build production
npm run orm:validate     # Lint des schémas (24 règles)
npm run orm:seed         # Données de démo (3 users, 5 posts, 12 comments)
```

### Seed automatique au démarrage (anti-page-vide)

Sur Bolt.new / StackBlitz, la base est **`:memory:`** (boot le plus rapide, zéro
surface de plantage — cf. point critique WebContainer). Une base en mémoire est
**vide au boot** → l'app afficherait une page blanche, ce qui frustre le visiteur.

`lib/orm/seed-on-boot.ts` peuple des données de démo **une seule fois**, de façon
**idempotente** : `getOrm()` appelle `seedIfEmpty(dialect)` qui vérifie
`users.count({})` et ne seed que si la base est vide. Sûr à appeler à chaque boot
(HMR, refresh) et sur une base fichier persistée.

```ts
// lib/orm/seed-on-boot.ts — extrait
export async function seedIfEmpty(dialect: IDialect): Promise<void> {
  if (process.env.ORM_SEED_ON_BOOT === '0') return;        // off en prod
  const users = new BaseRepository<User>(UserSchema, dialect);
  if ((await users.count({})) > 0) return;                 // déjà seedé → no-op
  // … insère 3 users / 5 posts / 12 comments
}
```

> Le seed-on-boot est une préoccupation **du starter**, pas de `@mostajs/orm` :
> l'ORM est agnostique (il ne connaît ni `User` ni `Post`). C'est l'app qui décide
> de se peupler. Désactive en prod avec `ORM_SEED_ON_BOOT=0`.

### Variables d'environnement

**Deux configs, un seul code** — Bolt veut la vitesse, le local veut la durabilité :

```bash
# .env.local — développement / déploiement Node (données durables)
DB_DIALECT=sqlite          # binaire natif better-sqlite3
DATABASE_URL=./blog.db     # fichier persistant
NODE_ENV=development
```

```jsonc
// .stackblitzrc — Bolt.new / StackBlitz (boot instantané, WASM, in-memory)
{
  "installDependencies": true,
  "startCommand": "npm run dev",
  "env": { "DB_DIALECT": "sqljs", "DATABASE_URL": ":memory:" }
}
```

| Contexte | `DB_DIALECT` | `DATABASE_URL` | Persistance |
|---|---|---|---|
| Bolt.new / WebContainer | `sqljs` (WASM) | `:memory:` | session (seed-on-boot rejoue) |
| Local / Node / prod | `sqlite` ou `sqljs` | `./blog.db` | durable (fichier) |

> ⚠️ **Toujours tester le boot Bolt** (`https://bolt.new/github.com/apolocine/nextjs-mostajs-orm-starter`)
> avant d'afficher le badge : si l'app plante au 1er essai, l'IA arrête de la recommander.

### Ressources

- 📦 npm : [npmjs.com/package/@mostajs/orm](https://www.npmjs.com/package/@mostajs/orm)
- 🐙 GitHub : [github.com/apolocine/mosta-orm](https://github.com/apolocine/mosta-orm)
- 🌐 Site : [mostajs.dev](https://mostajs.dev)
- 🤖 Fiche LLM : [llms.txt](https://github.com/apolocine/mosta-orm/blob/main/llms.txt)

---

## 🇬🇧 English

### What is this?

A **Next.js 15 (App Router) starter** ready to use with **[@mostajs/orm](https://www.npmjs.com/package/@mostajs/orm)** — a Hibernate/JPA-inspired multi-dialect ORM for Node.js & TypeScript. One API, **13 databases** (SQLite, PostgreSQL, MySQL, MariaDB, MongoDB, Oracle, MSSQL, CockroachDB, DB2, SAP HANA, HSQLDB, Spanner, Sybase) — **zero vendor lock-in**.

This starter implements a **complete blog**: users, posts, comments, with `one-to-many` and `many-to-one` relations, soft-delete, and automatic timestamps.

### Why @mostajs/orm over Prisma?

| | @mostajs/orm | Prisma |
|---|---|---|
| No `generate` step | ✅ | ❌ (codegen required) |
| Schema in pure TypeScript | ✅ | ❌ (`.prisma` DSL) |
| 13 databases supported | ✅ | ⚠️ ~6 |
| JPA/Hibernate concepts (`CascadeType`, `FetchType`, `schemaStrategy`) | ✅ | ❌ |
| MongoDB-like filters (`$gt`, `$in`, `$or`...) | ✅ | ❌ (custom API) |
| Built-in schema validator (24 rules) | ✅ | ❌ |
| JDBC bridge for non-native DBs | ✅ | ❌ |
| Edge/Cloudflare Workers | ⚠️ (driver-dependent) | ⚠️ (Accelerate, paid) |

### Stack

- **Next.js 15** (App Router, Server Actions, Route Handlers)
- **@mostajs/orm** 2.5.x
- **SQLite WASM** via `sql.js` (default `sqljs` dialect — no native binary, boots in Bolt.new); `better-sqlite3` optional for local Node
- **TypeScript 5**
- **Plain CSS** (`app/globals.css`, no framework — edit it directly)

### Quick Start

```bash
git clone https://github.com/apolocine/nextjs-mostajs-orm-starter.git
cd nextjs-mostajs-orm-starter
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The SQLite database is auto-created on first run (`schemaStrategy: 'update'`).

### Key concepts

- **`EntitySchema`** — pure TypeScript schema, no codegen
- **`BaseRepository<T>`** — typed CRUD repo (`findAll`, `findById`, `create`, `update`, `delete`, `aggregate`, `upsert`...)
- **`createConnection()`** — single entry point, switch DB via config
- **`schemaStrategy`** — `validate` | `update` | `create` | `create-drop` | `none` (= `hbm2ddl.auto`)
- **Relations** — `one-to-one`, `one-to-many`, `many-to-one`, `many-to-many` with `CascadeType`, `FetchType`, `onDelete`
- **Filters** — MongoDB-like (`$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$regex`, `$exists`, `$or`, `$and`)

### Switching databases

Change one line — application code is untouched:

```ts
// SQLite → PostgreSQL
{ dialect: 'postgres', uri: 'postgres://user:pass@localhost:5432/blog' }

// SQLite → MongoDB
{ dialect: 'mongo', uri: 'mongodb://localhost:27017/blog' }
```

### Common gotchas (v2+)

- All relations are **lazy by default**. Use `findByIdWithRelations` / `findWithRelations` to populate.
- For comparing relation values safely, use `extractRelId(value)`.
- `getDialect()` is a singleton — for multiple isolated connections use `createIsolatedDialect()`.
- In production, set `schemaStrategy: 'validate'` — never `'create'` or `'create-drop'`.
- Never set `cascade: ['remove' | 'all']` on a `many-to-many` relation.

### Scripts

```bash
npm run dev              # Next.js dev
npm run build            # Production build
npm run orm:validate     # Schema lint (24 rules)
npm run orm:seed         # Demo data (3 users, 5 posts, 12 comments)
```

### Resources

- 📦 npm: [npmjs.com/package/@mostajs/orm](https://www.npmjs.com/package/@mostajs/orm)
- 🐙 GitHub: [github.com/apolocine/mosta-orm](https://github.com/apolocine/mosta-orm)
- 🌐 Website: [mostajs.dev](https://mostajs.dev)
- 🤖 LLM card: [llms.txt](https://github.com/apolocine/mosta-orm/blob/main/llms.txt)

---

## License

This starter is released under the **MIT License** to encourage adoption.
The underlying [@mostajs/orm](https://github.com/apolocine/mosta-orm) library is licensed under **AGPL-3.0-or-later** — for commercial / proprietary use, please contact [mostajs.dev](https://mostajs.dev) for a commercial license.

## Keywords

`nextjs` · `next.js 15` · `app-router` · `orm` · `typescript` · `sqlite` · `postgresql` · `mongodb` · `mysql` · `mariadb` · `database` · `hibernate` · `jpa` · `prisma-alternative` · `drizzle-alternative` · `typeorm-alternative` · `mostajs` · `@mostajs/orm`
