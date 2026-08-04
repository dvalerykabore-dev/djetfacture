'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_INVOICES, InvoiceMock } from '@/lib/mock-data';
import { formatFCFA } from '@/lib/format';
import {
  Search,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCode,
  Download,
  Eye,
  Filter,
} from 'lucide-react';

export function InvoiceTable() {
  const [invoices, setInvoices] = useState<InvoiceMock[]>(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      (invoice.number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const categorySum = filteredInvoices.reduce((acc, inv) => acc + inv.total, 0);

  const getStatusBadge = (status: InvoiceMock['status'] | string) => {
    switch (status) {
      case 'paid':
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Payée
          </span>
        );
      case 'sent':
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Envoyée
          </span>
        );
      case 'overdue':
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            En retard
          </span>
        );
      case 'partial':
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            Partielle
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            Brouillon
          </span>
        );
    }
  };

  const statusCategories = [
    { key: 'all', label: 'Toutes', count: invoices.length },
    { key: 'sent', label: 'Envoyées', count: invoices.filter((i) => i.status === 'sent').length },
    { key: 'paid', label: 'Payées', count: invoices.filter((i) => i.status === 'paid').length },
    { key: 'overdue', label: 'En retard', count: invoices.filter((i) => i.status === 'overdue').length },
    { key: 'partial', label: 'Partielles', count: invoices.filter((i) => i.status === 'partial').length },
    { key: 'draft', label: 'Brouillon', count: invoices.filter((i) => i.status === 'draft').length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Main Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gestion des Factures</h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Consultez, filtrez par statut et recherchez par N° ou par nom de client.
          </p>
        </div>
        <Link
          href="/factures/nouvelle"
          className="py-2.5 px-4 bg-[#0B3B36] hover:bg-[#0D4A42] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nouvelle Facture</span>
        </Link>
      </div>

      {/* Main Table Card Container */}
      <div className="bg-white rounded-card border border-slate-200/90 shadow-card overflow-hidden">
        {/* Controls Bar: Search & Status Pills */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par N° ou client..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-input outline-none focus:bg-white focus:border-[#0B3B36] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {statusCategories.map((cat) => {
              const isActive = statusFilter === cat.key;

              return (
                <button
                  key={cat.key}
                  onClick={() => setStatusFilter(cat.key)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                    isActive
                      ? 'bg-[#0B3B36] text-white border border-[#0B3B36] shadow-md font-extrabold scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Realtime Category Cumulative Total Banner */}
        <div className="bg-[#EEF6F3] px-5 py-3.5 border-b border-[#B2D8CB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#0B3B36] font-bold">
            <Filter className="w-4 h-4 text-[#0B3B36]" />
            <span>Catégorie sélectionnée :</span>
            <span className="font-extrabold text-slate-900 underline">
              {statusCategories.find((c) => c.key === statusFilter)?.label || 'Toutes'}
            </span>
            <span className="text-slate-600 font-medium">({filteredInvoices.length} document(s))</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-700 font-medium">Cumul Total de la catégorie :</span>
            <span className="font-black text-[#0B3B36] text-base tabular-nums">
              {formatFCFA(categorySum)}
            </span>
          </div>
        </div>

        {/* Mobile Cards Layout (< md) */}
        <div className="block md:hidden p-3 space-y-3">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => {
              const isOverdue = invoice.status === 'OVERDUE';
              const isPaid = invoice.status === 'PAID';

              return (
                <div
                  key={invoice.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3 transition-all hover:border-[#87BEAF]"
                >
                  {/* Header Row: N° & Status Pill */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <Link
                      href={`/factures/${invoice.id}`}
                      className="font-extrabold text-sm text-[#0B3B36] hover:underline flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-[#3A8A79]" />
                      <span>{invoice.number || 'Brouillon'}</span>
                    </Link>
                    <div>{getStatusBadge(invoice.status)}</div>
                  </div>

                  {/* Client Name (20px font-black text-[#0F1A18] per AGENTS.md) */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Client</span>
                    <h4 className="text-xl font-black text-[#0F1A18] tracking-tight leading-tight mt-0.5">
                      {invoice.clientName}
                    </h4>
                  </div>

                  {/* Prominent Échéance (Due Date) Card Section */}
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
                        <span className="font-extrabold text-xs">{invoice.dueDate}</span>
                      </div>
                    </div>
                    {isOverdue && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-600 text-white shadow-sm">
                        En retard
                      </span>
                    )}
                  </div>

                  {/* Montant TTC & Issue Date */}
                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Émission</span>
                      <span className="text-xs text-slate-600 font-medium">{invoice.issueDate}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Montant TTC</span>
                      <span className="text-lg font-black text-[#0B3B36] tabular-nums">
                        {formatFCFA(invoice.totalTTC)}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Link
                      href={`/factures/${invoice.id}`}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Détails</span>
                    </Link>
                    <a
                      href={`/api/invoices/${invoice.id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-3 bg-[#EEF6F3] border border-[#B2D8CB] text-[#0B3B36] hover:bg-[#D7EBE4] font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 font-medium">
              <FileText className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-2" />
              <p className="font-bold text-slate-900">Aucune facture trouvée</p>
              <p className="text-xs text-slate-500">Essayez de modifier votre recherche ou vos filtres.</p>
            </div>
          )}
        </div>

        {/* Dynamic Desktop Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
                <th className="p-4 whitespace-nowrap">N° Facture</th>
                <th className="p-4 min-w-[160px]">Client</th>
                <th className="p-4 whitespace-nowrap">Date Émission</th>
                <th className="p-4 whitespace-nowrap">Échéance</th>
                <th className="p-4 text-right whitespace-nowrap">Montant TTC</th>
                <th className="p-4 text-center whitespace-nowrap">Statut</th>
                <th className="p-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => {
                  const isOverdue = invoice.status === 'OVERDUE';

                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-bold text-[#0B3B36] whitespace-nowrap">
                        <Link href={`/factures/${invoice.id}`} className="hover:underline">
                          {invoice.number}
                        </Link>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{invoice.clientName}</td>
                      <td className="p-4 text-slate-600 font-medium whitespace-nowrap">{invoice.issueDate}</td>
                      <td className="p-4 font-semibold whitespace-nowrap">
                        {isOverdue ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-extrabold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 text-xs whitespace-nowrap">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            {invoice.dueDate}
                          </span>
                        ) : (
                          <span className="text-slate-700 font-medium whitespace-nowrap">{invoice.dueDate}</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-extrabold text-slate-900 tabular-nums text-sm whitespace-nowrap">
                        {formatFCFA(invoice.totalTTC)}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">{getStatusBadge(invoice.status)}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/factures/${invoice.id}`}
                            className="p-1.5 text-slate-600 hover:text-brand-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <a
                            href={`/api/invoices/${invoice.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-xs font-bold text-[#0B3B36] bg-[#EEF6F3] border border-[#B2D8CB] rounded-lg hover:bg-[#D7EBE4] transition-all flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-2" />
                    <p className="font-bold text-slate-900">Aucune facture trouvée</p>
                    <p className="text-xs text-slate-500">Essayez de modifier votre recherche ou vos filtres.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600 font-semibold">
          <span>Affichage de {filteredInvoices.length} sur {MOCK_INVOICES.length} factures</span>
          <span className="font-bold text-slate-900">Page 1 sur 1</span>
        </div>
      </div>
    </div>
  );
}
