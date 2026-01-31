'use server';

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { guests } from '@/lib/db/schema/guest';
import { eq } from 'drizzle-orm';
import { cookies, headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { 
  signUpSchema, 
  signInSchema, 
  SignUpInput, 
  SignInInput
} from '@/lib/auth/schemas';
import { redirect } from 'next/navigation';

export async function createGuestSession() {
  const sessionToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  try {
    await db.insert(guests).values({
      sessionToken,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set('guest_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return sessionToken;
  } catch (error) {
    console.error('Failed to create guest session:', error);
    throw new Error('Failed to create guest session');
  }
}

export async function getGuestSession() {
  const cookieStore = await cookies();
  const guestSessionToken = cookieStore.get('guest_session')?.value;

  if (!guestSessionToken) {
    return null;
  }

  const guestSession = await db
    .select()
    .from(guests)
    .where(eq(guests.sessionToken, guestSessionToken))
    .limit(1);

  if (guestSession.length === 0 || new Date(guestSession[0].expiresAt) < new Date()) {
    cookieStore.delete('guest_session');
    return null;
  }

  return guestSession[0];
}

export async function clearGuestSession() {
  try {
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get('guest_session')?.value;

    if (guestSessionToken) {
      await db
        .delete(guests)
        .where(eq(guests.sessionToken, guestSessionToken));

      cookieStore.delete('guest_session');
    }
  } catch (error) {
    console.error('Failed to clear guest session:', error);
  }
}

export async function signUp(data: SignUpInput) {
  const validatedData = signUpSchema.parse(data);
  
  try {
    const result = await auth.api.signUpEmail({
      body: validatedData,
      headers: await headers(),
    });

    if (!result.user) {
      return { error: 'Failed to create account' };
    }

    if (result.user.id) {
      await migrateGuestCartToUser(result.user.id);
    }

    await clearGuestSession();

    return { success: true, user: result.user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: 'Failed to create account' };
  }
}

export async function signIn(data: SignInInput) {
  const validatedData = signInSchema.parse(data);
  
  try {
    const result = await auth.api.signInEmail({
      body: validatedData,
      headers: await headers(),
    });

    if (!result.user) {
      return { error: 'Invalid credentials' };
    }

    if (result.user.id) {
      await migrateGuestCartToUser(result.user.id);
    }

    await clearGuestSession();

    return { success: true, user: result.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: 'Failed to sign in' };
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  } catch {
    console.error('Sign out error');
    return { error: 'Failed to sign out' };
  }
}

export async function migrateGuestCartToUser(userId: string) {
  const guestSession = await getGuestSession();
  
  if (!guestSession) {
    return;
  }

  try {
    await clearGuestSession();
  } catch (error) {
    console.error('Failed to migrate guest cart:', error);
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    return session?.user || null;
  } catch (error) {
    return null;
  }
}

export async function isGuest() {
  const user = await getCurrentUser();
  const guestSession = await getGuestSession();
  
  return !user && !!guestSession;
}

export async function requireAuth(redirectTo?: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect(redirectTo || '/sign-in');
  }
  
  return user;
}
