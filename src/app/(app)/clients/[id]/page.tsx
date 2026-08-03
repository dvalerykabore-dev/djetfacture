'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_CLIENTS, MOCK_RECENT_INVOICES } from '@/lib/mock-data';
import { formatFCFA, formatDateFR } from '@/lib/format';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  ArrowLeft,
  Building2,
  Users,
  Phone,
  Mail,
  MapPin,
  FileText,
  Plus,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function DetailClientPage({ params }: { params: { id: string } }) {
  const client = MOCK_CLIENTS.find((c) => c.id === params.id) || MOCK_CLIENTS[0]!;
  const clientInvoices = MOCK_RECENT_INVOICES.filter((inv) => inv.clientName === client.name);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/clients"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-ink tracking-tight">{client.name}</h2>
            <p className="text-xs text-muted mt-0.5">Fiche Client • {client.city}, {client.country}</p>
          </div>
        </div>

        <Link
          href="/factures/nouvelle"
          className="py-2.5 px-4 bg-brand-900 hover:bg-brand-700 text-white font-bold text-xs rounded-input shadow-card transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Facturer ce client</span>
        </Link>
      </div>

      {/* Client Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="md:col-span-2 bg-surface rounded-card p-6 border border-slate-200/80 shadow-card space-y-4">
          <h3 className="text-base font-bold text-ink border-b border-slate-100 pb-3">Coordonnées & Fiscalité</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold mb-0.5">Contact Principal</span>
              <span className="font-bold text-ink">{client.contactName}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold mb-0.5">Téléphone (WhatsApp)</span>
              <span className="font-bold text-ink">{client.phone}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold mb-0.5">Email</span>
              <span className="font-bold text-ink">{client.email}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold mb-0.5">N° RCCM (OHADA)</span>
              <span className="font-bold text-ink">{client.rccm || 'Non renseigné'}</span>
            </div>
          </div>
        </div>

        {/* Financial KPI Card */}
        <div className="bg-brand-900 text-white rounded-card p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-brand-300 tracking-wider">Cumul Financier Client</span>
            <h3 className="text-2xl font-black text-white tabular-nums mt-1">{formatFCFA(client.totalInvoiced)}</h3>
            <p className="text-xs text-brand-200 mt-1">Chiffre d'affaires facturé depuis le début</p>
          </div>

          <div className="pt-3 border-t border-brand-800 flex justify-between items-center text-xs">
            <span className="text-brand-300">Solde restant dû :</span>
            <span className="font-bold text-emerald-400 tabular-nums">{formatFCFA(client.activeOutstanding)}</span>
          </div>
        </div>
      </div>

      {/* Invoices History Container */}
      <div className="bg-surface rounded-card border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-ink">Historique des Factures</h3>
          <p className="text-xs text-muted">Liste de toutes les factures émises pour {client.name}</p>
        </div>

        {/* Mobile Cards Layout (< md) */}
        <div className="block md:hidden p-3 space-y-3">
          {clientInvoices.length > 0 ? (
            clientInvoices.map((inv) => {
              const isOverdue = inv.status === 'overdue';
              const isPaid = inv.status === 'paid';

              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <Link href={`/factures/${inv.id}`} className="font-extrabold text-sm text-brand-900 hover:underline">
                      {inv.number || 'Brouillon'}
                    </Link>
                    <StatusPill status={inv.status} />
                  </div>

                  {/* Prominent Échéance Banner */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-bold ${
                    isOverdue
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : isPaid
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isOverdue ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                      )}
                      <span>Échéance : {formatDateFR(inv.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 font-medium">Émise le {formatDateFR(inv.issueDate)}</span>
                    <span className="text-base font-black text-brand-900 tabular-nums">{formatFCFA(inv.total)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-muted text-xs">
              Aucune facture historique enregistrée.
            </div>
          )}
        </div>

        {/* Desktop Table View (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-muted uppercase border-b border-slate-100">
                <th className="py-3 px-5">N° Facture</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Échéance</th>
                <th className="py-3 px-5 text-right">Montant TTC</th>
                <th className="py-3 px-5 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientInvoices.length > 0 ? (
                clientInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-5 font-bold text-brand-900">
                      <Link href={`/factures/${inv.id}`} className="hover:underline">
                        {inv.number || 'Brouillon'}
                      </Link>
                    </td>
                    <td className="py-3.5 px-5 text-muted">{formatDateFR(inv.issueDate)}</td>
                    <td className="py-3.5 px-5 font-semibold">
                      {inv.status === 'overdue' ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          {formatDateFR(inv.dueDate)}
                        </span>
                      ) : (
                        <span className="text-muted font-medium">{formatDateFR(inv.dueDate)}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right font-black tabular-nums">{formatFCFA(inv.total)}</td>
                    <td className="py-3.5 px-5 text-center">
                      <StatusPill status={inv.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    Aucune facture historique enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
