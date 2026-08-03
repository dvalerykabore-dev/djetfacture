import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse p-4">
      <div className="h-8 w-64 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="h-28 bg-slate-200 rounded-card" />
        <div className="h-28 bg-slate-200 rounded-card" />
        <div className="h-28 bg-slate-200 rounded-card" />
        <div className="h-28 bg-slate-200 rounded-card" />
      </div>
      <div className="h-64 bg-slate-200 rounded-card" />
    </div>
  );
}
