import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getGuestSession } from '@/lib/auth/actions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const guestSession = await getGuestSession();
    
    return NextResponse.json({
      isGuest: !user && !!guestSession,
      user: user ? { id: user.id, email: user.email } : null,
    });
  } catch (error) {
    console.error('Guest status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check guest status' },
      { status: 500 }
    );
  }
}
