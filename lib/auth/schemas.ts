import { z } from 'zod';

// User authentication schemas
export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Guest session schema
export const guestSessionSchema = z.object({
  sessionToken: z.string().uuid('Invalid session token'),
});

// Cart item schema for validation
export const cartItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  variant: z.string().optional(),
});

// User profile update schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  image: z.string().url('Invalid image URL').optional(),
});

// Verification schema
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type GuestSessionInput = z.infer<typeof guestSessionSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
