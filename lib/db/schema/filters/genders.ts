import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const genders = pgTable('genders', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  isActive: boolean('isActive').default(true).notNull(),
  sortOrder: text('sortOrder').default('0').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Gender = typeof genders.$inferSelect;
export type NewGender = typeof genders.$inferInsert;
