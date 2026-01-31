'use client';

import { useState, useEffect } from 'react';
import { signUp, signIn } from '../../lib/auth/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignUpInput, SignInInput } from '../../lib/auth/schemas';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSignUp = async (data: SignUpInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp(data);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      const returnUrl = searchParams.get('returnUrl');
      router.push(returnUrl || '/');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (data: SignInInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(data);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      const returnUrl = searchParams.get('returnUrl');
      router.push(returnUrl || '/');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp: handleSignUp,
    signIn: handleSignIn,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

export function useGuestSession() {
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkGuestStatus = async () => {
      try {
        const response = await fetch('/api/auth/guest-status');
        const data = await response.json();
        setIsGuest(data.isGuest);
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    };

    checkGuestStatus();
  }, []);

  return { isGuest, isLoading };
}
