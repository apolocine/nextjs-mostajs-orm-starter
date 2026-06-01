# Checklist de test — starters @mostajs/orm sur 3 WebContainers

**Auteur** : Dr Hamid MADANI <drmdh@msn.com>
**Testé** : juin 2026 · `@mostajs/orm@2.5.3` · Next pin `15.4.11`

Les 6 starters testés **E2E** sur StackBlitz · Bolt.new · CodeSandbox. Tous bootent
**sans binaire natif** via le dialecte `sqljs` (SQLite WASM).

## Résultats

| Starter | StackBlitz | Bolt.new | CodeSandbox |
|---|---|---|---|
| express-mostajs-orm-starter | ✅ | ✅ | ✅ |
| fastify-mostajs-orm-starter | ✅ | ✅ | ✅ |
| hono-mostajs-orm-starter | ✅ | ✅ | ✅ |
| nextjs-mostajs-orm-starter | ✅ | ⚠️ prod | ✅ |
| mostajs-saas-starter | ✅ | ⚠️ prod | ✅ |
| mostajs-survey-starter | ✅ | ⚠️ prod | ✅ |

- ✅ = boot + scénario E2E OK en `npm run dev`.
- ⚠️ prod = voir « Caveat Bolt » ci-dessous (les starters **Next** : `npm run build && npm run start`).

## Liens « Open in… »

| Starter | StackBlitz | Bolt.new | CodeSandbox |
|---|---|---|---|
| express | https://stackblitz.com/github/apolocine/express-mostajs-orm-starter | https://bolt.new/github.com/apolocine/express-mostajs-orm-starter | https://codesandbox.io/p/github/apolocine/express-mostajs-orm-starter |
| fastify | https://stackblitz.com/github/apolocine/fastify-mostajs-orm-starter | https://bolt.new/github.com/apolocine/fastify-mostajs-orm-starter | https://codesandbox.io/p/github/apolocine/fastify-mostajs-orm-starter |
| hono | https://stackblitz.com/github/apolocine/hono-mostajs-orm-starter | https://bolt.new/github.com/apolocine/hono-mostajs-orm-starter | https://codesandbox.io/p/github/apolocine/hono-mostajs-orm-starter |
| nextjs | https://stackblitz.com/github/apolocine/nextjs-mostajs-orm-starter | https://bolt.new/github.com/apolocine/nextjs-mostajs-orm-starter | https://codesandbox.io/p/github/apolocine/nextjs-mostajs-orm-starter |
| saas | https://stackblitz.com/github/apolocine/mostajs-saas-starter | https://bolt.new/github.com/apolocine/mostajs-saas-starter | https://codesandbox.io/p/github/apolocine/mostajs-saas-starter |
| survey | https://stackblitz.com/github/apolocine/mostajs-survey-starter | https://bolt.new/github.com/apolocine/mostajs-survey-starter | https://codesandbox.io/p/github/apolocine/mostajs-survey-starter |

## Vérifs E2E (par type)

- **Blog (nextjs/express/fastify/hono)** : seed users/posts/comments visibles · relations (auteur + commentaires) · soft-delete · CRUD.
- **saas** : signup → `/dashboard` · login/logout · créer/ouvrir/supprimer projet · ajouter/cocher/supprimer tâche · refresh auto.
- **survey** : formulaire 5 questions → `/thanks` · dashboard admin (graphes).

## Caveats plateforme

- **StackBlitz** — référence, fait tourner Next 15 dev. 6/6 ✅.
- **Bolt.new** — bâti sur StackBlitz mais **ne fait PAS tourner Next 15 en mode dev** :
  toute page Next dev lève `Error: Method not implemented.` (`getEnclosingLineNumber`,
  dans `blitz.*.js` — API V8 non implémentée par le runtime Bolt, appelée par l'overlay
  dev de Next). **Pas un bug des starters** (même code = ✅ ailleurs). Les 3 starters
  **non-Next** passent. → Pour les Next sur Bolt : `npm run build && npm run start` (prod).
- **CodeSandbox** — fait tourner Next dev (1ʳᵉ visite = compile à la volée, normal).
  Preview en **iframe cross-site** (`*.csb.app`) → l'auth saas nécessite
  `crossSiteCookie: true` (auth-lite ≥ 0.3.0 → `sameSite:'none'+secure` en https).

## Corrections appliquées (pour ce résultat)

- `@mostajs/orm` 2.5.3 sur les 6 ; **next pinné `15.4.11`** (15.5.x casse en WebContainer).
- Serveurs tsx → **compile-then-run** (`tsc → node dist/server.js`) : le loader ESM de tsx échoue sur le Node 18 WebContainer.
- `@mostajs/auth-lite` **0.3.0** : split `.`/`./next`, **redirects relatifs**, option **crossSiteCookie**.
- saas : server actions en **formData** (pas de `.bind`/closures), `redirect()` au lieu de `revalidatePath`, `getCurrentUser()` en 1er await.
- survey : redirect en **Location relatif**.

---

*Checklist maintenue par Dr Hamid MADANI <drmdh@msn.com>.*
