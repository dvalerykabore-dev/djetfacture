import React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function MotDePasseOubliePage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 font-sans text-ink">
      <div className="bg-surface rounded-card p-8 md:p-10 border border-slate-200 shadow-float max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-ink tracking-tight">Mot de passe oublié</h1>
          <p className="text-xs text-muted">Saisissez votre adresse email pour recevoir un lien de réinitialisation sécurisé.</p>
        </div>

        <form className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email professionnel</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="nom@entreprise.sn"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-brand-900 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-card transition-all"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs">
          <Link href="/connexion" className="font-bold text-brand-900 hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à la connexion</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
