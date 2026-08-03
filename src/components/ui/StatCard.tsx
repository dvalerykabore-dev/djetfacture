import React, { ReactNode } from 'react';
import { formatFCFA } from '@/lib/format';

interface StatCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  badgeText?: string;
  badgeType?: 'positive' | 'neutral' | 'warning' | 'danger';
  icon: ReactNode;
  iconBgColor?: string;
}

export function StatCard({
  title,
  amount,
  subtitle,
  badgeText,
  badgeType = 'positive',
  icon,
  iconBgColor = 'bg-brand-50 text-brand-900',
}: StatCardProps) {
  const badgeStyles = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
  };

  return (
    <div className="bg-surface rounded-card p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-ink tabular-nums tracking-tight">
            {formatFCFA(amount)}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {badgeText ? (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium border ${badgeStyles[badgeType]}`}>
            {badgeText}
          </span>
        ) : (
          <span />
        )}

        {subtitle && (
          <span className="text-muted font-medium">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
