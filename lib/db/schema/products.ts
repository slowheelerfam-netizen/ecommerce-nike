import { pgTable, text, timestamp, uuid, boolean, numeric, json } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  shortDescription: text('shortDescription'),
  sku: text('sku').notNull().unique(),
  price: numeric('price').notNull(),
  comparePrice: numeric('comparePrice'),
  cost: numeric('cost'),
  trackInventory: boolean('trackInventory').default(true).notNull(),
  isActive: boolean('isActive').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  images: json('images').notNull(), // Array of image URLs
  tags: json('tags'), // Array of tags
  metaTitle: text('metaTitle'),
  metaDescription: text('metaDescription'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
