/**
 * Server Actions — posts.
 * @author Dr Hamid MADANI <drmdh@msn.com>
 */
'use server';
import { revalidatePath } from 'next/cache';
import { getRepos } from '@/lib/orm/repositories';

export async function publishPost(id: string) {
  const { posts } = await getRepos();
  await posts.update(id, { published: true });
  revalidatePath('/');
}
