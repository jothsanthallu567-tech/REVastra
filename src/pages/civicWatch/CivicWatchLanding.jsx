import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Camera,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Leaf,
  Layers,
  Repeat,
  Compass,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Building2,
  Eye,
  X,
  Truck
} from 'lucide-react';

export function CivicWatchLanding() {
  const { civicReports } = useData();
  const navigate = useNavigate();
  const [trackIdInput, setTrackIdInput] = useState('');
  const [trackError, setTrackError] = useState('');
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const reports = civicReports || [];
  const totalReports = reports.length;
  const activeCleanups = reports.filter((r) => r && (r.status === 'Cleanup in Progress' || r.status === 'Assigned')).length;
  const cleanedReports = reports.filter((r) => r && (r.status === 'Cleaned' || r.status === 'Closed')).length;

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const clean = trackIdInput.trim().toUpperCase();
    if (!clean) {
      setTrackError('Please enter a valid Report ID (e.g., RV-CW-0001).');
      return;
    }
    navigate(`/civicwatch/track?id=${encodeURIComponent(clean)}`);
  };

  const howItWorksSteps = [
    {
      num: '01',
      title: 'Snap Dumping Photo',
      subtitle: 'Visible Visual Evidence',
      desc: 'Take a clear photograph of illegal roadside garbage, overflowing open bins, or dumped commercial waste.',
      icon: Camera,
      color: 'emerald'
    },
    {
      num: '02',
      title: 'Automatic GPS Pin',
      subtitle: 'Precise Geolocation',
      desc: 'Device coordinates pinpoint the exact street, ward boundary, and identify the concerned sanitation sector.',
      icon: MapPin,
      color: 'teal'
    },
    {
      num: '03',
      title: 'Rapid Cleanup Action',
      subtitle: 'Team Dispatch & Triage',
      desc: 'Sanitation response squads are dispatched with specialized collection equipment to clean the site.',
      icon: Truck,
      color: 'blue'
    },
    {
      num: '04',
      title: 'Circular Recovery',
      subtitle: 'RRC Secondary Value',
      desc: 'Recoverable waste is forwarded into ReVastra Resource Recovery Centres for grading, recycling, and B2B trade.',
      icon: Repeat,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 cleantech-grid-bg relative overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="hero-glow top-10 left-1/2 -translate-x-1/2 opacity-25"></div>
      <div className="hero-glow top-[900px] left-1/4 opacity-15"></div>
      <div className="hero-glow top-[2000px] right-1/4 opacity-15"></div>

      {/* TOP NAVIGATION HEADER (PUBLIC ZERO-LOGIN) */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-teal-500/20 h-20">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-teal-500/25">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-heading">
                  REV<span className="text-teal-400">astra</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-extrabold uppercase tracking-wider">
                  CivicWatch
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wide">
                Roadside Dumping Reporting & Rapid Remediation
              </span>
            </div>
          </NavLink>

          <div className="flex items-center gap-3">
            <NavLink
              to="/civicwatch/track"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span>Track Report</span>
            </NavLink>

            <NavLink
              to="/role-selection"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-teal-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              <span>Platform Roles</span>
            </NavLink>

            <NavLink
              to="/civicwatch/report"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-xs font-extrabold shadow-lg shadow-teal-500/25 transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
            >
              <Camera className="w-4 h-4" />
              <span>REPORT DUMPING</span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Public Citizen Grievance Portal • Zero Sign-In or Login Required</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-heading tracking-tight leading-tight">
            See Waste Dumped <br className="hidden sm:inline" />
            on the Road? <span className="eco-gradient-text">Report in 1-Click.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            ReVastra CivicWatch lets any citizen instantly report roadside dumping, overflowing bins, or illegal garbage with mandatory GPS coordinates & live photo proof. No account needed.
          </p>

          {/* Core Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <NavLink
              to="/civicwatch/report"
              id="btn-report-dumping-hero"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-white text-lg font-black tracking-wide shadow-xl shadow-teal-500/30 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
            >
              <Camera className="w-6 h-6 animate-bounce" />
              <span>REPORT ROADSIDE DUMPING</span>
              <ArrowRight className="w-5 h-5" />
            </NavLink>

            <NavLink
              to="/civicwatch/track"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-teal-500/50 text-slate-200 hover:text-white text-base font-bold transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5 text-teal-400" />
              <span>Track Existing Report</span>
            </NavLink>
          </div>

          {/* Quick Track Input Box */}
          <div className="pt-6 max-w-lg mx-auto">
            <form onSubmit={handleTrackSubmit} className="glass-panel p-2 rounded-2xl border border-slate-800 flex items-center gap-2 shadow-xl bg-slate-950/80">
              <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
              <input
                type="text"
                placeholder="Enter Report ID to track (e.g. RV-CW-0001)"
                value={trackIdInput}
                onChange={(e) => {
                  setTrackIdInput(e.target.value);
                  setTrackError('');
                }}
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full px-2"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-xs shrink-0 transition-colors"
              >
                Track Status
              </button>
            </form>
            {trackError && <p className="text-rose-400 text-xs mt-2">{trackError}</p>}
          </div>

          {/* Key Impact Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto text-left">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/50">
              <div className="text-2xl font-black text-teal-400 font-mono">{totalReports}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">Total Reports Logged</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/50">
              <div className="text-2xl font-black text-amber-400 font-mono">{activeCleanups}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">Active Cleanups</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/50">
              <div className="text-2xl font-black text-emerald-400 font-mono">{cleanedReports}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">Sites Cleaned</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/50">
              <div className="text-2xl font-black text-purple-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">GPS Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW CIVICWATCH WORKS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">Streamlined Civic Action</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
            How ReVastra CivicWatch Works
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From citizen photo capture to automated GPS routing, team dispatch, and secondary circular recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -right-2 -bottom-2 text-6xl font-black font-mono text-slate-800/30 select-none group-hover:text-teal-500/10 transition-colors">
                  {step.num}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-teal-400 group-hover:bg-teal-500/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">{step.num}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-4 font-heading">{step.title}</h3>
                  <p className="text-xs text-teal-400 font-semibold mt-0.5">{step.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MANDATORY LOCATION REQUIREMENT */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden">
          <div className="hero-glow top-0 right-0 opacity-20"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
            <div className="p-4 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 shrink-0">
              <Compass className="w-10 h-10 animate-spin-slow" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Mandatory Location Accuracy</span>
              </div>
              <h3 className="text-2xl font-black text-white font-heading">
                Why Location Tracking is Mandatory
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Roadside dumping reports cannot be resolved without exact coordinates. When you submit a report, CivicWatch automatically captures your device coordinates to identify the <strong>exact Municipal Ward, Sanitation Zone, and Sector Team</strong> in charge of that area.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Prevents duplicate reports</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Automated Ward routing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>GPS navigation for cleanups</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT RESOLVED SITES (BEFORE & AFTER) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">Verified Proof</span>
            <h2 className="text-3xl font-black text-white font-heading">
              Recent Resolved Dumping Sites
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Transparent community resolution with verified Before & After evidence photos.
            </p>
          </div>

          <NavLink
            to="/civicwatch/track"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-teal-300 hover:text-white transition-colors"
          >
            <span>View All Reports</span>
            <ChevronRight className="w-4 h-4" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.slice(0, 3).map((report) => (
            <div
              key={report.reportId}
              className="glass-panel p-5 rounded-3xl border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-400">{report.reportId}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                      report.status === 'Cleaned' || report.status === 'Closed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : report.status === 'Cleanup in Progress'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                {/* Photo Display (Before & After if available) */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Reported (Before)</span>
                    <img
                      src={report.photoUrl}
                      alt="Reported dumping"
                      className="w-full h-28 object-cover rounded-xl border border-slate-800 group-hover:border-slate-700 cursor-pointer"
                      onClick={() => setSelectedImageModal(report.photoUrl)}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      {report.resolutionPhotoUrl ? 'Cleaned (After)' : 'Awaiting Cleanup'}
                    </span>
                    {report.resolutionPhotoUrl ? (
                      <img
                        src={report.resolutionPhotoUrl}
                        alt="Cleaned dumping site"
                        className="w-full h-28 object-cover rounded-xl border border-emerald-500/40 cursor-pointer"
                        onClick={() => setSelectedImageModal(report.resolutionPhotoUrl)}
                      />
                    ) : (
                      <div className="w-full h-28 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <Clock className="w-5 h-5 text-amber-400 mb-1 animate-pulse" />
                        <span className="text-[10px] font-medium">In Progress</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{report.address}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{report.ward || report.area || 'Zone Sector'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Waste: <strong className="text-slate-200">{report.wasteType}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{report.reportedAt}</span>
                <NavLink
                  to={`/civicwatch/track?id=${report.reportId}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-3 h-3" />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CIRCULAR RECOVERY INTEGRATION BANNER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                <Repeat className="w-3.5 h-3.5" />
                <span>Connected Circular Value Chain</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                Civic Reports Are Connected to ReVastra Recovery Centres
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlike simple complaint portals that dump waste into overflowing landfills, ReVastra routes cleaned roadside waste to <strong>Resource Recovery Centres (RRCs)</strong> for secondary segregation, grading, weighing, and listing on the <strong>B2B Recycler Marketplace</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <NavLink
                to="/civicwatch/report"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-xs font-extrabold shadow-lg shadow-teal-500/30 text-center"
              >
                Report Roadside Dumping
              </NavLink>
              <NavLink
                to="/about"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold text-center"
              >
                Learn About REVastra
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* PUBLIC FOOTER */}
      <footer className="border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 bg-slate-950/90">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <Leaf className="w-4 h-4 text-teal-400" />
            <span>ReVastra CivicWatch</span>
            <span className="text-slate-400 font-normal">• Roadside Dumping Reporting & Rapid Remediation</span>
          </div>

          <div className="text-emerald-400 font-semibold">
            “Report Waste. Help Clean Your City. Recover Its Value.”
          </div>

          <div className="flex items-center gap-4 text-xs">
            <NavLink to="/civicwatch/track" className="hover:text-white transition-colors">Track Report</NavLink>
            <NavLink to="/civicwatch/report" className="hover:text-white transition-colors">Report Dumping</NavLink>
            <NavLink to="/role-selection" className="hover:text-white transition-colors">All Portals</NavLink>
          </div>
        </div>
      </footer>

      {/* PHOTO LIGHTBOX MODAL */}
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
              alt="Evidence preview"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
