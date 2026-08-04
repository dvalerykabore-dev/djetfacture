'use client';

import React from 'react';
import { MOCK_MONTHLY_REVENUE } from '@/lib/mock-data';
import { formatFCFA } from '@/lib/format';
import { TrendingUp, Calendar } from 'lucide-react';

export function RevenueChart() {
  const maxVal = Math.max(...MOCK_MONTHLY_REVENUE.map((d) => d.invoiced), 1);

  return (
    <div className="bg-surface rounded-card p-6 border border-slate-200/80 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink">Chiffre d'Affaires Mensuel</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              <TrendingUp className="w-3.5 h-3.5" />
              +12.4%
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">Comparatif entre montants facturés et encaissements réels</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand-900" />
            <span className="text-slate-700">Facturé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-700">Encaissé</span>
          </div>
          <div className="flex items-center gap-1 text-muted pl-2 border-l border-slate-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>2026</span>
          </div>
        </div>
      </div>

      {/* SVG / Bar Chart Representation */}
      <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
        {MOCK_MONTHLY_REVENUE.map((data, index) => {
          const invoicedHeightPercent = (data.invoiced / maxVal) * 100;
          const collectedHeightPercent = (data.collected / maxVal) * 100;

          return (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold rounded px-2 py-1 shadow-lg pointer-events-none z-10 whitespace-nowrap">
                <div>Facturé: {formatFCFA(data.invoiced)}</div>
                <div className="text-emerald-400">Encaissé: {formatFCFA(data.collected)}</div>
              </div>

              {/* Bars */}
              <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-full">
                {/* Invoiced Bar */}
                <div
                  className="w-1/2 bg-brand-900 rounded-t-md transition-all duration-300 group-hover:bg-brand-700"
                  style={{ height: `${invoicedHeightPercent}%` }}
                />
                {/* Collected Bar */}
                <div
                  className="w-1/2 bg-emerald-500 rounded-t-md transition-all duration-300 group-hover:bg-emerald-400"
                  style={{ height: `${collectedHeightPercent}%` }}
                />
              </div>

              {/* Month label */}
              <span className="text-xs font-semibold text-muted mt-3">{data.month}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-4 pt-2 flex items-center justify-between text-xs text-muted font-medium">
        <span>Moyenne mensuelle : <strong className="text-ink tabular-nums">{formatFCFA(10540000)}</strong></span>
        <span>Objectif T3 : <strong className="text-brand-900 font-bold">85% atteint</strong></span>
      </div>
    </div>
  );
}
