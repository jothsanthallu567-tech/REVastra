import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Repeat,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Plus
} from 'lucide-react';

export function MunicipalityDashboard() {
  const { civicReports, forwardCivicReportToRRC } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [wardFilter, setWardFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const reports = civicReports || [];

  // Metrics
  const totalReports = reports.length;
  const newReports = reports.filter((r) => r.status === 'Reported').length;
  const pendingVerification = reports.filter((r) => r.status === 'Reported').length;
  const activeCleanups = reports.filter((r) => r.status === 'Assigned' || r.status === 'Cleanup in Progress').length;
  const completedCleanups = reports.filter((r) => r.status === 'Cleaned' || r.status === 'Closed').length;

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesWard = wardFilter === 'ALL' || (r.ward && r.ward.toLowerCase().includes(wardFilter.toLowerCase()));
    const matchesSearch =
      r.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.ward && r.ward.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesWard && matchesSearch;
  });

  // Map markers
  const mapMarkers = filteredReports.map((r) => ({
    lat: Number(r.latitude) || 12.9784,
    lng: Number(r.longitude) || 77.6408,
    label: `${r.reportId}: ${r.wasteType} at ${r.address} [${r.status}]`
  }));

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Reported':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case 'Verified':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      case 'Assigned':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
      case 'Cleanup in Progress':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse';
      case 'Cleaned':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      case 'Closed':
        return 'bg-slate-700/40 text-slate-300 border-slate-600';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{currentUser?.jurisdiction || 'BBMP Solid Waste Management Directorate • East Zone'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-heading">
            Municipality / ULB Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Review incoming citizen roadside dumping reports, verify incidents, dispatch rapid cleanup teams, upload resolution proof, and route recoverable waste to ReVastra Recovery Centres.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10">
          <NavLink
            to="/civicwatch"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Public CivicWatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>

          <NavLink
            to="/recovery-centre/segregation"
            className="px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>RRC Recovery Dock</span>
          </NavLink>
        </div>
      </div>

      {/* ========================================================
          KPI STAT CARDS
          ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Reports
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalReports}</div>
          <span className="text-[10px] text-teal-400 font-semibold block">All-time logged</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-1">
          <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">
            New Reports
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{newReports}</div>
          <span className="text-[10px] text-rose-300 font-semibold block">Unassigned</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-1">
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
            Pending Verification
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">{pendingVerification}</div>
          <span className="text-[10px] text-blue-300 font-semibold block">Needs officer review</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-1">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
            Active Cleanups
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{activeCleanups}</div>
          <span className="text-[10px] text-amber-300 font-semibold block">Teams dispatched</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
            Completed Cleanups
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{completedCleanups}</div>
          <span className="text-[10px] text-emerald-300 font-semibold block">Cleaned & verified</span>
        </div>
      </div>

      {/* ========================================================
          HOTSPOT LEAFLET MAP
          ======================================================== */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Ward Dumping Hotspot Map</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive geographic cluster of reported illegal dumping sites across municipal sectors
            </p>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2.5 py-1 rounded-lg">
            {mapMarkers.length} Active Pins Displayed
          </span>
        </div>

        <InteractiveMap height="260px" markers={mapMarkers} />
      </div>

      {/* ========================================================
          INCIDENT REPORTS TABLE & TRIAGE
          ======================================================== */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Civic Dumping Reports Management
            </h3>
            <p className="text-xs text-slate-400">
              Select any report to inspect evidence, verify, dispatch cleanup squads, and upload resolution proof
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 w-48">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-400 w-full"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:border-teal-400 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Reported">Reported (New)</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="Cleanup in Progress">Cleanup in Progress</option>
              <option value="Cleaned">Cleaned</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Ward Filter */}
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:border-teal-400 focus:outline-none"
            >
              <option value="ALL">All Wards</option>
              <option value="Domlur">Ward 112 (Domlur/Indiranagar)</option>
              <option value="Koramangala">Ward 151 (Koramangala)</option>
              <option value="HSR">Ward 174 (HSR Layout)</option>
              <option value="Whitefield">Ward 84 (Whitefield)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/40">
                <th className="p-3.5">Report ID & Photo</th>
                <th className="p-3.5">Location & Ward</th>
                <th className="p-3.5">Waste Type</th>
                <th className="p-3.5">Reported Time</th>
                <th className="p-3.5">Assigned Squad</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Recovery</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReports.map((report) => (
                <tr
                  key={report.reportId}
                  className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/municipality/report/${report.reportId}`)}
                >
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={report.photoUrl}
                        alt="Dumping site"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <span className="font-mono font-black text-teal-400 block text-xs group-hover:underline">
                          {report.reportId}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                          {report.landmark || 'Roadside dump'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 max-w-[200px]">
                    <p className="font-semibold text-white truncate">{report.address}</p>
                    <p className="text-[10px] text-slate-400 truncate">{report.ward}</p>
                  </td>

                  <td className="p-3.5">
                    <span className="font-medium text-slate-200">{report.wasteType}</span>
                  </td>

                  <td className="p-3.5 text-slate-400 whitespace-nowrap">
                    {report.reportedAt}
                  </td>

                  <td className="p-3.5">
                    {report.assignedTeam ? (
                      <span className="text-teal-300 font-medium line-clamp-1">
                        {report.assignedTeam.teamName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadgeStyle(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        report.forwardedToRRC
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : report.recoveryPotential === 'Recoverable'
                          ? 'bg-teal-500/15 text-teal-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {report.forwardedToRRC ? 'RRC Forwarded' : report.recoveryPotential || 'Pending'}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/municipality/report/${report.reportId}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No dumping reports found matching your current filters.
          </div>
        )}
      </div>
    </div>
  );
}
