import React, { useState, useEffect } from 'react';
import { useSearchParams, NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Repeat,
  Sparkles,
  Leaf,
  Calendar,
  Image as ImageIcon,
  Check,
  Copy,
  ChevronRight
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'Reported', label: 'Reported', desc: 'Incident submitted by citizen with GPS & photo' },
  { key: 'Verified', label: 'Verified', desc: 'Municipal sanitation officer inspected & confirmed' },
  { key: 'Assigned', label: 'Assigned', desc: 'Dispatched to Municipal Cleanup Quick Response Team' },
  { key: 'Cleanup in Progress', label: 'Cleanup in Progress', desc: 'Field sanitation marshals active on site' },
  { key: 'Cleaned', label: 'Cleaned', desc: 'Dumping cleared & resolution photo uploaded' },
  { key: 'Closed', label: 'Closed', desc: 'Site cleared & waste routed for scientific recovery' }
];

export function CivicWatchTrack() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'RV-CW-0001';
  const { civicReports } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(initialId);
  const [selectedReportId, setSelectedReportId] = useState(initialId);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const idFromParam = searchParams.get('id');
    if (idFromParam) {
      setSelectedReportId(idFromParam);
      setSearchQuery(idFromParam);
    }
  }, [searchParams]);

  const reports = civicReports || [];
  const activeReport = reports.find(
    (r) => r.reportId.toUpperCase() === selectedReportId.trim().toUpperCase()
  ) || reports[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (clean) {
      setSelectedReportId(clean);
      setSearchParams({ id: clean });
    }
  };

  const handleSelectQuickId = (id) => {
    setSelectedReportId(id);
    setSearchQuery(id);
    setSearchParams({ id });
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Reported':
        return 0;
      case 'Verified':
        return 1;
      case 'Assigned':
        return 2;
      case 'Cleanup in Progress':
        return 3;
      case 'Cleaned':
        return 4;
      case 'Closed':
        return 5;
      default:
        return 0;
    }
  };

  const currentStepIdx = activeReport ? getStepIndex(activeReport.status) : 0;

  const handleCopyId = () => {
    if (activeReport) {
      navigator.clipboard.writeText(activeReport.reportId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 cleantech-grid-bg relative overflow-x-hidden selection:bg-teal-500 selection:text-white pb-16">
      {/* Ambient glow */}
      <div className="hero-glow top-0 left-1/2 -translate-x-1/2 opacity-25"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-teal-500/20 h-16">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <NavLink to="/civicwatch" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-md">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-black text-white font-heading">
                REV<span className="text-teal-400">astra</span> CivicWatch
              </span>
            </div>
          </NavLink>

          <div className="flex items-center gap-3">
            <NavLink
              to="/civicwatch/report"
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Report New Dumping</span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8 relative z-10">
        {/* Title and Search Bar */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            Public Incident Status Tracker
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">
            Track Roadside Dumping Cleanup
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your unique Report ID to see live municipal verification, team assignment, and resolution proof.
          </p>

          <form onSubmit={handleSearchSubmit} className="glass-panel p-2 rounded-2xl border border-slate-800 flex items-center gap-2 shadow-2xl bg-slate-900/80">
            <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Search Report ID (e.g. RV-CW-0001)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full px-2 uppercase font-mono font-bold"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-xs shrink-0 transition-all shadow-md"
            >
              Search
            </button>
          </form>

          {/* Quick Demo ID Jump Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-semibold">Demo Incidents:</span>
            {reports.slice(0, 5).map((r) => (
              <button
                key={r.reportId}
                type="button"
                onClick={() => handleSelectQuickId(r.reportId)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                  activeReport?.reportId === r.reportId
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {r.reportId} <span className="text-[10px] font-sans font-normal opacity-80">({r.status})</span>
              </button>
            ))}
          </div>
        </div>

        {activeReport ? (
          <div className="space-y-6 animate-fadeIn">
            {/* ========================================================
                REPORT SUMMARY HEADER
                ======================================================== */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-teal-400 tracking-tight">
                      {activeReport.reportId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copy ID"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Reported on {activeReport.reportedAt} • Public Citizen Entry
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Current Status:</span>
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-sm ${
                      activeReport.status === 'Cleaned' || activeReport.status === 'Closed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                        : activeReport.status === 'Cleanup in Progress'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : activeReport.status === 'Assigned'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    }`}
                  >
                    {activeReport.status}
                  </span>
                </div>
              </div>

              {/* ========================================================
                  6-STEP PROGRESS TIMELINE
                  ======================================================== */}
              <div className="py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-400" /> Municipal Resolution Workflow:
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const isUpcoming = idx > currentStepIdx;

                    return (
                      <div
                        key={step.key}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-teal-500/20 border-teal-400 shadow-lg shadow-teal-500/10'
                            : isCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-slate-950/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : isCurrent ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></div>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                            )}
                          </div>
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-teal-300' : isCompleted ? 'text-emerald-300' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ========================================================
                BEFORE & AFTER EVIDENCE PHOTO SHOWCASE
                ======================================================== */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading">
                      Visual Evidence Comparison (Before & After)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Transparent resolution proof verified by municipal sanitation officers
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Before Photo (Citizen Report) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase">
                      BEFORE • Citizen Report
                    </span>
                    <span className="text-[11px] text-slate-400">{activeReport.reportedAt}</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                      src={activeReport.photoUrl}
                      alt="Reported dumping"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "{activeReport.description || 'Reported roadside dumping site'}"
                  </p>
                </div>

                {/* After Photo (Resolution) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                        activeReport.resolutionPhotoUrl
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {activeReport.resolutionPhotoUrl ? 'AFTER • Cleaned Resolution' : 'AFTER • Resolution Pending'}
                    </span>
                    {activeReport.cleanedAt && (
                      <span className="text-[11px] text-emerald-400 font-semibold">{activeReport.cleanedAt}</span>
                    )}
                  </div>

                  {activeReport.resolutionPhotoUrl ? (
                    <div className="rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950 shadow-lg shadow-emerald-500/10">
                      <img
                        src={activeReport.resolutionPhotoUrl}
                        alt="Cleaned dumping site"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 rounded-2xl bg-slate-950/80 border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <Clock className="w-10 h-10 text-amber-400 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">Cleanup in Progress</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                          {activeReport.assignedTeam
                            ? `Assigned to ${activeReport.assignedTeam.teamName}. Resolution photo will appear here once cleaned.`
                            : 'Municipal officers are verifying the incident to dispatch a sanitation crew.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeReport.resolutionPhotoUrl && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Site verified fully cleaned and restored</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================
                LOCATION & MUNICIPAL JURISDICTION CARD
                ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Details */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading">Reported Location & Ward</h3>
                    <p className="text-xs text-slate-400">GPS verified geolocation</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Address / Street</span>
                    <p className="font-semibold text-white mt-0.5">{activeReport.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">GPS Coordinates</span>
                      <p className="font-mono text-teal-300 font-bold mt-0.5">
                        {Number(activeReport.latitude).toFixed(4)}, {Number(activeReport.longitude).toFixed(4)}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ward Sector</span>
                      <p className="font-semibold text-white mt-0.5 line-clamp-1">{activeReport.ward}</p>
                    </div>
                  </div>

                  {activeReport.landmark && (
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Landmark</span>
                      <p className="text-slate-300 mt-0.5">{activeReport.landmark}</p>
                    </div>
                  )}

                  {/* Leaflet Map */}
                  <div className="pt-1">
                    <InteractiveMap
                      height="180px"
                      markers={[
                        {
                          lat: Number(activeReport.latitude),
                          lng: Number(activeReport.longitude),
                          label: `${activeReport.reportId}: ${activeReport.address}`
                        }
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Municipal Dispatch & Circular Recovery */}
              <div className="space-y-6">
                {/* Municipal Dispatch */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-heading">Concerned Authority</h3>
                      <p className="text-xs text-slate-400">Responsible Urban Local Body</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Municipality / ULB</span>
                      <p className="font-bold text-white text-sm mt-0.5">{activeReport.concernedMunicipality}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Waste Type</span>
                      <p className="font-bold text-purple-300 mt-0.5">{activeReport.wasteType}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Sanitation Team</span>
                      <p className="font-semibold text-white mt-0.5">
                        {activeReport.assignedTeam ? activeReport.assignedTeam.teamName : 'Pending Team Assignment'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Circular Recovery Card */}
                <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-purple-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Repeat className="w-4 h-4 text-purple-400" /> Circular Recovery Potential
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 text-[10px] font-bold uppercase border border-purple-500/40">
                      {activeReport.recoveryPotential || 'Pending'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeReport.forwardedToRRC
                      ? `✅ Recoverable materials from this dumping site were forwarded to REVastra Resource Recovery Centre (RRC) for secondary segregation, grading, and digital B2B marketplace listing.`
                      : `Once collected, recoverable dry recyclables from this site will be forwarded into ReVastra Resource Recovery Centres rather than dumped in landfills.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Report Not Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We could not find a report with ID "{selectedReportId}". Please double check your Report ID or submit a new report.
            </p>
            <NavLink
              to="/civicwatch/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>Report Roadside Dumping</span>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
