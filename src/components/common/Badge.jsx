import React from 'react';

export function StatusBadge({ status }) {
  const getBadgeStyle = (st) => {
    switch (st?.toLowerCase()) {
      case 'requested':
      case 'pending':
      case 'available':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'assigned':
      case 'pickup scheduled':
      case 'processing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'collected':
      case 'accepted':
      case 'confirmed':
      case 'in marketplace inventory':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'verified':
      case 'sent to recovery centre':
      case 'fulfilled':
      case 'completed':
      case 'delivered':
      case 'sold to recycler':
        return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
      case 'cancelled':
      case 'expired':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'grade a':
        return 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 font-semibold';
      case 'grade b':
        return 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40 font-semibold';
      case 'grade c':
        return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/40 font-semibold';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
      {status || 'Unknown'}
    </span>
  );
}
