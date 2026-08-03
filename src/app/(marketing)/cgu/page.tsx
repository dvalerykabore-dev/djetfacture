import React from 'react';
import Link from 'next/link';

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-canvas py-12 px-6 font-sans text-ink">
      <div className="max-w-3xl mx-auto bg-surface p-8 md:p-12 rounded-card border border-slate-200 shadow-card space-y-6">
        <Link href="/" className="text-xs font-bold text-brand-900 hover:underline">← Retour à l'accueil</Link>
        <h1 className="text-3xl font-black text-ink">Conditions Générales d'Utilisation (CGU)</h1>
        <p className="text-xs text-muted">Dernière mise à jour : 25 juillet 2026</p>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-sm font-bold text-ink">1. Objet du Service</h2>
          <p>DJETFACTURE fournit une plateforme SaaS de facturation et de suivi financier conforme aux exigences réglementaires OHADA et adaptée aux monnaies FCFA (XOF/XAF).</p>

          <h2 className="text-sm font-bold text-ink">2. Conformité des Factures</h2>
          <p>L'utilisateur est responsable de la véracité des informations fiscales (RCCM, NINEA, IFU) renseignées. DJETFACTURE garantit la numérotation séquentielle immuable des documents finalisés.</p>

          <h2 className="text-sm font-bold text-ink">3. Données et Sécurité</h2>
          <p>Chaque organisation bénéficie d'une isolation stricte au niveau de la base de données (Row Level Security).</p>
        </div>
      </div>
    </div>
  );
}
