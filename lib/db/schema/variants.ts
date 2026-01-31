import { pgTable, text, timestamp, uuid, numeric, json, boolean } from 'drizzle-orm/pg-core';
import { products } from './products';

export const variants = pgTable('variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sku: text('sku').notNull().unique(),
  price: numeric('price').notNull(),
  comparePrice: numeric('comparePrice'),
  cost: numeric('cost'),
  inventory: numeric('inventory').notNull(),
  weight: numeric('weight'),
  dimensions: json('dimensions'), // { length, width, height }
  images: json('images'), // Array of variant-specific images
  attributes: json('attributes'), // { color: 'red', size: 'L', etc. }
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Variant = typeof variants.$inferSelect;
export type NewVariant = typeof variants.$inferInsert;
