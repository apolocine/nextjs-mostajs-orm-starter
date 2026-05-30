import { NextResponse } from 'next/server';
import { getRepos } from '@/lib/orm/repositories';

// GET /api/posts — liste des articles publiés
export async function GET() {
  const { posts } = await getRepos();
  const list = await posts.findAll({ published: true }, { sort: { createdAt: -1 }, limit: 50 });
  return NextResponse.json(list);
}

// POST /api/posts — crée un article
export async function POST(req: Request) {
  const body = await req.json();
  const { posts } = await getRepos();
  const created = await posts.create({
    title: body.title,
    slug: body.slug,
    content: body.content,
    published: body.published ?? false,
    author: body.authorId,
  });
  return NextResponse.json(created, { status: 201 });
}
