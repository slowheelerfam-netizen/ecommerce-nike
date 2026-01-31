'use client';

import React from 'react';
import { AuthFormProps } from '../src/types/auth';

const AuthForm = ({ type, formData, onChange, onSubmit, isLoading }: AuthFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {type === 'signup' && (
        <div className="space-y-2">
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name || ''}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            placeholder="Enter your name"
            autoComplete="name"
            required
            aria-describedby="name-error"
          />
        </div>
      )}

      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
          placeholder="Enter your email"
          autoComplete="email"
          required
          aria-describedby="email-error"
        />
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-900"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
          placeholder={type === 'signin' ? 'Enter your password' : 'Create a password'}
          autoComplete={type === 'signin' ? 'current-password' : 'new-password'}
          required
          aria-describedby="password-error"
        />
      </div>

      {type === 'signup' && (
        <div className="space-y-2">
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-gray-900"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
            aria-describedby="confirm-password-error"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (type === 'signin' ? 'Securing Connection...' : 'Creating account...') : (type === 'signin' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  );
};

export default AuthForm;
