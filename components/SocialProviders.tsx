'use client';

import React from 'react';
import { Chrome, Apple } from 'lucide-react';
import { SocialProvidersProps, AUTH_CONSTANTS } from '../src/types/auth';

const SocialProviders = ({ type, isLoading }: SocialProvidersProps) => {
  const handleGoogleAuth = () => {
    return;
  };

  const handleAppleAuth = () => {
    return;
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className={`w-full flex items-center justify-center px-4 py-3 border border-light-300 rounded-lg bg-light-100 text-body font-medium hover:bg-light-200 focus:outline-none focus:ring-${AUTH_CONSTANTS.FOCUS_RING_WIDTH} focus:ring-dark-900 focus:ring-offset-${AUTH_CONSTANTS.FOCUS_RING_OFFSET} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-${AUTH_CONSTANTS.ANIMATION_DURATION} group`}
        aria-label={`Continue with Google ${type}`}
      >
        <Chrome className="w-5 h-5 mr-3 text-gray-700 group-hover:text-dark-900 transition-colors" />
        <span className="group-hover:text-dark-900 transition-colors">
          Continue with Google
        </span>
      </button>

      <button
        onClick={handleAppleAuth}
        disabled={isLoading}
        className={`w-full flex items-center justify-center px-4 py-3 border border-light-300 rounded-lg bg-light-100 text-body font-medium hover:bg-light-200 focus:outline-none focus:ring-${AUTH_CONSTANTS.FOCUS_RING_WIDTH} focus:ring-dark-900 focus:ring-offset-${AUTH_CONSTANTS.FOCUS_RING_OFFSET} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-${AUTH_CONSTANTS.ANIMATION_DURATION} group`}
        aria-label={`Continue with Apple ${type}`}
      >
        <Apple className="w-5 h-5 mr-3 text-gray-700 group-hover:text-dark-900 transition-colors" />
        <span className="group-hover:text-dark-900 transition-colors">
          Continue with Apple
        </span>
      </button>
    </div>
  );
};

export default SocialProviders;
