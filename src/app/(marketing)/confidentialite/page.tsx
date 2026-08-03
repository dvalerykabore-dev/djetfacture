import React from 'react';
import Link from 'next/link';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-canvas py-12 px-6 font-sans text-ink">
      <div className="max-w-3xl mx-auto bg-surface p-8 md:p-12 rounded-card border border-slate-200 shadow-card space-y-6">
        <Link href="/" className="text-xs font-bold text-brand-900 hover:underline">← Retour à l'accueil</Link>
        <h1 className="text-3xl font-black text-ink">Politique de Confidentialité</h1>
        <p className="text-xs text-muted">Dernière mise à jour : 25 juillet 2026</p>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-sm font-bold text-ink">1. Protection des Données Financières</h2>
          <p>Les données commerciales et financières saisies sur DJETFACTURE restent la propriété exclusive de votre entreprise. Aucun tiers n'a accès à vos données sans autorisation.</p>

          <h2 className="text-sm font-bold text-ink">2. Hébergement et Chiffrement</h2>
          <p>Les données sont chiffrées au repos et en transit via HTTPS/TLS 1.3 sur des serveurs sécurisés Supabase Postgres.</p>
        </div>
      </div>
    </div>
  );
}
