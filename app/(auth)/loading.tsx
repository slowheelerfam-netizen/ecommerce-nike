'use client';

import { Suspense } from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-900"></div>
    </div>
  );
}
