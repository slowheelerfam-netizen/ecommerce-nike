'use client';

import React, { useState, useEffect } from 'react';
import AuthForm from '../../../components/AuthForm';
import SocialProviders from '../../../components/SocialProviders';
import Link from 'next/link';
import { useAuth } from '../../../src/hooks/useAuth';
import { SignUpInput } from '../../../lib/auth/schemas';

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpInput>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const { signUp, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      return;
    }

    await signUp(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    clearError();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Join Nike and unlock your potential</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <AuthForm
        type="signup"
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {/* Terms */}
      <div className="flex items-start sm:items-center mt-6">
        <input
          id="terms"
          type="checkbox"
          className="mt-1 mr-2 sm:mt-0 sm:mr-3 w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
          required
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          aria-describedby="terms-help"
        />
        <label 
          htmlFor="terms" 
          className="text-sm text-gray-600 sm:text-base leading-relaxed"
        >
          I agree to Nike's{' '}
          <Link 
            href="/terms" 
            className="text-black hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded transition-all duration-200"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link 
            href="/privacy" 
            className="text-black hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded transition-all duration-200"
          >
            Privacy Policy
          </Link>
        </label>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-600">Or sign up with</span>
        </div>
      </div>

      {/* Social Sign Up */}
      <SocialProviders type="signup" isLoading={isLoading} />

      {/* Sign In Link */}
      <div className="text-center mt-6 text-sm text-gray-600">
        <p className="sm:text-base">
          Already have an account?{' '}
          <Link 
            href="/sign-in" 
            className="text-black font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded transition-all duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
