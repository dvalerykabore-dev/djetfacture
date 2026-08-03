'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Globe,
} from 'lucide-react';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  onOpenMobileNav?: () => void;
}

export function Topbar({
  title = 'Tableau de bord',
  subtitle = 'Suivi du chiffre d\'affaires, des encaissements et factures en retard',
  onOpenMobileNav,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-2 sm:gap-4 min-w-0 w-full overflow-hidden">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg md:text-2xl font-black text-ink tracking-tight truncate leading-tight">
              {title}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-900 border border-brand-200/60 shrink-0">
              <Globe className="w-3 h-3 text-brand-700" />
              <span>XOF (18% TVA)</span>
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-muted font-medium hidden md:block truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Search, Notifications, CTA & User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Global Search Input */}
        <div className="hidden lg:flex items-center relative w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher facture, client..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-brand-400 rounded-input outline-none transition-all placeholder:text-muted/70"
          />
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 transition-colors shrink-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Action Button: Nouvelle Facture */}
        <Link
          href="/factures/nouvelle"
          className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-input bg-brand-900 hover:bg-brand-700 text-white font-bold text-xs shadow-card hover:shadow-soft transition-all duration-150 active:scale-[0.98] shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nouvelle facture</span>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-brand-900 to-brand-700 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-brand-100 shrink-0">
            VK
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-ink leading-none">Valéry Kaboré</p>
            <p className="text-[10px] text-muted font-medium mt-1">Fondateur / Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
