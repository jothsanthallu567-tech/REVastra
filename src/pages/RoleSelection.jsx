import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Truck,
  Store,
  Heart,
  ShieldCheck,
  ArrowRight,
  Leaf,
  Sparkles,
  CheckCircle2,
  Camera,
  Compass,
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';

export function RoleSelection() {
  const { switchRoleDemo } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = (role, redirectPath) => {
    switchRoleDemo(role);
    navigate(redirectPath);
  };

  const roles = [
    {
      roleKey: 'waste-giver',
      title: '1. Waste Giver',
      badge: 'Households, Restaurants, Shops, Colleges',
      description: 'Generate unique QR source identity, request dry waste pickups, earn verified Green Coins, and redeem essential grocery rewards or donate surplus food.',
      icon: Users,
      color: 'emerald',
      isPublic: false,
      loginUrl: '/login/waste-giver',
      signupUrl: '/signup/waste-giver',
      dashboardUrl: '/waste-giver/dashboard',
      features: ['QR Source Identity', 'Green Coin Rewards', 'Grocery Redemption', 'Food Donation']
    },
    {
      roleKey: 'collector',
      title: '2. Collector',
      badge: 'Municipal & Authorized Pickers',
      description: 'Doorstep QR verification, calibrated weight logging, segregation verification, and optimized pickup routes across municipal sectors.',
      icon: Truck,
      color: 'blue',
      isPublic: false,
      loginUrl: '/login/collector',
      signupUrl: '/signup/collector',
      dashboardUrl: '/collector/dashboard',
      features: ['QR Camera Scanner', 'On-Site Weigh Logger', 'Zone Pickup Requests']
    },
    {
      roleKey: 'buyer',
      title: '3. B2B Recycler / Industry',
      badge: 'Recyclers, Manufacturers, Processors',
      description: 'Browse verified quality-graded recovered material inventory (PET, Cardboard, E-Waste, Biochar) & place commercial orders.',
      icon: Store,
      color: 'purple',
      isPublic: false,
      loginUrl: '/login/buyer',
      signupUrl: '/signup/buyer',
      dashboardUrl: '/buyer/dashboard',
      features: ['B2B Marketplace', 'Batch Traceability', 'Direct Escrow Orders']
    },
    {
      roleKey: 'ngo',
      title: '4. NGO / Food Rescue',
      badge: 'Verified Welfare & Relief Foundations',
      description: 'Review surplus unserved fresh meals listed by restaurants & cafeterias, accept donations, and dispatch rapid doorstep logistics.',
      icon: Heart,
      color: 'amber',
      isPublic: false,
      loginUrl: '/login/ngo',
      signupUrl: '/signup/ngo',
      dashboardUrl: '/ngo/dashboard',
      features: ['Food Rescue Alerts', 'Doorstep Pickup Scheduler', 'Meals Impact Tracker']
    },
    {
      roleKey: 'admin',
      title: '5. System Admin',
      badge: 'Platform Directorate & Operations',
      description: 'Complete 360° ecosystem oversight: manage recovery centres, digital inventory publishing, coin issuance rates, batch audits & civic watch reports.',
      icon: ShieldCheck,
      color: 'rose',
      isPublic: false,
      loginUrl: '/login/admin',
      signupUrl: null,
      dashboardUrl: '/admin/dashboard',
      features: ['Civic Grievances Triage', 'RRC Dock Operations', 'Monetization & Revenue', 'End-to-End Traceability']
    },
    {
      roleKey: 'civicwatch',
      title: '6. Civic Watch Portal',
      badge: 'Public Citizen Portal • Zero Login Required',
      description: 'Empowering citizens to report roadside waste dumping, overflowing bins, and civic hazards with live GPS pinpointing & photo upload. Completely open — no registration or login required.',
      icon: Camera,
      color: 'teal',
      isPublic: true,
      directUrl: '/civicwatch',
      reportUrl: '/civicwatch/report',
      features: ['1-Click Photo & AI Triage', 'Automatic GPS Tagging', 'Live Issue Status Tracker', 'Zero Citizen Login Required']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-12 relative overflow-hidden flex flex-col justify-between cleantech-grid-bg">
      {/* Background glow */}
      <div className="hero-glow top-0 left-1/2 -translate-x-1/2 opacity-20"></div>

      <div className="max-w-6xl mx-auto w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Leaf className="w-4 h-4" />
              <span>Smart Waste-to-Value Ecosystem</span>
            </div>

            <NavLink
              to="/about"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>About Platform</span>
            </NavLink>

            <NavLink
              to="/civicwatch"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 hover:text-white text-xs font-bold transition-all shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-teal-400" />
              <span>Civic Watch Portal (No Login)</span>
            </NavLink>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
            Select Your Portal in <span className="eco-gradient-text">REVastra</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Choose your role to access specialized workflows, or access the public Civic Watch portal directly without any login.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.roleKey}
                className={`glass-panel p-6 rounded-3xl border transition-all flex flex-col justify-between group shadow-lg ${
                  r.isPublic
                    ? 'border-teal-500/50 hover:border-teal-400 bg-gradient-to-b from-slate-900/90 via-teal-950/20 to-slate-900/90'
                    : 'border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-slate-900 border ${
                      r.isPublic ? 'border-teal-500/40 text-teal-400 group-hover:bg-teal-500/10' : 'border-slate-800 text-emerald-400 group-hover:bg-emerald-500/10'
                    } transition-colors`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.isPublic
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 animate-pulse'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {r.isPublic ? 'Public Portal' : 'Partition'}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-white font-heading">{r.title}</h3>
                  <p className={`text-xs font-medium mt-0.5 ${r.isPublic ? 'text-teal-400' : 'text-emerald-400'}`}>{r.badge}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">{r.description}</p>

                  <div className="mt-4 space-y-1.5">
                    {r.features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${r.isPublic ? 'text-teal-400' : 'text-emerald-400'}`} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2.5">
                  {r.isPublic ? (
                    <>
                      <NavLink
                        to={r.directUrl}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-xs font-extrabold text-white shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Open Civic Watch (No Login)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </NavLink>
                      <NavLink
                        to={r.reportUrl}
                        className="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-teal-300 border border-teal-500/30 hover:border-teal-500/60 transition-colors block"
                      >
                        Report Roadside Dumping Directly
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to={r.loginUrl}
                        className="w-full py-2.5 rounded-xl eco-gradient-btn text-xs font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Sign In to {r.roleKey === 'admin' ? 'Admin Directorate' : r.roleKey.replace('-', ' ').toUpperCase()}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </NavLink>

                      <button
                        type="button"
                        onClick={() => handleQuickDemo(r.roleKey, r.dashboardUrl)}
                        className="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors block cursor-pointer"
                      >
                        ⚡ Instant Access (Demo Login)
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-slate-500">
        REVastra Platform • Smart Circular Waste-to-Value Infrastructure
      </footer>
    </div>
  );
}
