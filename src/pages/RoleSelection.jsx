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
  Building2,
  Lock
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
      loginUrl: '/login/ngo',
      signupUrl: '/signup/ngo',
      dashboardUrl: '/ngo/dashboard',
      features: ['Food Rescue Alerts', 'Doorstep Pickup Scheduler', 'Meals Impact Tracker']
    },
    {
      roleKey: 'admin',
      title: '5. System Admin',
      badge: 'Municipal Directorate & Operations',
      description: 'Complete 360° ecosystem oversight: manage recovery centres, digital inventory publishing, coin issuance rates & immutable batch audits.',
      icon: ShieldCheck,
      color: 'rose',
      loginUrl: '/login/admin',
      signupUrl: null,
      dashboardUrl: '/admin/dashboard',
      features: ['RRC Dock Operations', 'Monetization & Revenue', 'End-to-End Traceability']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-12 relative overflow-hidden flex flex-col justify-between cleantech-grid-bg">
      {/* Background glow */}
      <div className="hero-glow top-0 left-1/2 -translate-x-1/2 opacity-20"></div>

      <div className="max-w-6xl mx-auto w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
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
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
            Select Your User Role in <span className="eco-gradient-text">REVastra</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Choose your role to access specialized dashboards, workflows, and security authorizations tailored to your waste-to-value ecosystem partition.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.roleKey}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-800">
                      Partition
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-white font-heading">{r.title}</h3>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">{r.badge}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">{r.description}</p>

                  <div className="mt-4 space-y-1.5">
                    {r.features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2.5">
                  <NavLink
                    to={r.loginUrl}
                    className="w-full py-2.5 rounded-xl eco-gradient-btn text-xs font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Sign In to {r.roleKey === 'admin' ? 'Admin Directorate' : r.roleKey.replace('-', ' ').toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NavLink>

                  {r.signupUrl && (
                    <NavLink
                      to={r.signupUrl}
                      className="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors block"
                    >
                      Register New Account
                    </NavLink>
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
