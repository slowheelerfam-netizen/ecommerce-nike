'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieConsentProps {
  className?: string;
}

const CookieConsent = ({ className = '' }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    try {
      const hasConsent = localStorage.getItem('cookie-consent');
      if (!hasConsent) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      // silent
    }
  }, []);

  const savePreferences = (preferences: CookiePreferences) => {
    try {
      localStorage.setItem('cookie-consent', 'custom');
      localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    } catch (error) {
      // silent
    }
  };

  const acceptAll = () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    
    try {
      localStorage.setItem('cookie-consent', 'all');
      localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    } catch (error) {
      // silent
    }
    
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    
    try {
      localStorage.setItem('cookie-consent', 'necessary');
      localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    } catch (error) {
      // silent
    }
    
    setIsVisible(false);
  };

  const minimize = () => {
    setIsMinimized(true);
  };

  const restore = () => {
    setIsMinimized(false);
  };

  const close = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-dark-900 text-light-100 shadow-lg ${className}`}>
      {!isMinimized ? (
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1 max-w-3xl">
              <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
              <p className="text-sm text-dark-300 leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                By clicking "Accept All", you consent to our use of all cookies. 
                You can manage your preferences in our{' '}
                <a 
                  href="/cookies" 
                  className="text-light-100 underline hover:text-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-light-100 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
                >
                  Cookie Settings
                </a>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
              <button
                onClick={acceptNecessary}
                className="px-4 py-2 text-sm font-medium border border-light-600 rounded-lg hover:bg-light-800 transition-colors focus:outline-none focus:ring-2 focus:ring-light-100 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
              >
                Accept Necessary
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm font-medium bg-light-100 text-dark-900 rounded-lg hover:bg-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              >
                Accept All
              </button>
            </div>
          </div>
          
          <button
            onClick={minimize}
            className="absolute top-4 right-4 p-1 text-dark-400 hover:text-light-100 transition-colors"
            aria-label="Minimize cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-dark-300">
              We use cookies to enhance your experience.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={restore}
                className="text-sm text-light-100 underline hover:text-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-light-100 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
              >
                Manage Preferences
              </button>
              <button
                onClick={acceptAll}
                className="text-sm font-medium bg-light-100 text-dark-900 px-3 py-1 rounded hover:bg-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              >
                Accept All
              </button>
              <button
                onClick={close}
                className="p-1 text-dark-400 hover:text-light-100 transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
