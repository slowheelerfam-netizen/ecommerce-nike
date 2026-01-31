import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  hex: text('hex').notNull(), // Hex color code
  rgb: text('rgb'), // RGB values
  isActive: boolean('isActive').default(true).notNull(),
  sortOrder: text('sortOrder').default('0').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;
