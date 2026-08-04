'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_CLIENTS, ClientMock } from '@/lib/mock-data';
import { calculateInvoiceTotals, InvoiceLineItem } from '@/lib/invoice-math';
import { formatFCFA } from '@/lib/format';
import {
  Plus,
  Trash2,
  Calendar,
  Building2,
  Calculator,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  UserPlus,
  X,
} from 'lucide-react';

export function InvoiceForm() {
  const router = useRouter();
  const [selectedClientId, setSelectedClientId] = useState<string>(MOCK_CLIENTS[0]?.id || '');
  const [issueDate, setIssueDate] = useState<string>('2026-07-25');
  const [dueDate, setDueDate] = useState<string>('2026-08-08');
  const [notes, setNotes] = useState<string>('Règlement à réception par virement bancaire ou Mobile Money (Wave / Orange Money).');

  // Dynamic Line Items State
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: '1',
      description: 'Prestation de conseil stratégique et audit financier',
      quantity: 1,
      unitPrice: BigInt(750000),
      discountPercent: 0,
      taxRate: 18,
    },
    {
      id: '2',
      description: 'Développement d’application mobile et intégration API',
      quantity: 2.5,
      unitPrice: BigInt(200000),
      discountPercent: 5,
      taxRate: 18,
    },
  ]);

  // Inline Quick Client Creation Modal State
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // Calculate live totals using strict integer math
  const totals = calculateInvoiceTotals(items);

  const defaultClient: ClientMock = {
    id: 'default',
    name: 'Client par défaut',
    contactName: 'Comptabilité',
    email: '',
    phone: '',
    city: 'Dakar',
    country: 'Sénégal',
    totalInvoiced: 0,
    activeOutstanding: 0,
    avatarColor: 'bg-brand-900',
  };

  const selectedClient = MOCK_CLIENTS.find((c) => c.id === selectedClientId) || MOCK_CLIENTS[0] || defaultClient;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        description: '',
        quantity: 1,
        unitPrice: BigInt(0),
        discountPercent: 0,
        taxRate: 18,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof InvoiceLineItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        if (field === 'unitPrice') {
          const cleanNum = String(value).replace(/\D/g, '');
          return { ...item, unitPrice: BigInt(cleanNum || '0') };
        } else if (field === 'quantity' || field === 'discountPercent' || field === 'taxRate') {
          return { ...item, [field]: Number(value) };
        } else {
          return { ...item, [field]: value };
        }
      })
    );
  };

  const handleQuickAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    const created: ClientMock = {
      id: `cli-${Date.now()}`,
      name: newClientName,
      contactName: newClientName,
      email: newClientEmail || 'contact@client.com',
      phone: newClientPhone || '+221 77 000 00 00',
      city: 'Dakar',
      country: 'Sénégal',
      totalInvoiced: 0,
      activeOutstanding: 0,
      avatarColor: 'bg-emerald-600',
    };

    MOCK_CLIENTS.unshift(created);
    setSelectedClientId(created.id);
    setShowClientModal(false);
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Form Card Header */}
      <div className="bg-surface rounded-card p-6 md:p-8 border border-slate-200/80 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Nouveau document brouillon</span>
            </div>
            <h2 className="text-2xl font-black text-ink tracking-tight">Créer une Facture</h2>
            <p className="text-xs text-muted mt-0.5">
              Le numéro définitif OHADA sera attribué atomiquement lors de la finalisation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/factures')}
              className="py-2.5 px-4 rounded-input border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all"
            >
              Annuler
            </button>
            <button
              onClick={() => router.push('/factures')}
              className="py-2.5 px-4 rounded-input bg-brand-900 hover:bg-brand-700 text-white font-bold text-xs shadow-card transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer Brouillon</span>
            </button>
          </div>
        </div>

        {/* Client Selection & Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Select */}
          <div className="md:col-span-1 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Client destinataire <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowClientModal(true)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ Nouveau</span>
              </button>
            </div>

            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-xs text-ink focus:bg-white focus:border-brand-500 outline-none transition-all"
            >
              {MOCK_CLIENTS.map((cli) => (
                <option key={cli.id} value={cli.id}>
                  {cli.name} ({cli.city}, {cli.country})
                </option>
              ))}
            </select>

            {selectedClient && (
              <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-200/50 text-xs space-y-1 mt-2">
                <p className="font-bold text-brand-950">{selectedClient.name}</p>
                <p className="text-brand-800/80">{selectedClient.contactName} • {selectedClient.phone}</p>
                {selectedClient.rccm && (
                  <p className="text-[10px] text-muted font-medium">RCCM: {selectedClient.rccm}</p>
                )}
              </div>
            )}
          </div>

          {/* Issue Date */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Date d'Émission <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-xs text-ink focus:bg-white focus:border-brand-500 outline-none transition-all"
              />
            </div>
            <p className="text-[10px] text-muted">Aujourd'hui par défaut</p>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Date d'Échéance <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input font-semibold text-xs text-ink focus:bg-white focus:border-brand-500 outline-none transition-all"
            />
            <p className="text-[10px] text-muted">Net à 14 jours</p>
          </div>
        </div>

        {/* Dynamic Line Items Editor */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">Articles & Lignes de Prestation</h3>
              <p className="text-xs text-muted">Quantités décimales supportées (ex: 2.5 jours), prix unitaires en FCFA.</p>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une ligne</span>
            </button>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            {items.map((item, idx) => {
              const brut = Math.round(item.quantity * Number(item.unitPrice));
              const discount = Math.round((brut * (item.discountPercent || 0)) / 100);
              const lineSubtotal = brut - discount;

              return (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 relative group"
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Description */}
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-[10px] font-bold text-muted uppercase mb-1">
                        Désignation / Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id!, 'description', e.target.value)}
                        placeholder="Ex: Prestation de développement web..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-ink outline-none focus:border-brand-500"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[10px] font-bold text-muted uppercase mb-1">
                        Qté
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id!, 'quantity', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-ink outline-none focus:border-brand-500 tabular-nums"
                      />
                    </div>

                    {/* Unit Price FCFA */}
                    <div className="col-span-4 md:col-span-3">
                      <label className="block text-[10px] font-bold text-muted uppercase mb-1">
                        Prix Unitaire (FCFA)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={Number(item.unitPrice)}
                        onChange={(e) => handleUpdateItem(item.id!, 'unitPrice', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-ink outline-none focus:border-brand-500 tabular-nums"
                      />
                    </div>

                    {/* TVA % */}
                    <div className="col-span-3 md:col-span-2">
                      <label className="block text-[10px] font-bold text-muted uppercase mb-1">
                        TVA
                      </label>
                      <select
                        value={item.taxRate}
                        onChange={(e) => handleUpdateItem(item.id!, 'taxRate', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-ink outline-none focus:border-brand-500"
                      >
                        <option value={18}>18 %</option>
                        <option value={19.25}>19.25 %</option>
                        <option value={0}>0 % (Exonéré)</option>
                      </select>
                    </div>
                  </div>

                  {/* Line Subtotal & Delete Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-muted font-medium">Remise:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discountPercent || 0}
                        onChange={(e) => handleUpdateItem(item.id!, 'discountPercent', e.target.value)}
                        className="w-16 p-1 text-center bg-white border border-slate-200 rounded text-xs font-bold text-ink"
                      />
                      <span className="text-muted">%</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-ink tabular-nums">
                        Total ligne HT: {formatFCFA(lineSubtotal)}
                      </span>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id!)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Calculation & Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
          {/* Notes & Terms */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Notes & Conditions de Règlement
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-input text-xs font-medium text-ink focus:bg-white focus:border-brand-500 outline-none transition-all resize-none"
            />
            <p className="text-[10px] text-muted">Ces mentions figureront en bas du document PDF.</p>
          </div>

          {/* Real-time Totals Panel */}
          <div className="bg-brand-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-brand-800 pb-3">
              <span className="text-xs font-bold text-brand-200 uppercase tracking-wider">Récapitulatif financier</span>
              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Arithmétique Entière FCFA
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-brand-100 font-medium">
                <span>Sous-total HT :</span>
                <span className="font-extrabold tabular-nums text-white">{formatFCFA(totals.subtotal)}</span>
              </div>

              {Object.entries(totals.taxGroupTotals).map(([rate, taxAmount]) => (
                <div key={rate} className="flex justify-between text-brand-200">
                  <span>TVA ({rate}%) :</span>
                  <span className="font-bold tabular-nums text-white">{formatFCFA(taxAmount)}</span>
                </div>
              ))}

              <div className="pt-3 border-t border-brand-800 flex justify-between items-baseline">
                <span className="text-sm font-black text-white">TOTAL TTC (FCFA) :</span>
                <span className="text-2xl font-black text-emerald-400 tabular-nums">
                  {formatFCFA(totals.total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/factures/fac-2026-0089')}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-brand-950 font-black text-sm shadow-lg hover:shadow-xl transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
              <span>Finaliser & Émettre la Facture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inline Quick Add Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface rounded-card p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-ink">Nouveau Client Rapide</h3>
              <button
                onClick={() => setShowClientModal(false)}
                className="p-1 text-slate-400 hover:text-ink rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAddClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Raison sociale / Nom *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ex: Baobab Tech SARL"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Téléphone (WhatsApp)</label>
                <input
                  type="text"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+221 77 123 45 67"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="contact@client.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-brand-900 text-white font-bold hover:bg-brand-700"
                >
                  Ajouter le client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
