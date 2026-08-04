import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  MessageSquare,
  FileText,
  TrendingUp,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-slate-200 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-900 to-brand-700 text-white font-black text-xl flex items-center justify-center shadow-md">
            D
          </div>
          <span className="font-black text-xl text-brand-900 tracking-tight">DJETFACTURE</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-700">
          <a href="#fonctionnalites" className="hover:text-brand-900 transition-colors">Fonctionnalités</a>
          <a href="#ohada" className="hover:text-brand-900 transition-colors">Conformité OHADA</a>
          <a href="#tarifs" className="hover:text-brand-900 transition-colors">Tarifs FCFA</a>
          <a href="#faq" className="hover:text-brand-900 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="py-2.5 px-4 rounded-input text-brand-900 font-bold text-xs hover:bg-slate-100 transition-all"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="py-2.5 px-4 bg-brand-900 hover:bg-brand-700 text-white font-bold text-xs rounded-input shadow-card transition-all"
          >
            Démarrer gratuitement
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-900 text-xs font-bold border border-brand-200">
            <ShieldCheck className="w-4 h-4 text-brand-700" />
            <span>Facturation 100% Conforme OHADA & FCFA</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-ink tracking-tight leading-tight">
            Facturez vos clients en <span className="text-brand-900">FCFA</span> sans erreur d'arrondi ni trou de numérotation.
          </h1>

          <p className="text-sm lg:text-base text-muted font-medium leading-relaxed">
            La solution de facturation taillée sur-mesure pour les entrepreneurs et PME d'Afrique de l'Ouest et Centrale. Calcul automatique de la TVA (18%), numérotation séquentielle immuable, instructions Mobile Money (Wave, Orange Money) et relances WhatsApp directes.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href="/inscription"
              className="w-full sm:w-auto py-4 px-8 bg-brand-900 hover:bg-brand-700 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Créer mon compte gratuit</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tableau-de-bord"
              className="w-full sm:w-auto py-4 px-6 bg-surface border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-xl text-center transition-all"
            >
              Découvrir la démo UI
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs font-bold text-slate-600 border-t border-slate-200/80">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zéro carte bancaire requise</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configuration en 2 min</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 p-6 md:p-8 rounded-card shadow-float text-white space-y-6 relative">
          <div className="flex items-center justify-between border-b border-brand-800 pb-4">
            <div>
              <p className="text-xs text-brand-300 font-extrabold uppercase">Dernière facture émise</p>
              <h3 className="text-xl font-black text-white">FAC-2026-0089</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● Envoyée WhatsApp
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-200">Client :</span>
              <span className="font-bold text-white">SOGEA SATOM SA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-200">Prestation :</span>
              <span className="font-bold text-white">Audit financier & Cybersécurité</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-200">Modalités :</span>
              <span className="font-bold text-emerald-400">Wave / Orange Money</span>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-800 flex justify-between items-baseline">
            <span className="text-xs font-bold text-brand-200">NET À PAYER :</span>
            <span className="text-2xl font-black text-emerald-400 tabular-nums">1 250 000 FCFA</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-16 bg-surface border-y border-slate-200 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-ink tracking-tight">Pensé pour le commerce africain</h2>
            <p className="text-xs text-muted font-medium">Une rigueur financière absolue combinée aux habitudes de distribution locales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-card bg-canvas border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-ink">Arithmétique Entière & TVA</h3>
              <p className="text-xs text-muted leading-relaxed">
                Aucun flottant JavaScript. Tous les montants sont calculés en entiers au franc près. La TVA (18% ou 19.25%) est regroupée par taux pour zéro dérive.
              </p>
            </div>

            <div className="p-6 rounded-card bg-canvas border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-ink">Distribution WhatsApp & PDF</h3>
              <p className="text-xs text-muted leading-relaxed">
                Envoyez vos factures d'un clic via WhatsApp avec un message pré-rempli et un lien sécurisé permettant au client de consulter et télécharger le PDF.
              </p>
            </div>

            <div className="p-6 rounded-card bg-canvas border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-ink">Encaissement Mobile Money</h3>
              <p className="text-xs text-muted leading-relaxed">
                Vos numéros Wave, Orange Money et MTN MoMo s'impriment directement sur les factures avec les références de transaction requises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-ink tracking-tight">Tarification simple en FCFA</h2>
          <p className="text-xs text-muted font-medium">Pas de frais cachés. Choisissez la formule adaptée à votre volume.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
          {/* Gratuit */}
          <div className="bg-surface rounded-card p-8 border border-slate-200 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-ink">Starter</h3>
              <p className="text-xs text-muted">Idéal pour les indépendants qui démarrent.</p>
              <div className="text-3xl font-black text-ink">0 FCFA <span className="text-xs font-normal text-muted">/ mois</span></div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Jusqu'à 5 factures / mois</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Export PDF conforme OHADA</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Envoi WhatsApp & Email</li>
              </ul>
            </div>

            <Link href="/inscription" className="w-full py-3 bg-slate-100 text-ink font-bold text-xs rounded-xl text-center block">
              Démarrer gratuitement
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-brand-900 text-white rounded-card p-8 shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/30">Recommandé</span>
              <h3 className="text-xl font-extrabold text-white">Pro Entreprise</h3>
              <p className="text-xs text-brand-200">Pour les PME exigeantes et les cabinets.</p>
              <div className="text-3xl font-black text-emerald-400">9 900 FCFA <span className="text-xs font-normal text-brand-300">/ mois</span></div>

              <ul className="space-y-2.5 text-xs text-brand-100 pt-4 border-t border-brand-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Factures illimitées</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Relances automatiques d'impayés</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gestion multi-clients & rapports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Support prioritaire WhatsApp</li>
              </ul>
            </div>

            <Link href="/inscription" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-brand-950 font-black text-xs rounded-xl text-center block shadow-md">
              Essayer le Plan Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-white py-12 px-6 lg:px-12 border-t border-brand-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-brand-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-brand-950 font-extrabold flex items-center justify-center text-sm">
              D
            </div>
            <span className="font-bold text-white text-sm">DJETFACTURE</span>
          </div>

          <div className="flex gap-6 font-medium">
            <Link href="/cgu" className="hover:text-white">CGU</Link>
            <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
            <a href="https://wa.me/221770000000" target="_blank" className="hover:text-white">Support WhatsApp</a>
          </div>

          <span>© 2026 DJETFACTURE — Conforme OHADA & FCFA</span>
        </div>
      </footer>
    </div>
  );
}
