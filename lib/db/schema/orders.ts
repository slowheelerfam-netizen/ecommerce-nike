import { pgTable, text, timestamp, uuid, numeric, json, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user';
import { guests } from './guest';

export const orderStatus = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('orderNumber').notNull().unique(),
  userId: uuid('userId').references(() => users.id, { onDelete: 'set null' }),
  guestId: uuid('guestId').references(() => guests.id, { onDelete: 'set null' }),
  status: orderStatus('status').default('pending').notNull(),
  currency: text('currency').default('USD').notNull(),
  subtotal: numeric('subtotal').notNull(),
  tax: numeric('tax').notNull(),
  shipping: numeric('shipping').notNull(),
  discount: numeric('discount').default('0').notNull(),
  total: numeric('total').notNull(),
  items: json('items').notNull(), // Array of order items
  shippingAddress: json('shippingAddress').notNull(),
  billingAddress: json('billingAddress').notNull(),
  trackingNumber: text('trackingNumber'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
