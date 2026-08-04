'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/dashboard');
      } else {
        // Mode démonstration locale si aucune session distante
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la connexion');
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
          Facturation & Comptabilité Conforme OHADA (Zone UEMOA)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/90 sm:px-10 space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#0F1A18]">Connexion à votre espace</h3>
            <p className="text-xs text-slate-500 mt-1">Saisissez vos identifiants pour accéder à vos documents.</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Adresse Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@votreentreprise.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#0B3B36]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0B3B36] rounded" />
                <span>Se souvenir de moi</span>
              </label>
              <a href="#" className="text-xs font-bold text-[#0B3B36] hover:underline">Mot de passe oublié ?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0B3B36] hover:bg-[#0D4A42] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs">
            <p className="text-slate-600 font-medium">
              Pas encore de compte entreprise ?{' '}
              <Link href="/register" className="font-extrabold text-[#0B3B36] hover:underline">
                Créer un compte gratuitement
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 font-medium space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Connexion Sécurisée Supabase Auth (Chiffrement SSL 256-bit)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
