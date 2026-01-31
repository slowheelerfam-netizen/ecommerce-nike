'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { AuthLayoutProps } from '../../src/types/auth';

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
        <div className="max-w-lg">
          <h1 className="text-6xl xl:text-7xl font-bold text-white mb-6">
            JUST DO IT
          </h1>
          <p className="text-xl xl:text-2xl text-white/90 leading-relaxed mb-8">
            Join millions of athletes pushing their limits and achieving greatness. 
            Get exclusive access to new releases, member-only products, and the best 
            of Nike's innovation.
          </p>
          <div className="flex items-center space-x-8">
            <div className="text-white">
              <div className="text-3xl font-bold">30M+</div>
              <div className="text-sm text-white/70">Global Members</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">150+</div>
              <div className="text-sm text-white/70">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Only visible on mobile/tablet */}
          <div className="lg:hidden text-center mb-8">
            <Link 
              href="/" 
              className="inline-block group"
              aria-label="Nike Home"
            >
              <Image 
                src="/logo.svg" 
                alt="Nike Logo" 
                width={64}
                height={64}
                className="w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
