import { pgTable, text, timestamp, uuid, numeric, boolean } from 'drizzle-orm/pg-core';
import { users } from './user';
import { products } from './products';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  rating: numeric('rating').notNull(), // 1-5 rating
  title: text('title').notNull(),
  content: text('content').notNull(),
  verified: boolean('verified').default(false).notNull(), // Verified purchase
  helpful: numeric('helpful').default('0').notNull(), // Helpful votes
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
