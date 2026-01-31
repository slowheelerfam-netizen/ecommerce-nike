import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  icon: text('icon'),
  parentId: uuid('parentId').references((): any => categories.id, { onDelete: 'set null' }),
  isActive: boolean('isActive').default(true).notNull(),
  sortOrder: text('sortOrder').default('0').notNull(),
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
