import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, Building2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export function BuyerProfile() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">B2B Buyer Profile</h1>
        <p className="text-xs text-slate-400">Verified commercial buyer credentials and business parameters.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/40"
          />
          <div>
            <h3 className="text-lg font-bold text-white font-heading">{currentUser?.name}</h3>
            <span className="text-xs text-purple-400 font-semibold">{currentUser?.businessType || 'Plastic Recycler'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Contact Person</span>
            <strong className="text-white font-bold text-sm">{currentUser?.contactPerson || 'Vikram Mehta'}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">GSTIN Registration</span>
            <strong className="text-purple-400 font-mono font-bold text-sm">{currentUser?.gstin || '29ABCDE1234F1Z5'}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Corporate Email</span>
            <strong className="text-slate-200">{currentUser?.email}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Registered Plant Address</span>
            <strong className="text-slate-300">{currentUser?.address}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
