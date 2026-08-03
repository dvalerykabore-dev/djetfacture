'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Building2, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !companyName) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || companyName,
            company_name: companyName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#0B3B36] text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg">
          D
        </div>
        <h2 className="text-3xl font-black text-[#0F1A18] tracking-tight">DJETFACTURE</h2>
        <p className="text-xs text-slate-600 font-medium">
          Création de Compte Entreprise OHADA
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/90 sm:px-10 space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#0F1A18]">Démarrer avec votre entreprise</h3>
            <p className="text-xs text-slate-500 mt-1">Créez votre espace vierge prêt pour votre première facture.</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nom de l'Entreprise / Raison Sociale *</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: Baobab Services SARL"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#0B3B36]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nom Complet du Gestionnaire</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Valéry Kaboré"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#0B3B36]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Adresse Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@votreentreprise.com"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#0B3B36]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mot de Passe *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#0B3B36]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0B3B36] hover:bg-[#0D4A42] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Création en cours...' : 'Créer mon compte entreprise'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs">
            <p className="text-slate-600 font-medium">
              Déjà un compte inscrit ?{' '}
              <Link href="/login" className="font-extrabold text-[#0B3B36] hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Environnement Sécurisé UEMOA • RLS Multi-tenant Activé</span>
        </div>
      </div>
    </div>
  );
}
