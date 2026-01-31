'use client';

import React, { useState, useEffect } from 'react';
import AuthForm from '../../../components/AuthForm';
import SocialProviders from '../../../components/SocialProviders';
import Link from 'next/link';
import { useAuth } from '../../../src/hooks/useAuth';
import { SignInInput } from '../../../lib/auth/schemas';

const SignIn = () => {
  const [formData, setFormData] = useState<SignInInput>({
    email: '',
    password: '',
  });
  
  const { signIn, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    clearError();
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <AuthForm
        type="signin"
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {/* Forgot Password */}
      <div className="text-right sm:text-left">
        <Link 
          href="/forgot-password" 
          className="text-body text-dark-600 hover:text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded transition-all duration-200"
        >
          Forgot password?
        </Link>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-light-100 text-body text-dark-600">Or continue with</span>
        </div>
      </div>

      {/* Social Sign In */}
      <SocialProviders type="signin" isLoading={isLoading} />

      {/* Sign Up Link */}
      <div className="text-center mt-6 text-body text-dark-600">
        <p className="sm:text-base">
          Don't have an account?{' '}
          <Link 
            href="/sign-up" 
            className="text-dark-900 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded transition-all duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
