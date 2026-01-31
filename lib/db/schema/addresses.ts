import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { users } from './user';

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'shipping' | 'billing'
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  company: text('company'),
  address: text('address').notNull(),
  apartment: text('apartment'),
  city: text('city').notNull(),
  province: text('province').notNull(),
  postalCode: text('postalCode').notNull(),
  country: text('country').notNull(),
  phone: text('phone'),
  isDefault: boolean('isDefault').default(false).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
