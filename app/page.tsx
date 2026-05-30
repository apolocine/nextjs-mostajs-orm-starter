import Link from 'next/link';
import { getRepos } from '@/lib/orm/repositories';

export const dynamic = 'force-dynamic';

type PostCard = {
  id: string;
  title: string;
  author?: { name: string };
  comments?: unknown[];
};

export default async function HomePage() {
  const { posts } = await getRepos();
  // Populate author + comments so each card can show "by X · N comments".
  const list = (await posts.findWithRelations(
    { published: true },
    ['author', 'comments'],
    { sort: { createdAt: -1 }, limit: 20 },
  )) as unknown as PostCard[];

  return (
    <section className="page">
      <h1 className="page-title">📝 Recent posts</h1>
      <p className="lead">
        Powered by <code>@mostajs/orm</code> — one API, 13 databases, zero codegen. Boots in the
        browser via WASM (<code>sqljs</code>).
      </p>

      <ul className="post-list">
        {list.map((p) => {
          const n = p.comments?.length ?? 0;
          return (
            <li key={p.id}>
              <Link href={`/posts/${p.id}`} className="post-card">
                <h2>{p.title}</h2>
                <p className="post-meta">
                  {p.author?.name ? `by ${p.author.name}` : 'Unknown author'} · {n} comment{n === 1 ? '' : 's'}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      {list.length === 0 && <p className="empty">No published posts yet.</p>}
    </section>
  );
}
