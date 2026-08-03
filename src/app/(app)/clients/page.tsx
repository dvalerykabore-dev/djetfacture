'use client';

import React, { useState } from 'react';
import { ClientList } from '@/components/clients/ClientList';
import { X, RefreshCw } from 'lucide-react';
import { createClientInSupabase } from '@/lib/supabase/service';

export default function ClientsPage() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Dakar');
  const [country, setCountry] = useState('Sénégal');
  const [rccm, setRccm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || submitting) return;

    setSubmitting(true);
    try {
      await createClientInSupabase({
        name,
        contact_name: contactName || name,
        email: email || '',
        phone: phone || '',
        city,
        country,
        rccm,
      });

      setShowModal(false);
      setName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setRccm('');
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      alert('Erreur enregistrement client dans Supabase: ' + (err?.message || String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setRccm('');
    setCity('Dakar');
    setCountry('Sénégal');
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-ink tracking-tight">Carnet de Clients</h2>
        <p className="text-xs text-muted mt-0.5">
          Gérez vos contacts commerciaux, coordonnées légales (RCCM/IFU) et historique d'encaissements.
        </p>
      </div>

      <ClientList key={refreshKey} onOpenCreateModal={openCreateModal} />

      {/* Create Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface rounded-card p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-ink">Nouveau Client</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-ink rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Raison Sociale / Nom *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: SOGEA SATOM SA"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom du Contact</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Mamadou Diallo"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Téléphone (WhatsApp)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221 77 638 42 10"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@societe.sn"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">N° RCCM (OHADA)</label>
                  <input
                    type="text"
                    value={rccm}
                    onChange={(e) => setRccm(e.target.value)}
                    placeholder="SN-DKR-2021-B-8921"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pays</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-input font-medium text-ink outline-none focus:border-brand-500"
                  >
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Mali">Mali</option>
                    <option value="Cameroun">Cameroun</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-lg bg-brand-900 text-white font-bold hover:bg-brand-700"
                >
                  Enregistrer le Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
