import React from 'react';
import Link from 'next/link';
import { RecentInvoicesTable } from '@/components/dashboard/RecentInvoicesTable';
import { Plus } from 'lucide-react';

export default function FacturesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink tracking-tight">Gestion des Factures</h2>
          <p className="text-xs text-muted mt-0.5">Créez, envoyez et suivez l'état de vos documents de facturation.</p>
        </div>

        <Link
          href="/factures/nouvelle"
          className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-input bg-brand-900 hover:bg-brand-700 text-white font-bold text-xs shadow-card transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nouvelle Facture</span>
        </Link>
      </div>

      <RecentInvoicesTable />
    </div>
  );
}
