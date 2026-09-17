import React from 'react';

export function StatCard({ title, value, subtext, icon: Icon, color = 'emerald', trend }) {
  const colorStyles = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border transition-all hover:border-slate-600/80 hover:translate-y-[-2px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorStyles[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl lg:text-3xl font-extrabold text-white font-heading tracking-tight">{value}</div>
        {trend && (
          <span className="inline-flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>
      {subtext && <p className="mt-1.5 text-xs text-slate-400">{subtext}</p>}
    </div>
  );
}
