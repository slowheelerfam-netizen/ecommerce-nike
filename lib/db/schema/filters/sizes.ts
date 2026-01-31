import { pgTable, text, timestamp, uuid, boolean, numeric } from 'drizzle-orm/pg-core';

export const sizes = pgTable('sizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // 'clothing' | 'shoes' | 'accessories'
  value: text('value').notNull(), // e.g., 'S', 'M', 'L', 'US 9', 'EU 42'
  sortOrder: numeric('sortOrder').default('0').notNull(),
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Size = typeof sizes.$inferSelect;
export type NewSize = typeof sizes.$inferInsert;
