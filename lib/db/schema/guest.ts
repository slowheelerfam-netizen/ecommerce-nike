import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const guests = pgTable('guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('sessionToken').notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
});

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
