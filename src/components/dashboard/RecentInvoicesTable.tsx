'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_RECENT_INVOICES, InvoiceMock, InvoiceStatus } from '@/lib/mock-data';
import { formatFCFA, formatDateFR } from '@/lib/format';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  FileText,
  Eye,
  Download,
  MessageSquare,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Clock,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

type FilterType = 'all' | 'overdue' | 'sent' | 'paid';
type SelectedInvType = InvoiceMock | null;

export function RecentInvoicesTable() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');

  // Payment Recording State
  const [selectedPaymentInv, setSelectedPaymentInv] = useState<SelectedInvType>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<string>('Wave');
  const [payRef, setPayRef] = useState<string>('');

  const filteredInvoices = MOCK_RECENT_INVOICES.filter((inv) => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  return (
    <div className="bg-surface rounded-card border border-slate-200/80 shadow-card overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-ink">Dernières Factures</h3>
          <p className="text-xs text-muted mt-0.5">Aperçu rapide des 6 plus récents documents émis</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-muted">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-ink shadow-card'
                : 'hover:text-ink'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'overdue'
                ? 'bg-white text-rose-700 shadow-card'
                : 'hover:text-ink'
            }`}
          >
            En retard
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'sent'
                ? 'bg-white text-amber-700 shadow-card'
                : 'hover:text-ink'
            }`}
          >
            Envoyées
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'paid'
                ? 'bg-white text-emerald-700 shadow-card'
                : 'hover:text-ink'
            }`}
          >
            Payées
          </button>
        </div>
      </div>

      {/* Mobile Cards View (< md) */}
      <div className="block md:hidden p-3 space-y-3">
        {filteredInvoices.map((inv) => {
          const isOverdue = inv.status === 'overdue';
          const isPaid = inv.status === 'paid';
          const whatsappMessage = `Bonjour, voici le rappel concernant votre facture ${
            inv.number || 'brouillon'
          } d'un montant de ${formatFCFA(inv.total)}. Merci !`;

          return (
            <div
              key={inv.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 transition-all hover:border-[#87BEAF]"
            >
              {/* Top Row: N° & Status */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <Link
                  href={`/factures/${inv.id}`}
                  className="font-extrabold text-sm text-[#0B3B36] hover:underline flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-[#3A8A79]" />
                  <span>{inv.number || 'Brouillon'}</span>
                </Link>
                <StatusPill status={inv.status} />
              </div>

              {/* Client Name */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full ${inv.clientAvatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                >
                  {inv.clientName.substring(0, 2).toUpperCase()}
                </div>
                <h4 className="text-xl font-black text-[#0F1A18] tracking-tight leading-tight">
                  {inv.clientName}
                </h4>
              </div>

              {/* Prominent Échéance (Due Date) Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs font-bold ${
                  isOverdue
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : isPaid
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isOverdue ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-bold block opacity-75">
                      Échéance de Règlement
                    </span>
                    <span className="font-extrabold text-xs">{formatDateFR(inv.dueDate)}</span>
                  </div>
                </div>
                {isOverdue && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-600 text-white shadow-sm">
                    En retard
                  </span>
                )}
              </div>

              {/* Amount & Issue Date */}
              <div className="flex items-end justify-between pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Émise le</span>
                  <span className="text-xs text-slate-600 font-medium">{formatDateFR(inv.issueDate)}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Montant TTC</span>
                  <span className="text-lg font-black text-[#0B3B36] tabular-nums">
                    {formatFCFA(inv.total)}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Link
                  href={`/factures/${inv.id}`}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Détails</span>
                </Link>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Relancer</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (hidden md:block) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-muted uppercase tracking-wider">
              <th className="py-3 px-5">Numéro</th>
              <th className="py-3 px-5">Client</th>
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Échéance</th>
              <th className="py-3 px-5 text-right">Montant TTC</th>
              <th className="py-3 px-5 text-center">Statut</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredInvoices.map((inv) => {
              const isOverdue = inv.status === 'overdue';
              const whatsappMessage = `Bonjour, voici le rappel concernant votre facture ${
                inv.number || 'brouillon'
              } d'un montant de ${formatFCFA(inv.total)}. Merci !`;

              return (
                <tr
                  key={inv.id}
                  onClick={() => router.push(`/factures/${inv.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  {/* Number */}
                  <td className="py-3.5 px-5 font-bold text-brand-900 whitespace-nowrap">
                    <Link
                      href={`/factures/${inv.id}`}
                      className="hover:underline flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <FileText className="w-4 h-4 text-brand-700 shrink-0" />
                      <span>{inv.number || 'Brouillon'}</span>
                    </Link>
                  </td>

                  {/* Client */}
                  <td className="py-3.5 px-5 font-semibold text-ink min-w-[160px]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full ${inv.clientAvatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}
                      >
                        {inv.clientName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[180px]">{inv.clientName}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-5 text-muted font-medium whitespace-nowrap">
                    {formatDateFR(inv.issueDate)}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-5 font-semibold whitespace-nowrap">
                    {isOverdue ? (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs whitespace-nowrap">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        {formatDateFR(inv.dueDate)}
                      </span>
                    ) : (
                      <span className="text-muted font-medium whitespace-nowrap">{formatDateFR(inv.dueDate)}</span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-5 text-right font-extrabold text-ink tabular-nums text-sm whitespace-nowrap">
                    {formatFCFA(inv.total)}
                  </td>

                  {/* Status Pill */}
                  <td className="py-3.5 px-5 text-center whitespace-nowrap">
                    <StatusPill status={inv.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                      {/* Pay / Collect */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPaymentInv(inv);
                        }}
                        className="py-1 px-2.5 bg-brand-900 text-white font-extrabold text-[11px] rounded-lg hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-1"
                        title="Enregistrer un encaissement"
                      >
                        💳 Encaisser
                      </button>

                      {/* View */}
                      <Link
                        href={`/factures/${inv.id}`}
                        className="p-1.5 text-slate-500 hover:text-brand-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                        title="Voir la facture"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* PDF */}
                      <button
                        className="p-1.5 text-slate-500 hover:text-brand-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                        title="Télécharger PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* WhatsApp distribution */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Envoyer par WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-muted font-medium">Affichage de {filteredInvoices.length} sur {MOCK_RECENT_INVOICES.length} factures</span>
        <Link
          href="/factures"
          className="font-bold text-brand-900 hover:text-brand-700 flex items-center gap-1 hover:underline"
        >
          <span>Voir toutes les factures</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Payment Recording Modal */}
      {selectedPaymentInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface rounded-card p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-ink">💳 Enregistrer un Encaissement</h3>
                <p className="text-slate-500 font-medium">{selectedPaymentInv.number} • Total: {formatFCFA(selectedPaymentInv.total)}</p>
              </div>
              <button onClick={() => setSelectedPaymentInv(null)} className="p-1 text-slate-400 hover:text-ink font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`✓ Encaissement de ${formatFCFA(payAmount || selectedPaymentInv.total)} via ${payMethod} validé avec succès !`);
                setSelectedPaymentInv(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Montant Encaissé (FCFA) *</label>
                <input
                  type="number"
                  required
                  defaultValue={selectedPaymentInv.total}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-bold text-ink text-sm outline-none focus:border-brand-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mode de Règlement *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-bold text-ink outline-none focus:border-brand-900"
                >
                  <option value="Wave">📱 Wave Mobile Money</option>
                  <option value="Orange Money">📱 Orange Money</option>
                  <option value="MTN MoMo">📱 MTN MoMo / Moov</option>
                  <option value="Virement Bancaire">🏦 Virement Bancaire (RIB)</option>
                  <option value="Espèces">💵 Espèces / Liquide</option>
                  <option value="Chèque">📜 Chèque Bancaire</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">N° de Transaction / Référence</label>
                <input
                  type="text"
                  placeholder="Ex: WAV-8921-X39"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentInv(null)}
                  className="py-2 px-4 rounded-input border border-slate-200 text-slate-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-input bg-brand-900 hover:bg-brand-700 text-white font-extrabold shadow-sm"
                >
                  ✓ Valider l'Encaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
