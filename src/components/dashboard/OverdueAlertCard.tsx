'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_RECENT_INVOICES } from '@/lib/mock-data';
import { formatFCFA, formatDateFR } from '@/lib/format';
import { AlertCircle, MessageSquare, ArrowRight } from 'lucide-react';

export function OverdueAlertCard() {
  const overdueInvoices = MOCK_RECENT_INVOICES.filter((inv) => inv.status === 'overdue');

  if (overdueInvoices.length === 0) return null;

  return (
    <div className="bg-rose-50/60 rounded-card p-5 border border-rose-200/80 shadow-card">
      <div className="flex items-center gap-2.5 mb-3 text-rose-800">
        <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold tracking-tight">Factures en retard ({overdueInvoices.length})</h3>
          <p className="text-xs text-rose-700/80 font-medium">Relances recommandées via WhatsApp</p>
        </div>
      </div>

      <div className="space-y-2.5 mt-4">
        {overdueInvoices.map((inv) => {
          const whatsappMessage = `Bonjour ${inv.clientName}, rappel amical concernant la facture ${inv.number} échue depuis le ${formatDateFR(inv.dueDate)}. Solde restant: ${formatFCFA(inv.total - inv.amountPaid)}. Merci de nous confirmer votre règlement.`;

          return (
            <div
              key={inv.id}
              className="bg-white rounded-xl p-3.5 border border-rose-200/60 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-ink">{inv.number}</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    Échue le {formatDateFR(inv.dueDate)}
                  </span>
                </div>
                <p className="text-xs text-muted truncate font-medium mt-0.5">{inv.clientName}</p>
                <p className="text-xs font-black text-rose-800 tabular-nums mt-1">
                  {formatFCFA(inv.total - inv.amountPaid)} restant
                </p>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                title="Envoyer un rappel WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Relancer</span>
              </a>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-rose-200/60 text-right">
        <Link
          href="/factures?status=overdue"
          className="text-xs font-bold text-rose-800 hover:text-rose-950 inline-flex items-center gap-1 hover:underline"
        >
          <span>Gérer tous les retards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
