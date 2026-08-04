import React from 'react';
import { MOCK_RECENT_INVOICES } from '@/lib/mock-data';
import { formatFCFA, formatDateFR } from '@/lib/format';
import { StatusPill } from '@/components/ui/StatusPill';
import { Download, Smartphone, CheckCircle2, ShieldCheck, Printer, Clock, Calendar } from 'lucide-react';

export default function PublicInvoicePage({ params }: { params: { token: string } }) {
  const invoice = MOCK_RECENT_INVOICES[0]!;

  return (
    <div className="min-h-screen bg-canvas py-8 px-4 font-sans text-ink">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner for Public Client */}
        <div className="bg-surface rounded-card p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-ink">Document Officiel de Facturation</h1>
              <p className="text-xs text-muted">Émis par Kaboré Prestations SARL (Conformité OHADA)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="py-2.5 px-4 rounded-input bg-brand-900 hover:bg-brand-700 text-white font-bold text-xs shadow-card transition-all flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              <span>Télécharger le PDF</span>
            </button>
          </div>
        </div>

        {/* Invoice Paper Document */}
        <div className="bg-surface rounded-card p-8 md:p-12 border border-slate-200 shadow-soft space-y-8">
          <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black text-ink">{invoice.number || 'Facture'}</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Échéance : {formatDateFR(invoice.dueDate)}</span>
                </span>
              </div>
              <p className="text-xs text-muted font-medium mt-1">
                Date d'émission : {formatDateFR(invoice.issueDate)}
              </p>
            </div>

            <div className="sm:text-right">
              <StatusPill status={invoice.status} />
              <p className="text-2xl font-black text-brand-900 tabular-nums mt-2">
                {formatFCFA(invoice.total)}
              </p>
            </div>
          </div>

          {/* Seller / Buyer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted">Émetteur</span>
              <h3 className="font-extrabold text-sm text-ink">Kaboré Prestations SARL</h3>
              <p className="text-slate-600">Avenue Léopold Sédar Senghor, Dakar, Sénégal</p>
              <p className="text-slate-600">RCCM: SN-DKR-2024-B-1234 • NINEA: 009823412</p>
            </div>

            <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200 sm:text-right">
              <span className="text-[10px] font-bold uppercase text-muted">Facturé à</span>
              <h3 className="font-extrabold text-sm text-ink">{invoice.clientName}</h3>
              <p className="text-slate-600">Dakar, Sénégal</p>
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                <th className="py-3 px-4">Prestation</th>
                <th className="py-3 px-4 text-center">Qté</th>
                <th className="py-3 px-4 text-right">P.U. HT</th>
                <th className="py-3 px-4 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="py-4 px-4 font-bold text-ink">Prestation d'audit financier et cybersécurité</td>
                <td className="py-4 px-4 text-center font-bold">1</td>
                <td className="py-4 px-4 text-right tabular-nums">{formatFCFA(750000)}</td>
                <td className="py-4 px-4 text-right tabular-nums font-extrabold text-ink">{formatFCFA(750000)}</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-ink">Développement de modules sur-mesure (2.5 jours)</td>
                <td className="py-4 px-4 text-center font-bold">2.5</td>
                <td className="py-4 px-4 text-right tabular-nums">{formatFCFA(200000)}</td>
                <td className="py-4 px-4 text-right tabular-nums font-extrabold text-ink">{formatFCFA(500000)}</td>
              </tr>
            </tbody>
          </table>

          {/* Payment Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-brand-50 border border-brand-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-brand-950 font-bold">
                <Smartphone className="w-4 h-4 text-brand-700" />
                <span>Règlement Mobile Money</span>
              </div>
              <p className="text-brand-900 font-semibold">Wave : +221 77 638 42 10</p>
              <p className="text-brand-900 font-semibold">Orange Money : +221 77 123 45 67</p>
              <p className="text-[10px] text-muted italic">Mentionnez la référence {invoice.number} lors de votre envoi.</p>
            </div>

            <div className="space-y-1 text-xs text-right">
              <p className="text-slate-600 font-medium">Sous-total HT : <strong className="text-ink">{formatFCFA(1059322)}</strong></p>
              <p className="text-slate-600 font-medium">TVA (18 %) : <strong className="text-ink">{formatFCFA(190678)}</strong></p>
              <p className="text-xl font-black text-brand-900 pt-2 border-t border-slate-200">
                NET À PAYER : {formatFCFA(invoice.total)}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted">
          Généré avec sécurité par <strong>DJETFACTURE</strong> — Plateforme de facturation pour entreprises africaines.
        </p>
      </div>
    </div>
  );
}
