import React from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import {
  Leaf,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  QrCode,
  Truck,
  Building2,
  Store,
  Heart
} from 'lucide-react';

export function AuthLayout() {
  const { role } = useParams();

  const roleDetails = {
    'waste-giver': { title: 'Waste Giver Portal', color: 'text-emerald-400', icon: QrCode, desc: 'QR-tagged source segregation & Green Coins wallet.' },
    'collector': { title: 'Field Collector Portal', color: 'text-blue-400', icon: Truck, desc: 'Doorstep QR verification & calibrated weighing logger.' },
    'buyer': { title: 'B2B Recycler Marketplace', color: 'text-purple-400', icon: Store, desc: 'Quality-graded recycled material batches procurement.' },
    'ngo': { title: 'NGO Food Rescue Portal', color: 'text-amber-400', icon: Heart, desc: 'Rapid zero-waste claim of commercial surplus meals.' },
    'admin': { title: 'System Admin Secure Portal', color: 'text-rose-400', icon: ShieldCheck, desc: 'Municipal oversight, inventory release & batch audits.' }
  };

  const activeRole = roleDetails[role] || roleDetails['waste-giver'];
  const ActiveIcon = activeRole.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between cleantech-grid-bg relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="hero-glow top-0 left-1/3 -translate-x-1/2 opacity-20 pointer-events-none"></div>

      {/* Top Header */}
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md relative z-20">
        <NavLink
          to="/role-selection"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Switch User Role</span>
        </NavLink>

        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-white font-heading">
            REV<span className="text-emerald-400">astra</span>
          </span>
        </NavLink>
      </header>

      {/* Main Single-Column Container for Simplified Accessibility */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-slate-500 border-t border-slate-900 bg-slate-950/90 relative z-20">
        REVastra Platform • Smart Circular Waste Exchange & Reward Ecosystem • SIH 2026
      </footer>
    </div>
  );
}
