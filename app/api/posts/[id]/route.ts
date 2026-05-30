import { NextResponse } from 'next/server';
import { getRepos } from '@/lib/orm/repositories';

type Ctx = { params: Promise<{ id: string }> };

// GET /api/posts/:id
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const { posts } = await getRepos();
  const post = await posts.findByIdWithRelations(id, ['author', 'comments']);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

// PATCH /api/posts/:id
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json();
  const { posts } = await getRepos();
  const updated = await posts.update(id, body);
  return NextResponse.json(updated);
}

// DELETE /api/posts/:id  (soft-delete : softDelete:true sur Post)
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const { posts } = await getRepos();
  await posts.delete(id);
  return NextResponse.json({ ok: true });
}
