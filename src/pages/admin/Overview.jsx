import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { WasteTrendChart } from '../../components/charts/WasteTrendChart';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { MaterialDistributionChart } from '../../components/charts/MaterialDistributionChart';
import {
  Users,
  Truck,
  Building2,
  Boxes,
  Store,
  Coins,
  Heart,
  DollarSign,
  BarChart3,
  FileCheck2,
  Cpu,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function AdminOverview() {
  const { data } = useData();
  const impact = data.impactMetrics;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Urban Waste Management Directorate • Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            REVastra Ecosystem Overview
          </h1>
          <p className="text-xs text-slate-400">
            Real-time monitoring of waste givers, collectors, Resource Recovery Centres, B2B sales, and batch traceability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/admin/traceability"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <span>Batch Traceability</span>
          </NavLink>

          <NavLink
            to="/admin/revenue"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>Revenue Center</span>
          </NavLink>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Waste Collected"
          value={`${(impact.totalWasteCollectedKg / 1000).toFixed(1)} Tons`}
          subtext={`${impact.totalWasteCollectedKg.toLocaleString()} kg total`}
          icon={Truck}
          color="emerald"
        />
        <StatCard
          title="Landfill Diversion Rate"
          value={`${impact.landfillDiversionPercent}%`}
          subtext="Target: 95.0% achieved"
          icon={BarChart3}
          color="cyan"
        />
        <StatCard
          title="Marketplace Revenue"
          value={`₹${(impact.totalMarketplaceRevenueRupees / 100000).toFixed(2)} Lakhs`}
          subtext={`₹${impact.totalMarketplaceRevenueRupees.toLocaleString()} INR`}
          icon={DollarSign}
          color="amber"
        />
        <StatCard
          title="Green Coins Distributed"
          value={impact.greenCoinsIssuedTotal.toLocaleString()}
          subtext={`₹${(impact.greenCoinsIssuedTotal / 100).toLocaleString()} value`}
          icon={Coins}
          color="purple"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Monetization & Revenue Trend</h3>
            <NavLink to="/admin/revenue" className="text-xs text-emerald-400 hover:underline font-semibold">
              View Financials →
            </NavLink>
          </div>
          <div className="h-64">
            <RevenueChart height={240} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Recovered Materials</h3>
            <Boxes className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="h-64">
            <MaterialDistributionChart height={240} />
          </div>
        </div>
      </div>

      {/* Secondary Modules Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
        <NavLink to="/admin/users" className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" /> User Directory
        </NavLink>
        <NavLink to="/admin/collections" className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-2">
          <Truck className="w-5 h-5 text-blue-400" /> Collections
        </NavLink>
        <NavLink to="/admin/recovery-centres" className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-2">
          <Building2 className="w-5 h-5 text-teal-400" /> Recovery Centres
        </NavLink>
        <NavLink to="/admin/inventory" className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-2">
          <Boxes className="w-5 h-5 text-purple-400" /> Digital Inventory
        </NavLink>
        <NavLink to="/admin/coin-rules" className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" /> Coin Rules
        </NavLink>
        <NavLink to="/admin/ai-suite" className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-2">
          <Cpu className="w-5 h-5 text-rose-400" /> AI Suite
        </NavLink>
      </div>
    </div>
  );
}

function ShieldCheck(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
