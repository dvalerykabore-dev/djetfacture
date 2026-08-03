import React from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 font-sans text-ink">
      <div className="bg-surface rounded-card p-8 md:p-10 border border-slate-200 shadow-float max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            D
          </div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Créer un compte DJETFACTURE</h1>
          <p className="text-xs text-muted">Facturation professionnelle conforme OHADA pour entrepreneurs africains</p>
        </div>

        <form className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nom complet</label>
            <div className="relative">
              <User className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Valéry Kaboré"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email professionnel</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="contact@entreprise.sn"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mot de passe (8+ caractères)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <Link
            href="/bienvenue"
            className="w-full py-3.5 px-4 bg-brand-900 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-card transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>Créer mon compte</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-muted">
          Déjà inscrit ?{' '}
          <Link href="/connexion" className="font-bold text-brand-900 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
