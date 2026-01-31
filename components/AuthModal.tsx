'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import AuthForm from './AuthForm';
import SocialProviders from './SocialProviders';
import Link from 'next/link';
import { useAuth } from '../src/hooks/useAuth';
import { SignUpInput, SignInInput } from '../lib/auth/schemas';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'signin' | 'signup';
}

const AuthModal = ({ isOpen, onClose, type }: AuthModalProps) => {
  const [formData, setFormData] = useState<SignUpInput | SignInInput>(
    type === 'signup' 
      ? { name: '', email: '', password: '', confirmPassword: '' }
      : { email: '', password: '' }
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const { signIn, signUp, isLoading, error, clearError } = useAuth();

  React.useEffect(() => {
    clearError();
    if (isOpen) {
      setFormData(
        type === 'signup' 
          ? { name: '', email: '', password: '', confirmPassword: '' }
          : { email: '', password: '' }
      );
      setTermsAccepted(false);
    }
  }, [isOpen, type, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'signup' && !termsAccepted) {
      return;
    }

    if (type === 'signup') {
      await signUp(formData as SignUpInput);
    } else {
      await signIn(formData as SignInInput);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    clearError();
  };

  const switchType = (newType: 'signin' | 'signup') => {
    setFormData(
      newType === 'signup' 
        ? { name: '', email: '', password: '', confirmPassword: '' }
        : { email: '', password: '' }
    );
    setTermsAccepted(false);
    clearError();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={type === 'signup' ? 'Create Account' : 'Sign In'}
      size="md"
    >
      <div className="w-full space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <AuthForm
          type={type}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {type === 'signup' && (
          <div className="flex items-start sm:items-center">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 mr-2 sm:mt-0 sm:mr-3 w-4 h-4 text-dark-900 border-gray-300 rounded focus:ring-dark-900 focus:ring-2"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              aria-describedby="terms-help"
            />
            <label 
              htmlFor="terms" 
              className="text-sm text-gray-600 leading-relaxed"
            >
              I agree to Nike's{' '}
              <Link 
                href="/terms" 
                className="text-dark-900 hover:underline focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded transition-all duration-200"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link 
                href="/privacy" 
                className="text-dark-900 hover:underline focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded transition-all duration-200"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-600">Or {type === 'signup' ? 'sign up' : 'sign in'} with</span>
          </div>
        </div>

        <SocialProviders type={type} isLoading={isLoading} />

        <div className="text-center text-sm text-gray-600">
          {type === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => switchType('signin')}
                className="text-dark-900 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded transition-all duration-200"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => switchType('signup')}
                className="text-dark-900 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded transition-all duration-200"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
