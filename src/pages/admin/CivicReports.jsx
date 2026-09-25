import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
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
  Camera,
  Image as ImageIcon,
  Building2,
  ExternalLink,
  Eye,
  X
} from 'lucide-react';

export function AdminCivicReports() {
  const { civicReports, forwardCivicReportToRRC } = useData();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const reports = civicReports || [];

  // Metrics
  const totalReports = reports.length;
  const newReports = reports.filter((r) => r.status === 'Reported').length;
  const inProgressReports = reports.filter((r) => r.status === 'Assigned' || r.status === 'Cleanup in Progress').length;
  const resolvedReports = reports.filter((r) => r.status === 'Cleaned' || r.status === 'Closed').length;

  const filteredReports = reports.filter((r) => {
    if (!r) return false;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesWaste = wasteTypeFilter === 'ALL' || (r.wasteType && r.wasteType.toLowerCase().includes(wasteTypeFilter.toLowerCase()));
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch =
      !searchLower ||
      (r.reportId || '').toLowerCase().includes(searchLower) ||
      (r.address || '').toLowerCase().includes(searchLower) ||
      (r.wasteType || '').toLowerCase().includes(searchLower) ||
      (r.ward && r.ward.toLowerCase().includes(searchLower)) ||
      (r.concernedMunicipality && r.concernedMunicipality.toLowerCase().includes(searchLower));

    return matchesStatus && matchesWaste && matchesSearch;
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
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Civic Watch Command & Grievance Triage</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-heading">
            Civic Watch Incident Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Monitor incoming citizen roadside dumping reports in real time, review uploaded photo evidence & GPS coordinates, dispatch cleanup response teams, and route recoverable waste to Resource Recovery Centres.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10">
          <NavLink
            to="/civicwatch"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>Open Public CivicWatch</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
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

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reports</span>
            <Camera className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalReports}</div>
          <p className="text-[11px] text-slate-400 font-medium">Logged via public CivicWatch</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-rose-500/30 bg-rose-950/10 space-y-2">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-rose-300 font-mono">{newReports}</div>
          <p className="text-[11px] text-rose-400/80 font-medium">Awaiting team dispatch</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 bg-amber-950/10 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Cleanups</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-mono">{inProgressReports}</div>
          <p className="text-[11px] text-amber-400/80 font-medium">Field teams on site</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved & Cleaned</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-300 font-mono">{resolvedReports}</div>
          <p className="text-[11px] text-emerald-400/80 font-medium">Verified with after-photos</p>
        </div>
      </div>

      {/* INTERACTIVE DUMPING MAP */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" />
              <span>Live Geographic Incident Map</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive GPS pins of all reported waste dumping locations across city sectors.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-400 font-bold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 w-fit">
            {filteredReports.length} Sites Mapped
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-800">
          <InteractiveMap height="320px" markers={mapMarkers} />
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Street, Ward, Waste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:border-teal-400 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Status:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {['ALL', 'Reported', 'Assigned', 'Cleanup in Progress', 'Cleaned'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* REPORTS LISTING GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Showing {filteredReports.length} of {totalReports} Total Reports
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">No Reports Matching Filters</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your status or search terms to inspect other logged roadside incidents.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.reportId}
                className="glass-panel p-5 rounded-3xl border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-teal-400 tracking-wider">
                      {report.reportId}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadgeStyle(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {/* Citizen Uploaded Image with Click to Zoom Lightbox */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 group/img">
                    <img
                      src={report.photoUrl}
                      alt="Reported dumping"
                      className="w-full h-40 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => setSelectedImageModal(report.photoUrl)}
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-teal-300 border border-teal-500/30 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Citizen Photo
                    </div>
                    <button
                      onClick={() => setSelectedImageModal(report.photoUrl)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-white text-xs opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Photo
                    </button>
                  </div>

                  {/* Incident Details */}
                  <div className="space-y-1.5 text-xs">
                    <h4 className="font-bold text-white line-clamp-1">{report.address}</h4>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{report.ward || report.area || 'Zone Sector'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>
                        Waste Category: <strong className="text-slate-200">{report.wasteType}</strong>
                      </span>
                    </div>

                    {report.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-950/40 p-2 rounded-xl border border-slate-800/60 mt-1">
                        "{report.description}"
                      </p>
                    )}

                    {report.assignedTeam && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-400 pt-1 font-semibold">
                        <Truck className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{report.assignedTeam.teamName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">{report.reportedAt}</span>
                  <button
                    onClick={() => navigate(`/admin/civic-reports/${report.reportId}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>Manage & Triage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL PHOTO LIGHTBOX MODAL */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImageModal(null)}
        >
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 hover:bg-rose-600 text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImageModal}
              alt="Full evidence"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="p-3 text-center text-xs text-slate-400">
              Verified Citizen Uploaded Photo Evidence
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
