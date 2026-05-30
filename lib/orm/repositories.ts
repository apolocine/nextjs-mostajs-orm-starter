/**
 * Typed repositories built on the connected dialect.
 * @author Dr Hamid MADANI <drmdh@msn.com>
 */
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
