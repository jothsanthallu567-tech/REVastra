import React, { useState } from 'react';
import { useSearchParams, NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  ArrowRight,
  Camera,
  MapPin,
  Building2,
  Clock,
  Layers,
  Sparkles,
  Share2,
  Leaf
} from 'lucide-react';

export function CivicWatchSuccess() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id') || 'RV-CW-0001';
  const { civicReports } = useData();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const report = (civicReports || []).find((r) => r.reportId === reportId) || {
    reportId,
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=600',
    latitude: 12.9784,
    longitude: 77.6408,
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
    ward: 'Ward 112 - Domlur / Indiranagar',
    wasteType: 'Plastic',
    reportedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    concernedMunicipality: 'BBMP Urban Local Body (East Zone)',
    status: 'Reported'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report.reportId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 cleantech-grid-bg relative overflow-x-hidden selection:bg-teal-500 selection:text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Background glow */}
      <div className="hero-glow top-0 left-1/2 -translate-x-1/2 opacity-25"></div>

      <div className="max-w-2xl mx-auto w-full space-y-6 relative z-10 py-6">
        {/* Success Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-500/40 bg-slate-900/80 shadow-2xl space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
              Incident Registered
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Dumping Report Submitted Successfully
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Your roadside dumping report has been routed to the concerned Urban Local Body (ULB) for verification and sanitation dispatch.
            </p>
          </div>

          {/* Unique Report ID Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Unique Report ID
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-teal-400">
                {report.reportId}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          {/* Summary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" /> Location
              </span>
              <p className="text-xs font-semibold text-white line-clamp-2">{report.address}</p>
              <p className="text-[11px] font-mono text-teal-400">
                {Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Building2 className="w-3 h-3 text-teal-400" /> Concerned Municipality
              </span>
              <p className="text-xs font-semibold text-white">{report.concernedMunicipality}</p>
              <p className="text-[11px] text-slate-400">{report.ward}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Layers className="w-3 h-3 text-purple-400" /> Waste Category
              </span>
              <p className="text-xs font-semibold text-white">{report.wasteType}</p>
              <p className="text-[11px] text-slate-400">Status: <strong className="text-teal-300 uppercase">{report.status}</strong></p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-400" /> Date & Time
              </span>
              <p className="text-xs font-semibold text-white">{report.reportedAt}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Auto-captured timestamp</p>
            </div>
          </div>

          {/* Photo Preview */}
          {report.photoUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-800 text-left">
              <span className="p-2 bg-slate-950/90 text-[10px] font-bold uppercase text-slate-400 block border-b border-slate-800">
                Attached Citizen Evidence Photo
              </span>
              <img
                src={report.photoUrl}
                alt="Submitted report evidence"
                className="w-full h-40 object-cover"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <NavLink
              to={`/civicwatch/track?id=${encodeURIComponent(report.reportId)}`}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Track Report Status in Real-Time</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>

            <div className="flex flex-col sm:flex-row gap-2">
              <NavLink
                to="/civicwatch/report"
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors text-center"
              >
                Report Another Dumping Site
              </NavLink>

              <NavLink
                to="/civicwatch"
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors text-center"
              >
                Return to CivicWatch Home
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 py-4">
        ReVastra CivicWatch • Public Citizen Portal
      </footer>
    </div>
  );
}
