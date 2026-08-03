import React from 'react';
import { InvoiceStatus } from '@/lib/mock-data';

interface StatusPillProps {
  status: InvoiceStatus;
  customLabel?: string;
  className?: string;
}

export function StatusPill({ status, customLabel, className = '' }: StatusPillProps) {
  const configs: Record<InvoiceStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
    paid: {
      label: 'Payée',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60',
      dot: 'bg-emerald-500',
    },
    sent: {
      label: 'Envoyée',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200/60',
      dot: 'bg-amber-500',
    },
    overdue: {
      label: 'En retard',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200/60',
      dot: 'bg-rose-500',
    },
    draft: {
      label: 'Brouillon',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
    partial: {
      label: 'Partielle',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200/60',
      dot: 'bg-sky-500',
    },
    cancelled: {
      label: 'Annulée',
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      dot: 'bg-gray-400',
    },
  };

  const config = configs[status] || configs.draft;
  const displayLabel = customLabel || config.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap shrink-0 ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      <span className="whitespace-nowrap">{displayLabel}</span>
    </span>
  );
}
