'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_CLIENTS, ClientMock } from '@/lib/mock-data';
import { formatFCFA } from '@/lib/format';
import { getClientsFromSupabase, deleteClientInSupabase } from '@/lib/supabase/service';
import { Search, Plus, User, Phone, Mail, FileText, Edit3, Trash2, AlertTriangle, X, RefreshCw } from 'lucide-react';

export function ClientList({ onOpenCreateModal }: { onOpenCreateModal?: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<ClientMock[]>(MOCK_CLIENTS);
  const [loading, setLoading] = useState(true);

  // Charger les clients réels depuis Supabase
  const loadSupabaseClients = async () => {
    setLoading(true);
    try {
      const realData = await getClientsFromSupabase();
      if (realData && realData.length > 0) {
        const mapped: ClientMock[] = realData.map(c => ({
          id: c.id,
          name: c.name,
          contactName: c.contact_name || c.name,
          email: c.email || '',
          phone: c.phone || '',
          city: c.city || 'Dakar',
          country: c.country || 'Sénégal',
          rccm: c.rccm || '',
          ifu: c.ifu || '',
          totalInvoiced: 0,
          activeOutstanding: 0,
          avatarColor: 'bg-[#0B3B36]',
        }));
        setClients(mapped);
      } else {
        setClients([]);
      }
    } catch (err) {
      console.warn('Utilisation fallback clients local:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupabaseClients();
  }, []);

  // Edit State
  const [editingClient, setEditingClient] = useState<ClientMock | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');

  // Delete Confirmation State
  const [deletingClient, setDeletingClient] = useState<ClientMock | null>(null);

  const filteredClients = clients.filter((client) => {
    const clientName = client.name || (client as any).companyName || '';
    return (
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.rccm && client.rccm.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleOpenEdit = (client: ClientMock) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setEditCity(client.city);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    setClients(
      clients.map((c) =>
        c.id === editingClient.id
          ? { ...c, name: editName, email: editEmail, phone: editPhone, city: editCity }
          : c
      )
    );
    setEditingClient(null);
  };

  const handleDeleteClient = () => {
    if (!deletingClient) return;
    setClients(clients.filter((c) => c.id !== deletingClient.id));
    setDeletingClient(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0F1A18] flex items-center gap-2 tracking-tight">
            <span>Carnet de Clients</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#EEF6F3] text-[#0B3B36] border border-[#B2D8CB]">
              {filteredClients.length} clients
            </span>
          </h2>
          <p className="text-xs text-[#5F726E]">Répertoire des comptes commerciaux et suivi des encours</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#5F726E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un client..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#0F1A18] outline-none focus:border-[#0B3B36] transition-all"
            />
          </div>

          <button
            onClick={onOpenCreateModal}
            className="py-2.5 px-4 bg-[#0B3B36] hover:bg-[#0D4A42] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nouveau Client</span>
          </button>
        </div>
      </div>

      {/* Grid of Client Cards with Highlighted Financial Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClients.map((client) => {
          const clientName = client.name || (client as any).companyName || '';
          const dueAmount = client.activeOutstanding ?? (client as any).totalDue ?? 0;
          const hasDue = dueAmount > 0;

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 hover:border-[#87BEAF] hover:shadow-md transition-all group"
            >
              {/* Header: Company Name in 20px font-black + Active Badge + Edit/Delete Buttons */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${client.avatarColor || 'bg-[#0B3B36]'} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {(clientName || 'CL').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <Link href={`/clients/${client.id}`} className="hover:underline">
                      <h3 className="text-xl font-black text-[#0F1A18] tracking-tight group-hover:text-[#0B3B36] transition-colors">
                        {clientName}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#5F726E] mt-0.5 font-medium">
                      {client.city}, {client.country}
                      {client.rccm && ` • RCCM: ${client.rccm}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(client)}
                    className="p-1.5 text-slate-400 hover:text-[#0B3B36] hover:bg-slate-100 rounded-lg transition-colors"
                    title="Modifier le client"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingClient(client)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Supprimer le client"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="text-xs space-y-1.5 text-[#5F726E] bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <p className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Contact: <strong className="text-[#0F1A18] font-bold">{client.contactName}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Tél (WhatsApp): <strong className="text-[#0F1A18] font-bold">{client.phone}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Email: <strong className="text-[#0F1A18] font-bold">{client.email}</strong></span>
                </p>
              </div>

              {/* High Visibility Financial Highlight Section */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Total Invoiced Block */}
                <div className="p-3 rounded-xl bg-[#EEF6F3] border border-[#B2D8CB] flex flex-col justify-between space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#0B3B36] opacity-80">
                    CA Facturé (Cumul)
                  </span>
                  <span className="text-base font-black text-[#0B3B36] tabular-nums">
                    {formatFCFA(client.totalInvoiced)}
                  </span>
                </div>

                {/* Outstanding Due / Status Block */}
                <div
                  className={`p-3 rounded-xl border flex flex-col justify-between space-y-1 ${
                    hasDue
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-80 flex items-center justify-between">
                    <span>{hasDue ? 'Solde Restant Dû' : 'Statut Règlement'}</span>
                    {hasDue && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-600 text-white">
                        En retard
                      </span>
                    )}
                  </span>
                  <span className={`text-base font-black tabular-nums ${hasDue ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {hasDue ? `${formatFCFA(dueAmount)} dû` : 'À jour (0 FCFA)'}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/clients/${client.id}`}
                  className="font-bold text-[#0B3B36] hover:underline flex items-center gap-1"
                >
                  <span>Voir la fiche & historique →</span>
                </Link>

                <Link
                  href={`/factures/nouvelle?client=${client.id}`}
                  className="py-1.5 px-3 bg-[#0B3B36] hover:bg-[#0D4A42] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Facturer</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface rounded-card p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-ink">Modifier la fiche client</h3>
              <button onClick={() => setEditingClient(null)} className="p-1 text-slate-400 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Raison sociale / Nom *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Téléphone (WhatsApp)</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-[#0B3B36] text-white font-bold hover:bg-[#0D4A42]"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface rounded-card p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-ink">Supprimer ce client ?</h3>
                <p className="text-xs text-muted">Retrait du carnet de clients</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              Êtes-vous sûr de vouloir supprimer définitivement le client <strong className="text-ink">{deletingClient.name}</strong> ?
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingClient(null)}
                className="py-2.5 px-4 rounded-input border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteClient}
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
