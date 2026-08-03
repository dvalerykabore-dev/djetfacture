'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, CheckCircle2, ExternalLink } from 'lucide-react';

export function PaymentMethodsBox() {
  const channels = [
    { name: 'Wave', number: '+221 77 638 42 10', active: true, color: 'bg-sky-500' },
    { name: 'Orange Money', number: '+221 77 123 45 67', active: true, color: 'bg-amber-500' },
    { name: 'MTN MoMo', number: '+225 07 48 92 11', active: true, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-surface rounded-card p-5 border border-slate-200/80 shadow-card">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">Instructions Mobile Money</h3>
            <p className="text-[11px] text-muted">Imprimées sur vos factures PDF</p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          v1 Actif
        </span>
      </div>

      <div className="space-y-2 mt-3">
        {channels.map((ch, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${ch.color}`} />
              <span className="font-semibold text-ink">{ch.name}</span>
            </div>
            <span className="font-bold text-slate-700 tabular-nums">{ch.number}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 text-right">
        <Link
          href="/parametres?tab=paiements"
          className="text-xs font-bold text-brand-900 hover:text-brand-700 inline-flex items-center gap-1 hover:underline"
        >
          <span>Modifier les numéros</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
