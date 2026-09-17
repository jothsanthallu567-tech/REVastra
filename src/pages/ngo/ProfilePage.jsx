import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, Building2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export function NGOProfile() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">NGO Organization Profile</h1>
        <p className="text-xs text-slate-400">Verified food rescue welfare organization parameters.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/40"
          />
          <div>
            <h3 className="text-lg font-bold text-white font-heading">{currentUser?.name}</h3>
            <span className="text-xs text-amber-400 font-semibold">{currentUser?.registrationNo || 'NGO-KA-2018-9941'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Contact Person</span>
            <strong className="text-white font-bold text-sm">{currentUser?.contactPerson || 'Priya Sundaram'}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Meals Distributed</span>
            <strong className="text-amber-400 font-extrabold text-sm">42,500 Meals</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Official Email</span>
            <strong className="text-slate-200">{currentUser?.email}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">HQ Address</span>
            <strong className="text-slate-300">{currentUser?.address}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
