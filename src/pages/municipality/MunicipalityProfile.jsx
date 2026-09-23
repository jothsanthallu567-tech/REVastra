import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react';

export function MunicipalityProfile() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Municipality / ULB Directorate Profile</h1>
        <p className="text-xs text-slate-400">
          Official Urban Local Body administrative credentials and jurisdiction parameters.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-500/40"
          />
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              {currentUser?.name || 'BBMP Urban Local Body (East Zone)'}
            </h3>
            <span className="text-xs text-teal-400 font-semibold">
              {currentUser?.department || 'Solid Waste Management & Sanitation Directorate'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Chief Officer In-Charge</span>
            <strong className="text-white font-bold text-sm">
              {currentUser?.contactPerson || 'K. S. Narayanan (Chief Sanitation Officer)'}
            </strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Official Directorate Email</span>
            <strong className="text-teal-300 font-mono font-bold text-sm">
              {currentUser?.email || 'municipality@bbmp.gov.in'}
            </strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Official Contact Desk</span>
            <strong className="text-slate-200">{currentUser?.phone || '+91 80 2266 0000'}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="block text-slate-400">Jurisdiction & Wards</span>
            <strong className="text-slate-200">
              {currentUser?.jurisdiction || 'Bruhat Bengaluru Mahanagara Palike - East Zone (Wards 110-120)'}
            </strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
          <span>
            Authorized Municipal Command Center for CivicWatch roadside dumping triage & cleanup dispatch.
          </span>
        </div>
      </div>
    </div>
  );
}
