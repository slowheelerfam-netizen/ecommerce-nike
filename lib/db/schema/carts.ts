import { pgTable, text, timestamp, uuid, numeric, json } from 'drizzle-orm/pg-core';
import { users } from './user';
import { guests } from './guest';
import { products } from './products';
import { variants } from './variants';

export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').references(() => users.id, { onDelete: 'cascade' }),
  guestId: uuid('guestId').references(() => guests.id, { onDelete: 'cascade' }),
  items: json('items').notNull(), // Array of cart items
  subtotal: numeric('subtotal').default('0').notNull(),
  tax: numeric('tax').default('0').notNull(),
  shipping: numeric('shipping').default('0').notNull(),
  discount: numeric('discount').default('0').notNull(),
  total: numeric('total').default('0').notNull(),
  currency: text('currency').default('USD').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cartId').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productId: uuid('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantId: uuid('variantId').references(() => variants.id, { onDelete: 'cascade' }),
  quantity: numeric('quantity').notNull(),
  price: numeric('price').notNull(), // Price at time of adding to cart
  addedAt: timestamp('addedAt').defaultNow().notNull(),
});

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
