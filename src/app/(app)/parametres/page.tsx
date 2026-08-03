'use client';

import React, { useState } from 'react';
import {
  Building2,
  Smartphone,
  Stamp,
  ShieldCheck,
  Save,
  CheckCircle2,
  HelpCircle,
  ImageIcon,
  Upload,
  Trash2,
  Database,
  RefreshCw,
  Server,
  AlertTriangle,
} from 'lucide-react';
import { checkSupabaseConnection, SupabaseConnectionStatus } from '@/lib/supabase/check-connection';
import { getOrganizationSettings, saveOrganizationSettings } from '@/lib/supabase/service';

export default function ParametresPage() {
  const [companyName, setCompanyName] = useState('');
  const [rccm, setRccm] = useState('');
  const [ifu, setIfu] = useState('');
  const [taxRegime, setTaxRegime] = useState('Régime Réel Simplifié');

  // Supabase Connection Test State
  const [dbStatus, setDbStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [testingDb, setTestingDb] = useState(false);

  // Charger les paramètres réels depuis Supabase
  React.useEffect(() => {
    async function loadOrg() {
      const org = await getOrganizationSettings();
      if (org) {
        if (org.name) setCompanyName(org.name);
        if (org.rccm) setRccm(org.rccm);
        if (org.ifu) setIfu(org.ifu);
        if (org.tax_regime) setTaxRegime(org.tax_regime);
        if (org.phone) setWaveNumber(org.phone);
      }
    }
    loadOrg();
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setTestingDb(true);
    try {
      const res = await checkSupabaseConnection();
      setDbStatus(res);
    } catch {
      setDbStatus({
        isConfigured: false,
        isConnected: false,
        url: '',
        hasAnonKey: false,
        message: 'Erreur lors de l\'exécution du test de connexion.',
      });
    } finally {
      setTestingDb(false);
    }
  };

  // Logo Company Option State
  const [enableLogo, setEnableLogo] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Mobile Money Payment Channels State
  const [waveNumber, setWaveNumber] = useState('');
  const [orangeMoneyNumber, setOrangeMoneyNumber] = useState('');
  const [mtnNumber, setMtnNumber] = useState('');
  const [bankRIB, setBankRIB] = useState('');
  const [printPaymentInstructions, setPrintPaymentInstructions] = useState(true);

  // Watermark Settings State
  const [enableWatermark, setEnableWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkOpacity, setWatermarkOpacity] = useState('0.06');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin User Management State
  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Valéry Kaboré', email: 'admin@entreprise.sn', role: 'admin', roleLabel: '👑 Administrateur (Créateur)' }
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    setUsersList(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        roleLabel: newUserRole === 'admin' ? '👑 Co-Administrateur' : '👤 Utilisateur Standard (Actions restreintes)'
      }
    ]);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveOrganizationSettings({
      name: companyName || 'Mon Entreprise',
      rccm,
      ifu,
      tax_regime: taxRegime,
      phone: waveNumber,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink tracking-tight">Paramètres de l'Entreprise</h2>
          <p className="text-xs text-muted mt-0.5">
            Identifiants fiscaux OHADA, logo sur facture, comptes Mobile Money et filigrane.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="py-2.5 px-5 bg-brand-900 hover:bg-brand-700 text-white font-bold text-xs rounded-input shadow-card transition-all flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Enregistré ! ✓' : 'Enregistrer les paramètres'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* CARD 1: Legal & Fiscal Identity */}
        <div className="bg-surface rounded-card p-6 md:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-900">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-ink">1. Identité Légale & Fiscalité OHADA</h3>
              <p className="text-xs text-muted">Ces mentions sont obligatoires pour la valeur légale de vos factures.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Raison sociale / Nom commercial *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">N° RCCM (OHADA) *</label>
              <input
                type="text"
                required
                value={rccm}
                onChange={(e) => setRccm(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">N° NINEA / IFU / NCC</label>
              <input
                type="text"
                value={ifu}
                onChange={(e) => setIfu(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Régime Fiscal</label>
              <input
                type="text"
                value={taxRegime}
                onChange={(e) => setTaxRegime(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: Logo de l'Entreprise sur la Facture */}
        <div className="bg-surface rounded-card p-6 md:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-ink">2. Logo d'Entreprise sur la Facture</h3>
                <p className="text-xs text-muted">Affichez votre logo officiel dans l'en-tête de chaque document émis.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableLogo}
                onChange={(e) => setEnableLogo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-900"></div>
              <span className="ml-2 text-xs font-bold text-slate-700 hidden sm:inline">Afficher le logo</span>
            </label>
          </div>

          {enableLogo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs items-center">
              <div className="md:col-span-2 space-y-3">
                <label className="block font-bold text-slate-700">Importer votre image de logo (PNG, JPG, SVG)</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-2xl p-5 bg-slate-50/70 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-7 h-7 text-brand-900 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-slate-800">Cliquez ou glissez votre logo d'entreprise ici</p>
                  <p className="text-[11px] text-muted">Format idéal : Fond transparent (PNG / SVG), max 2 Mo</p>
                </div>
              </div>

              {/* Logo Preview & Customization Box */}
              <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] uppercase font-bold text-muted block">Aperçu du Logo sur En-tête</span>
                <div className="flex items-center justify-center p-3 bg-white rounded-xl border border-slate-200 min-h-[75px] shadow-sm">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo d'Entreprise" className="max-h-12 object-contain" />
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-brand-900 text-white font-black text-xl flex items-center justify-center shadow-sm">
                        D
                      </div>
                      <div>
                        <p className="font-extrabold text-xs text-ink">{companyName}</p>
                        <p className="text-[10px] text-muted">Logo par défaut (Initiale)</p>
                      </div>
                    </div>
                  )}
                </div>

                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl(null)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center justify-center gap-1 w-full pt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Réinitialiser le logo</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CARD 2: Mobile Money & Payment Instructions Case */}
        <div className="bg-surface rounded-card p-6 md:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-ink">2. Instructions de Règlement & Mobile Money</h3>
                <p className="text-xs text-muted">Comptes d'encaissement imprimés en bas de facture pour vos clients.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={printPaymentInstructions}
                onChange={(e) => setPrintPaymentInstructions(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700 hidden sm:inline">Imprimer sur les PDF</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">📱 Numéro Wave</label>
              <input
                type="text"
                value={waveNumber}
                onChange={(e) => setWaveNumber(e.target.value)}
                placeholder="+221 77 638 42 10"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">📱 Numéro Orange Money</label>
              <input
                type="text"
                value={orangeMoneyNumber}
                onChange={(e) => setOrangeMoneyNumber(e.target.value)}
                placeholder="+221 77 123 45 67"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">📱 Numéro MTN MoMo / Moov</label>
              <input
                type="text"
                value={mtnNumber}
                onChange={(e) => setMtnNumber(e.target.value)}
                placeholder="+225 07 48 92 11 05"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">🏦 RIB Bancaire (Virement)</label>
              <input
                type="text"
                value={bankRIB}
                onChange={(e) => setBankRIB(e.target.value)}
                placeholder="SN012 01001 012345678901 45"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: Watermark (Filigrane) Option */}
        <div className="bg-surface rounded-card p-6 md:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Stamp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-ink">3. Filigrane d'Entreprise sur les Factures (Watermark)</h3>
                <p className="text-xs text-muted">Affiche le nom de votre entreprise en filigrane diagonal discret en fond de document.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableWatermark}
                onChange={(e) => setEnableWatermark(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-900"></div>
              <span className="ml-2 text-xs font-bold text-slate-700 hidden sm:inline">Activer le filigrane</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Texte du Filigrane</label>
              <input
                type="text"
                disabled={!enableWatermark}
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Ex: Kaboré Prestations SARL"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 disabled:opacity-50 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Opacité du Filigrane</label>
              <select
                disabled={!enableWatermark}
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-ink outline-none focus:bg-white focus:border-brand-500 disabled:opacity-50 transition-all"
              >
                <option value="0.04">Très discret (4%)</option>
                <option value="0.06">Discret recommandé (6%)</option>
                <option value="0.10">Moyen (10%)</option>
                <option value="0.15">Visible (15%)</option>
              </select>
            </div>
          </div>

          {/* Watermark Preview Box */}
          {enableWatermark && (
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center min-h-[100px]">
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transform -rotate-12 uppercase font-black text-brand-900 tracking-widest text-xl sm:text-2xl"
                style={{ opacity: Number(watermarkOpacity) }}
              >
                {watermarkText || 'Kaboré Prestations SARL'}
              </div>
              <span className="text-[11px] font-bold text-slate-500 relative z-10 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                Aperçu du filigrane sur le document PDF
              </span>
            </div>
          )}
        </div>

        {/* CARD 5: Admin User Management & Creation of Standard Users */}
        <div className="bg-surface rounded-card p-6 md:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-ink">5. Création & Gestion des Utilisateurs Simples</h3>
                <p class="text-xs text-muted">Créez des accès pour vos collaborateurs et définissez leurs permissions restreintes.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              👑 Réservé à l'Administrateur
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h4 className="font-extrabold text-ink">➕ Créer un nouvel accès utilisateur simple</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  placeholder="Ex: Moussa Diop"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-input font-bold text-slate-900 outline-none focus:border-brand-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Adresse Email *</label>
                <input
                  type="email"
                  placeholder="moussa@entreprise.sn"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-input font-bold text-slate-900 outline-none focus:border-brand-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rôle attribué *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-input font-bold text-slate-900 outline-none focus:border-brand-900"
                >
                  <option value="user">👤 Utilisateur Standard (Restreint)</option>
                  <option value="admin">👑 Co-Administrateur (Complet)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddUser}
                className="py-2 px-4 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-input transition-all shadow-sm"
              >
                + Créer l'accès utilisateur
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-slate-800">👥 Utilisateurs actifs de votre entreprise</h4>
            <div className="space-y-2">
              {usersList.map((u) => (
                <div key={u.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${u.role === 'admin' ? 'bg-emerald-100 text-brand-900' : 'bg-amber-100 text-amber-800'} flex items-center justify-center font-bold`}>
                      {u.role === 'admin' ? '👑' : '👤'}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{u.name}</p>
                      <p className="text-slate-500 text-[11px] font-medium">{u.email} • <span className="font-bold text-brand-900">{u.roleLabel}</span></p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">Actif</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
