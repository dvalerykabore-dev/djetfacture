'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Segment Error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 bg-surface p-8 rounded-card border border-rose-200 shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-xl font-black">
          !
        </div>
        <h2 className="text-xl font-bold text-ink">Une erreur est survenue</h2>
        <p className="text-xs text-muted">
          Impossible de charger ces données comptables. Veuillez réessayer.
        </p>
        <button
          onClick={() => reset()}
          className="py-2.5 px-5 bg-brand-900 text-white font-bold text-xs rounded-input shadow-card hover:bg-brand-700 transition-all"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
