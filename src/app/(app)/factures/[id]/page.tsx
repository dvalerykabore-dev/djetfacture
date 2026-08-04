'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_RECENT_INVOICES, InvoiceStatus } from '@/lib/mock-data';
import { formatFCFA, formatDateFR } from '@/lib/format';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  FileText,
  Download,
  MessageSquare,
  Mail,
  CheckCircle,
  XCircle,
  Copy,
  ArrowLeft,
  Smartphone,
  Building2,
  Calendar,
  Clock,
  Printer,
  Share2,
  Edit3,
  RefreshCw,
  AlertTriangle,
  Trash2,
  X,
} from 'lucide-react';

export default function DetailFacturePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const fallbackInvoice = {
    id: 'default',
    number: 'FACT-2024-001',
    clientName: 'Client de démonstration',
    clientAvatarColor: 'bg-emerald-600',
    issueDate: '2026-07-01',
    dueDate: '2026-07-15',
    subtotal: 1000000,
    taxTotal: 180000,
    total: 1180000,
    amountPaid: 0,
    status: 'sent' as InvoiceStatus,
    itemsCount: 1,
  };
  const invoice = MOCK_RECENT_INVOICES.find((inv) => inv.id === params.id) || MOCK_RECENT_INVOICES[0] || fallbackInvoice;
  
  const [currentStatus, setCurrentStatus] = useState<InvoiceStatus>(invoice.status);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const publicUrl = `https://djetfacture.app/f/tok_32a89f902b`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappMsg = `Bonjour ${invoice.clientName}, voici votre facture ${invoice.number} d'un montant de ${formatFCFA(invoice.total)}. Vous pouvez consulter et télécharger le document officiel à ce lien : ${publicUrl}`;

  const handleDelete = () => {
    // Delete action logic
    router.push('/factures');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/factures"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-ink tracking-tight">
                {invoice.number || 'Facture Brouillon'}
              </h2>
              <StatusPill status={currentStatus} />

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  currentStatus === 'overdue'
                    ? 'bg-rose-50 text-rose-800 border-rose-300 font-extrabold shadow-sm animate-pulse'
                    : currentStatus === 'paid'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                {currentStatus === 'overdue' ? (
                  <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                )}
                <span>Échéance : {formatDateFR(invoice.dueDate)}</span>
              </span>
            </div>
            <p className="text-xs text-muted mt-1">
              Émise le {formatDateFR(invoice.issueDate)}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit Button */}
          <Link
            href={`/factures/nouvelle?edit=${invoice.id}`}
            className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-input transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <Edit3 className="w-4 h-4" />
            <span>Modifier</span>
          </Link>

          {/* Duplicate Button */}
          <Link
            href={`/factures/nouvelle?duplicate=${invoice.id}`}
            className="py-2 px-3.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-input border border-sky-200 transition-all flex items-center gap-1.5"
            title="Dupliquer cette facture"
          >
            <Copy className="w-4 h-4" />
            <span>Dupliquer</span>
          </Link>

          {/* Change Status Button */}
          <button
            onClick={() => setShowStatusModal(true)}
            className="py-2 px-3.5 bg-brand-50 hover:bg-brand-100 text-brand-900 font-bold text-xs rounded-input border border-brand-200 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Changer statut</span>
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-input shadow-sm transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Download PDF */}
          <button className="py-2 px-3 bg-brand-900 hover:bg-brand-700 text-white font-bold text-xs rounded-input shadow-card transition-all flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>

          {/* Cancel Invoice Button */}
          <button
            onClick={() => setCurrentStatus('cancelled')}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-input border border-slate-300 transition-all flex items-center gap-1.5"
            title="Annuler et archiver la facture"
          >
            <XCircle className="w-4 h-4 text-slate-600" />
            <span>Annuler</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-input border border-rose-200 transition-all flex items-center gap-1.5"
            title="Supprimer la facture"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      {/* Main Document Preview Box */}
      <div className="bg-surface rounded-card p-8 md:p-12 border border-slate-200/80 shadow-card space-y-10 font-sans">
        {/* Document Header (Seller & Buyer) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-200">
          {/* Seller / My Org */}
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-xl bg-brand-900 text-white font-black text-2xl flex items-center justify-center shadow-sm">
                  D
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-ink">Kaboré Prestations SARL</h3>
                <p className="text-xs text-muted font-bold">Conseil & Ingénierie Informatique</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1">
              <p>Avenue Léopold Sédar Senghor, Plateau, Dakar</p>
              <p>Sénégal • Tél: +221 77 638 42 10</p>
              <div className="pt-2 text-[11px] font-semibold text-brand-900">
                <p>N° RCCM: SN-DKR-2024-B-1234</p>
                <p>N° NINEA: 009823412 • Régime Réel Simplifié</p>
              </div>
            </div>
          </div>

          {/* Buyer / Client */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60 space-y-2 md:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Destinataire / Client</span>
            <h4 className="font-extrabold text-base text-ink">{invoice.clientName}</h4>
            <p className="text-xs text-slate-600 font-medium">Mamadou Diallo • Directrice Générale</p>
            <p className="text-xs text-slate-600">m.diallo@client.com • +221 77 000 00 00</p>
            <div className="pt-1 text-[11px] font-semibold text-slate-700">
              <p>Dakar, Sénégal</p>
              <p>N° RCCM: SN-DKR-2021-B-8921</p>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Détail des Lignes de Prestation</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                  <th className="py-3 px-4">Désignation</th>
                  <th className="py-3 px-4 text-center">Qté</th>
                  <th className="py-3 px-4 text-right">P.U. HT (FCFA)</th>
                  <th className="py-3 px-4 text-center">TVA</th>
                  <th className="py-3 px-4 text-right">Total HT (FCFA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-4 px-4 font-bold text-ink">
                    Audit de cybersécurité et infrastructure cloud
                    <p className="text-[11px] text-muted font-normal mt-0.5">Analyse des vulnérabilités et recommandations d'architecture</p>
                  </td>
                  <td className="py-4 px-4 text-center tabular-nums font-bold">1</td>
                  <td className="py-4 px-4 text-right tabular-nums">{formatFCFA(750000)}</td>
                  <td className="py-4 px-4 text-center font-bold">18 %</td>
                  <td className="py-4 px-4 text-right tabular-nums font-extrabold text-ink">{formatFCFA(750000)}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-ink">
                    Développement de modules sur-mesure & Intégration
                    <p className="text-[11px] text-muted font-normal mt-0.5">2.5 jours d'assistance technique senior</p>
                  </td>
                  <td className="py-4 px-4 text-center tabular-nums font-bold">2.5</td>
                  <td className="py-4 px-4 text-right tabular-nums">{formatFCFA(200000)}</td>
                  <td className="py-4 px-4 text-center font-bold">18 %</td>
                  <td className="py-4 px-4 text-right tabular-nums font-extrabold text-ink">{formatFCFA(500000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Payment Instructions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Payment Instructions Box */}
          <div className="p-5 rounded-2xl bg-brand-50/50 border border-brand-200/60 space-y-3">
            <div className="flex items-center gap-2 text-brand-950 font-extrabold text-xs uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-brand-700" />
              <span>Modalités et Règlements Mobile Money</span>
            </div>

            <div className="space-y-2 text-xs text-brand-900">
              <p><strong>Wave :</strong> +221 77 638 42 10</p>
              <p><strong>Orange Money :</strong> +221 77 123 45 67</p>
              <p><strong>Virement Bancaire (UBA) :</strong> RIB SN012 01001 012345678901 45</p>
            </div>
            <p className="text-[10px] text-muted italic">
              Veuillez mentionner la référence <strong>{invoice.number}</strong> lors de votre transfert.
            </p>
          </div>

          {/* Totals Summary Card */}
          <div className="space-y-2 text-xs md:text-right">
            <div className="flex justify-between md:justify-end gap-8 text-slate-600 font-medium">
              <span>Sous-total HT :</span>
              <span className="font-extrabold text-ink tabular-nums">{formatFCFA(1059322)}</span>
            </div>

            <div className="flex justify-between md:justify-end gap-8 text-slate-600 font-medium">
              <span>TVA (18 %) :</span>
              <span className="font-extrabold text-ink tabular-nums">{formatFCFA(190678)}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between md:justify-end gap-8 items-baseline">
              <span className="text-sm font-black text-ink">NET À PAYER (FCFA) :</span>
              <span className="text-2xl font-black text-brand-900 tabular-nums">
                {formatFCFA(invoice.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface rounded-card p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-ink">Changer le Statut</h3>
              <button onClick={() => setShowStatusModal(false)} className="p-1 text-slate-400 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { key: 'paid', label: 'Payée (Règlement encaissé)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { key: 'sent', label: 'Envoyée (En attente)', color: 'bg-amber-50 text-amber-900 border-amber-200' },
                { key: 'overdue', label: 'En retard (Encours impayé)', color: 'bg-rose-50 text-rose-800 border-rose-200' },
                { key: 'draft', label: 'Brouillon', color: 'bg-slate-100 text-slate-800 border-slate-200' },
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => {
                    setCurrentStatus(st.key as InvoiceStatus);
                    setShowStatusModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border font-bold text-xs text-left transition-all ${st.color} ${
                    currentStatus === st.key ? 'ring-2 ring-brand-900' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {st.label} {currentStatus === st.key && '✓'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface rounded-card p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-ink">Supprimer cette facture ?</h3>
                <p className="text-xs text-muted">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              Êtes-vous sûr de vouloir supprimer définitivement la facture <strong className="text-ink">{invoice.number}</strong> ? Cette action retirera le document du registre.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-4 rounded-input border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="py-2.5 px-4 rounded-input bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmer la suppression</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
