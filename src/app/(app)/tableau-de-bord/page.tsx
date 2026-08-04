'use client';

import React from 'react';
import { MOCK_STATS } from '@/lib/mock-data';
import { StatCard } from '@/components/ui/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentInvoicesTable } from '@/components/dashboard/RecentInvoicesTable';
import { OverdueAlertCard } from '@/components/dashboard/OverdueAlertCard';
import { TopClientsList } from '@/components/dashboard/TopClientsList';
import { PaymentMethodsBox } from '@/components/dashboard/PaymentMethodsBox';
import {
  FileText,
  Wallet,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome Callout */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 text-white rounded-card p-6 md:p-8 shadow-float flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.15),transparent)] pointer-events-none" />

        <div className="space-y-1.5 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <span>Régime Réel Simplifié</span>
            <span>•</span>
            <span>TVA 18%</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Bienvenue, Valéry ! 👋
          </h2>
          <p className="text-sm text-brand-100/90 font-medium">
            Voici un aperçu en temps réel de votre chiffre d'affaires et de vos encaissements FCFA pour le mois en cours.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <div className="bg-brand-950/60 backdrop-blur-sm border border-brand-700/80 rounded-xl p-3.5 text-center min-w-[130px]">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-300">
              Objectif Juillet
            </p>
            <p className="text-lg font-black text-emerald-400 tabular-nums">
              85%
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Facturé (Mois)"
          amount={MOCK_STATS.totalInvoicedMonth}
          badgeText="Prêt à démarrer"
          badgeType="positive"
          subtitle="0 facture émise"
          icon={<FileText className="w-6 h-6 text-brand-900" />}
          iconBgColor="bg-brand-100"
        />

        <StatCard
          title="Total Encaissé"
          amount={MOCK_STATS.totalCollectedMonth}
          badgeText={`${MOCK_STATS.totalCollectedPercentage}% du total`}
          badgeType="positive"
          subtitle="Règlements reçus"
          icon={<Wallet className="w-6 h-6 text-emerald-700" />}
          iconBgColor="bg-emerald-100"
        />

        <StatCard
          title="Factures en attente"
          amount={MOCK_STATS.totalPendingAmount}
          badgeText={`${MOCK_STATS.totalPendingCount} envoyées`}
          badgeType="warning"
          subtitle="Échéances à venir"
          icon={<Clock className="w-6 h-6 text-amber-700" />}
          iconBgColor="bg-amber-100"
        />

        <StatCard
          title="Factures en retard"
          amount={MOCK_STATS.totalOverdueAmount}
          badgeText={`${MOCK_STATS.totalOverdueCount} à relancer`}
          badgeType="danger"
          subtitle="Relances WhatsApp requises"
          icon={<AlertTriangle className="w-6 h-6 text-rose-700" />}
          iconBgColor="bg-rose-100"
        />
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Wide 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <RevenueChart />

          {/* Recent Invoices Table */}
          <RecentInvoicesTable />
        </div>

        {/* Right Column (Narrow 1/3) */}
        <div className="space-y-8">
          {/* Overdue Invoices Alert Card */}
          <OverdueAlertCard />

          {/* Top Clients List */}
          <TopClientsList />

          {/* Active Payment Channels Box */}
          <PaymentMethodsBox />
        </div>
      </div>
    </div>
  );
}
