import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Building2, Scale, Layers, PlusCircle, ArrowRight } from 'lucide-react';

export function AdminRecoveryCentres() {
  const { data } = useData();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Resource Recovery Centres (RRC)</h1>
          <p className="text-xs text-slate-400">City-level processing hubs handling segregation, weighing, and quality grading</p>
        </div>

        <NavLink
          to="/admin/recovery-centres/segregation"
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow-lg shadow-teal-600/30 flex items-center gap-2"
        >
          <Scale className="w-4 h-4" /> Open Dock Segregation & Weighing
        </NavLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.recoveryCentres.map((rc) => (
          <div key={rc.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-teal-400">{rc.id}</span>
                <h3 className="text-lg font-bold text-white font-heading mt-0.5">{rc.name}</h3>
              </div>
              <Building2 className="w-6 h-6 text-teal-400" />
            </div>

            <p className="text-xs text-slate-400">{rc.location} • Manager: <strong>{rc.managerName}</strong></p>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Processing Capacity</span>
                <strong className="text-white text-sm">{rc.capacityTonsPerDay} Tons/day</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Current Stock</span>
                <strong className="text-emerald-400 text-sm">{rc.currentStockTons} Tons</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
