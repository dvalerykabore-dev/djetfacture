import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 bg-surface p-8 rounded-card border border-slate-200 shadow-card">
        <h2 className="text-4xl font-black text-brand-900">404</h2>
        <h3 className="text-xl font-bold text-ink">Page introuvable</h3>
        <p className="text-xs text-muted">
          La ressource ou le document demandé n'existe pas ou a été déplacé.
        </p>
        <Link
          href="/tableau-de-bord"
          className="inline-block py-2.5 px-5 bg-brand-900 text-white font-bold text-xs rounded-input shadow-card hover:bg-brand-700 transition-all"
        >
          Retour au Tableau de Bord
        </Link>
      </div>
    </div>
  );
}
