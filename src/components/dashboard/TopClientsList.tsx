'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_CLIENTS } from '@/lib/mock-data';
import { formatFCFA } from '@/lib/format';
import { Users, ChevronRight, MapPin } from 'lucide-react';

export function TopClientsList() {
  return (
    <div className="bg-surface rounded-card p-5 border border-slate-200/80 shadow-card">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-ink">Top Clients</h3>
          <p className="text-xs text-muted">Par chiffre d'affaires cumulé</p>
        </div>
        <div className="p-2 rounded-lg bg-brand-50 text-brand-900">
          <Users className="w-4 h-4" />
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {MOCK_CLIENTS.slice(0, 4).map((client) => (
          <div key={client.id} className="py-3 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl ${client.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
              >
                {client.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-ink truncate group-hover:text-brand-900 transition-colors">
                  {client.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-muted font-medium mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{client.city}, {client.country}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs font-extrabold text-ink tabular-nums">
                {formatFCFA(client.totalInvoiced)}
              </p>

              {client.activeOutstanding > 0 ? (
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60 inline-block mt-0.5">
                  {formatFCFA(client.activeOutstanding)} dû
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 inline-block mt-0.5">
                  À jour
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <Link
          href="/clients"
          className="text-xs font-bold text-brand-900 hover:text-brand-700 inline-flex items-center gap-1 hover:underline"
        >
          <span>Voir le carnet de clients</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
