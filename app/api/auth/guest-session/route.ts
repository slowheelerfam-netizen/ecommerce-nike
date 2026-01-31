import { NextRequest, NextResponse } from 'next/server';
import { createGuestSession } from '@/lib/auth/actions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = await createGuestSession();
    
    return NextResponse.json({ 
      success: true, 
      sessionToken 
    });
  } catch (error) {
    console.error('Create guest session error:', error);
    return NextResponse.json(
      { error: 'Failed to create guest session' },
      { status: 500 }
    );
  }
}
