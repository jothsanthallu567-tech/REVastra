import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLiveLocation } from '../../hooks/useLiveLocation';
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
  ArrowRight,
  ShieldCheck,
  MapPin,
  Loader2,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function AdminOverview() {
  const { data, civicReports } = useData();
  const impact = data.impactMetrics;
  const { municipality, loading: locLoading, getLocation } = useLiveLocation();

  const reports = civicReports || [];
  const pendingCivicCount = reports.filter((r) => r.status === 'Reported' || r.status === 'Assigned').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Urban Waste Management Directorate • Admin Control Center</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Operating Zone:</span>
            {municipality ? (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                {municipality}
              </span>
            ) : (
              <button 
                onClick={getLocation} 
                disabled={locLoading}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
              >
                {locLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                {locLoading ? 'Locating Nearest Zone...' : 'Auto-Locate Zone'}
              </button>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            REVastra Ecosystem Overview
          </h1>
          <p className="text-xs text-slate-400">
            Real-time monitoring of waste givers, collectors, Resource Recovery Centres, B2B sales, batch traceability, and Civic Watch reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/admin/civic-reports"
            className="px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-xs font-bold text-teal-300 border border-teal-500/40 transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-teal-400" />
            <span>Civic Grievances ({pendingCivicCount})</span>
          </NavLink>

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
          title="Civic Reports Logged"
          value={reports.length.toString()}
          subtext={`${pendingCivicCount} requiring cleanup`}
          icon={Camera}
          color="rose"
        />
      </div>

      {/* Real-time Civic Watch Grievances Section */}
      <div className="glass-panel p-6 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Civic Watch Incidents & Uploaded Evidence
              </h3>
              <p className="text-xs text-slate-400">
                Citizen-reported roadside dumping photos with verified GPS coordinates.
              </p>
            </div>
          </div>
          <NavLink
            to="/admin/civic-reports"
            className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-xs font-bold text-teal-300 transition-all flex items-center gap-1"
          >
            <span>View All Grievances ({reports.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.slice(0, 3).map((rep) => (
            <NavLink
              key={rep.reportId}
              to={`/admin/civic-reports/${rep.reportId}`}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-400">{rep.reportId}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  rep.status === 'Cleaned' || rep.status === 'Closed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : rep.status === 'Cleanup in Progress'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {rep.status}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden h-28 border border-slate-800 group-hover:border-slate-700">
                <img src={rep.photoUrl} alt="Dumping" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-teal-300 font-mono">
                  {rep.wasteType}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-white truncate">{rep.address}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{rep.ward || rep.area}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-teal-400 font-semibold">
                <span>Inspect Evidence</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </NavLink>
          ))}
        </div>
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
        <NavLink to="/admin/civic-reports" className="glass-panel p-4 rounded-2xl border border-teal-500/30 hover:border-teal-500/60 transition-all text-xs font-semibold text-teal-300 flex flex-col items-center gap-2">
          <Camera className="w-5 h-5 text-teal-400" /> Civic Watch
        </NavLink>
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
        <NavLink to="/admin/ai-suite" className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-2">
          <Cpu className="w-5 h-5 text-rose-400" /> AI Suite
        </NavLink>
      </div>
    </div>
  );
}
