import Link from 'next/link';
import { getRepos } from '@/lib/orm/repositories';

export const dynamic = 'force-dynamic';

type PostWithRelations = {
  title: string;
  content: string;
  author?: { name: string };
  comments?: { id: string; body: string }[];
};

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { posts } = await getRepos();
  // Relations are lazy by default → populate explicitly.
  const post = (await posts.findByIdWithRelations(id, ['author', 'comments'])) as PostWithRelations | null;

  if (!post) {
    return (
      <section className="page">
        <Link href="/" className="back">← Back</Link>
        <p className="empty">Post not found.</p>
      </section>
    );
  }

  const comments = post.comments ?? [];

  return (
    <article className="page">
      <Link href="/" className="back">← Back</Link>
      <h1 className="article-title">{post.title}</h1>
      {post.author && <p className="byline">by {post.author.name}</p>}
      <div className="prose">{post.content}</div>

      <h2 className="comments-title">💬 Comments ({comments.length})</h2>
      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id} className="comment">{c.body}</li>
        ))}
      </ul>
    </article>
  );
}
