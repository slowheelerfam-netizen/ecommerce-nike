'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer, PageLayout } from '../../components';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookiesPage = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cookie-preferences');
      if (saved) {
        const parsedPreferences = JSON.parse(saved);
        setPreferences(parsedPreferences);
      }
    } catch (error) {
      // silent
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
      localStorage.setItem('cookie-consent', 'custom');
    } catch (error) {
      // silent
    }
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    
    try {
      localStorage.setItem('cookie-preferences', JSON.stringify(allAccepted));
      localStorage.setItem('cookie-consent', 'all');
    } catch (error) {
      // silent
    }
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(necessaryOnly);
    
    try {
      localStorage.setItem('cookie-preferences', JSON.stringify(necessaryOnly));
      localStorage.setItem('cookie-consent', 'necessary');
    } catch (error) {
      // silent
    }
  };

  const handleToggle = (category: keyof CookiePreferences) => {
    if (category === 'necessary') return;
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <PageLayout
      title="Cookie Settings"
      description="Manage your cookie preferences. You can change these settings at any time."
    >
      <div className="max-w-4xl mx-auto">

          <div className="bg-light-100 rounded-2xl shadow-lg p-6 sm:p-8 border border-light-200 mb-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-light-300">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Necessary Cookies</h3>
                  <p className="text-sm text-dark-600">
                    Essential for the website to function properly. Cannot be disabled.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-5 h-5 text-dark-900 rounded focus:ring-dark-900 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-light-300">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-dark-600">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handleToggle('analytics')}
                    className="w-5 h-5 text-dark-900 rounded focus:ring-dark-900 focus:ring-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-light-300">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Marketing Cookies</h3>
                  <p className="text-sm text-dark-600">
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => handleToggle('marketing')}
                    className="w-5 h-5 text-dark-900 rounded focus:ring-dark-900 focus:ring-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Functional Cookies</h3>
                  <p className="text-sm text-dark-600">
                    Enable enhanced functionality and personalization, such as videos and live chats.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={() => handleToggle('functional')}
                    className="w-5 h-5 text-dark-900 rounded focus:ring-dark-900 focus:ring-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={acceptNecessary}
              className="px-6 py-3 border border-dark-300 rounded-lg font-medium hover:bg-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 focus:ring-offset-transparent rounded"
            >
              Accept Necessary Only
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-3 bg-dark-900 text-light-100 rounded-lg font-medium hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-light-100 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
            >
              Accept All
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-light-100 border border-dark-900 text-dark-900 rounded-lg font-medium hover:bg-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 focus:ring-offset-transparent rounded"
            >
              Save My Preferences
            </button>
          </div>

        <div className="text-center mt-8">
          <Link 
            href="/"
            className="text-dark-600 hover:text-dark-900 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 focus:ring-offset-transparent rounded"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default CookiesPage;
