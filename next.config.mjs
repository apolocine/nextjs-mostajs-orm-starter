/**
 * Next.js config.
 *
 * `serverExternalPackages` empêche le bundler de tracer @mostajs/orm et ses
 * drivers (binaire natif better-sqlite3, WASM sql.js) dans le graphe client —
 * sans quoi on obtient des erreurs aléatoires (ERR_BUFFER_OUT_OF_BOUNDS, etc.).
 * Lister TOUT driver natif utilisé.
 *
 * @author Dr Hamid MADANI <drmdh@msn.com>
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@mostajs/orm', 'better-sqlite3', 'sql.js'],
};

export default nextConfig;
