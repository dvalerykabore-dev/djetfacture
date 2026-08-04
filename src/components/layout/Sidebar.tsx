'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Plus,
  Building2,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen: controlledMobileOpen, onCloseMobile }: SidebarProps = {}) {
  const pathname = usePathname();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const isMobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen;

  const handleClose = () => {
    if (onCloseMobile) onCloseMobile();
    setInternalMobileOpen(false);
  };

  const navItems = [
    {
      name: 'Tableau de bord',
      href: '/tableau-de-bord',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Factures',
      href: '/factures',
      icon: FileText,
      badge: '6',
    },
    {
      name: 'Clients',
      href: '/clients',
      icon: Users,
      badge: '4',
    },
    {
      name: 'Paramètres',
      href: '/parametres',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button (Visible on screens < md) */}
      <button
        onClick={() => setInternalMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 p-2.5 rounded-xl bg-brand-900 text-white shadow-lg hover:bg-brand-800 transition-all no-print"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Dark Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`w-64 bg-[#0B3B36] text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-xl select-none no-print transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header & Mobile Close */}
        <div className="p-6 border-b border-[#0B3E38] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-[#3A8A79] flex items-center justify-center font-black text-[#05221F] text-xl shadow-lg">
              D
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-wide">DJETFACTURE</span>
                <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#87BEAF] font-medium mt-0.5">Facturation OHADA & FCFA</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="md:hidden text-[#87BEAF] hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-5 pb-2">
          <Link
            href="/factures/nouvelle"
            onClick={handleClose}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#05221F] font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Créer une facture</span>
          </Link>
        </div>

        {/* Harmonized Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-[#87BEAF] mb-2">Menu principal</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-[#0D4A42] text-white font-bold shadow-inner border-l-4 border-emerald-400'
                    : 'text-slate-100 hover:bg-[#0B3E38] hover:text-white border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-emerald-400' : 'text-[#87BEAF]'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-emerald-400 text-[#05221F]'
                        : 'bg-[#0B3E38] text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Org info footer */}
        <div className="p-4 border-t border-[#0B3E38] bg-[#05221F]/60 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0B3E38] text-emerald-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white truncate max-w-[150px]">Kaboré Prestations SARL</h4>
            <p className="text-[11px] text-[#87BEAF] font-medium font-mono">SN-DKR-2024-B-1234</p>
          </div>
        </div>
      </aside>
    </>
  );
}
