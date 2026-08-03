'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-canvas text-ink">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/80 px-4 md:px-8 py-4 bg-surface/50 text-xs text-muted text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 DJETFACTURE — Tous droits réservés. Conformité OHADA.</span>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Conditions générales</span>
            <span className="hover:underline cursor-pointer">Assistance</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
