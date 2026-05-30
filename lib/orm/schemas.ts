/**
 * EntitySchema — blog model (User · Post · Comment).
 * Pure TypeScript, no codegen.
 * @author Dr Hamid MADANI <drmdh@msn.com>
 */
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
  indexes: [{ fields: ['email'], unique: true }],
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
    { fields: ['slug'], unique: true, sparse: true },
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
