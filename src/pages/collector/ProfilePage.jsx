import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Truck, MapPin, ShieldCheck } from 'lucide-react';

export function CollectorProfile() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Collector Identity Profile</h1>
        <p className="text-xs text-slate-400">Authorized personnel credentials and assigned zone parameters.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/40"
          />
          <div>
            <h3 className="text-lg font-bold text-white font-heading">{currentUser?.name}</h3>
            <span className="text-xs text-blue-400 font-semibold">{currentUser?.assignedZone || 'East Zone Corridor 4'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Collector Badge ID</span>
            <strong className="text-white font-mono font-bold text-sm">CLR-KA-104</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Assigned EV Vehicle No</span>
            <strong className="text-blue-400 font-mono font-bold text-sm">{currentUser?.vehicleNo || 'KA-01-EV-4092'}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Contact Email</span>
            <strong className="text-slate-200">{currentUser?.email}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Total Lifetime Collections</span>
            <strong className="text-emerald-400 text-sm font-bold">142 Pickups</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
