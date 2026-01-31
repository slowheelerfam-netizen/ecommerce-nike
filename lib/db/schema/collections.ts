import { pgTable, text, timestamp, uuid, boolean, json } from 'drizzle-orm/pg-core';

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  banner: text('banner'),
  isActive: boolean('isActive').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: text('sortOrder').default('0').notNull(),
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  productIds: json('productIds'), // Array of product IDs
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
