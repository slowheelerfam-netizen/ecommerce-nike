// Database schema exports for e-commerce system
export { users, type User, type NewUser } from './user';
export { accounts, type Account, type NewAccount } from './account';
export { sessions, type Session, type NewSession } from './session';
export { verifications, type Verification, type NewVerification } from './verification';
export { guests, type Guest, type NewGuest } from './guest';

// E-commerce schemas
export { addresses, type Address, type NewAddress } from './addresses';
export { products, type Product, type NewProduct } from './products';
export { variants, type Variant, type NewVariant } from './variants';
export { categories, type Category, type NewCategory } from './categories';
export { collections, type Collection, type NewCollection } from './collections';
export { orders, type Order, type NewOrder } from './orders';
export { carts, cartItems, type Cart, type CartItem, type NewCart, type NewCartItem } from './carts';
export { reviews, type Review, type NewReview } from './reviews';

// Filter schemas
export { genders, type Gender, type NewGender } from './filters/genders';
export { colors, type Color, type NewColor } from './filters/colors';
export { sizes, type Size, type NewSize } from './filters/sizes';

// Re-export Drizzle types for better integration
export * from 'drizzle-orm/pg-core';
