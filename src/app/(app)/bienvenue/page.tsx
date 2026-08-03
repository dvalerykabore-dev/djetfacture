import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BienvenuePage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 font-sans text-ink">
      <div className="bg-surface rounded-card p-8 md:p-12 border border-slate-200 shadow-float max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-lg">
            D
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Première étape obligée • Configuration Entreprise
          </span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Bienvenue sur DJETFACTURE ! 🎉</h1>
          <p className="text-xs text-muted max-w-md mx-auto">
            Pour garantir la conformité légale et fiscale (OHADA) de vos futurs documents, configurez l'identité de votre entreprise.
          </p>
        </div>

        <form className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Raison sociale / Nom commercial *</label>
              <input
                type="text"
                required
                defaultValue="Kaboré Prestations SARL"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">N° RCCM (OHADA) *</label>
              <input
                type="text"
                required
                defaultValue="SN-DKR-2024-B-1234"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">N° NINEA / IFU / NCC</label>
              <input
                type="text"
                defaultValue="009823412"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Devise principale</label>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-bold text-ink">
                <option value="XOF">XOF - Franc CFA UEMOA (Sénégal, Côte d'Ivoire, etc.)</option>
                <option value="XAF">XAF - Franc CFA CEMAC (Cameroun, Gabon, etc.)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Taux TVA par défaut</label>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-bold text-ink">
                <option value="18">18 % (Standard UEMOA)</option>
                <option value="19.25">19.25 % (Cameroun)</option>
                <option value="0">0 % (Non applicable)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Numéro Wave (Paiements)</label>
              <input
                type="text"
                defaultValue="+221 77 638 42 10"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Numéro Orange Money</label>
              <input
                type="text"
                defaultValue="+221 77 123 45 67"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <Link
            href="/tableau-de-bord"
            className="w-full py-4 px-6 bg-brand-900 hover:bg-brand-700 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Créer mon entreprise et accéder au Tableau de Bord</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </form>
      </div>
    </div>
  );
}
