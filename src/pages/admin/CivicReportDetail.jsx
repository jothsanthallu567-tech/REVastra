import React, { useState, useRef } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
  MapPin,
  Camera,
  Clock,
  CheckCircle2,
  Truck,
  Layers,
  ArrowRight,
  ChevronLeft,
  Upload,
  AlertCircle,
  Repeat,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  Boxes,
  X,
  Plus,
  Eye
} from 'lucide-react';

const CLEANUP_TEAMS = [
  { id: 'TEAM-03', name: 'Municipal Quick Response Team 03 - East Sanitation', vehicle: 'KA-01-M-8840 (Mini-Tipper)' },
  { id: 'TEAM-07', name: 'South Zone Rapid Sweepers Unit 07', vehicle: 'KA-05-M-4211 (Hydraulic Tipper)' },
  { id: 'TEAM-12', name: 'Heavy Debris Clearing Squad 12', vehicle: 'KA-03-M-9022 (Loader Truck)' },
  { id: 'TEAM-09', name: 'North Tech Sanitation Squad 09', vehicle: 'KA-04-M-3301 (Waste Van)' }
];

export function CivicReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    civicReports,
    verifyCivicReport,
    assignCivicReportTeam,
    startCivicReportCleanup,
    completeCivicReportCleanup,
    closeCivicReport,
    forwardCivicReportToRRC
  } = useData();

  const report = (civicReports || []).find((r) => r.reportId === id) || (civicReports || [])[0];

  // Action Modals State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(CLEANUP_TEAMS[0].id);
  const [assignNotes, setAssignNotes] = useState('');

  const [showCleanedModal, setShowCleanedModal] = useState(false);
  const [resolutionPhoto, setResolutionPhoto] = useState(
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600'
  );
  const [recoveryPotential, setRecoveryPotential] = useState('Recoverable');
  const resolutionFileInputRef = useRef(null);

  const [showRrcModal, setShowRrcModal] = useState(false);
  const [estimatedRrcWeight, setEstimatedRrcWeight] = useState('45');
  const [rrcSuccessMsg, setRrcSuccessMsg] = useState('');
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  if (!report) {
    return (
      <div className="p-8 glass-panel rounded-3xl text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Report Not Found</h2>
        <NavLink to="/admin/civic-reports" className="text-teal-400 font-bold hover:underline">
          Return to Civic Reports
        </NavLink>
      </div>
    );
  }

  // Strict Workflow Actions
  const handleVerify = () => {
    verifyCivicReport(report.reportId, 'Verified by System Admin Directorate');
  };

  const handleAssignTeam = (e) => {
    e.preventDefault();
    const team = CLEANUP_TEAMS.find((t) => t.id === selectedTeamId) || CLEANUP_TEAMS[0];
    assignCivicReportTeam(report.reportId, {
      teamId: team.id,
      teamName: team.name,
      notes: assignNotes || `Dispatched vehicle: ${team.vehicle}`
    });
    setShowAssignModal(false);
  };

  const handleStartCleanup = () => {
    startCivicReportCleanup(report.reportId);
  };

  const handleMarkCleaned = (e) => {
    e.preventDefault();
    completeCivicReportCleanup(report.reportId, {
      resolutionPhotoUrl: resolutionPhoto,
      recoveryPotential
    });
    setShowCleanedModal(false);
  };

  const handleCloseReport = () => {
    closeCivicReport(report.reportId);
  };

  const handleForwardToRRC = (e) => {
    e.preventDefault();
    const intake = forwardCivicReportToRRC(report.reportId, {
      estimatedQty: Number(estimatedRrcWeight) || 45,
      materialCategory: 'mat-plastic',
      recoveryCentreId: 'rc-alpha-01'
    });
    setShowRrcModal(false);
    setRrcSuccessMsg(`Successfully forwarded ${estimatedRrcWeight} kg to RRC Dock #2! Intake ID: ${intake?.id}`);
  };

  // Resolution photo file upload handler
  const handleResolutionPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResolutionPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/civic-reports')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Civic Grievances</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Incident Tracking ID:</span>
          <span className="font-mono text-xs font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/30">
            {report.reportId}
          </span>
        </div>
      </div>

      {rrcSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{rrcSuccessMsg}</span>
          </div>
          <NavLink
            to="/recovery-centre/segregation"
            className="text-xs text-white underline hover:text-emerald-200"
          >
            View in RRC Dock →
          </NavLink>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photo Evidence & Location Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Photo Evidence Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" />
                <span>Uploaded Citizen Photo Evidence</span>
              </h3>
              <span className="text-[11px] text-teal-400 font-mono font-semibold">
                Reported: {report.reportedAt}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Photo */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Incident Photo (Before)
                </span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 group">
                  <img
                    src={report.photoUrl}
                    alt="Incident Before"
                    className="w-full h-56 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImageModal(report.photoUrl)}
                  />
                  <button
                    onClick={() => setSelectedImageModal(report.photoUrl)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Full Photo
                  </button>
                </div>
              </div>

              {/* After Photo (if resolved) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Resolution Proof (After)
                </span>
                {report.resolutionPhotoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 group">
                    <img
                      src={report.resolutionPhotoUrl}
                      alt="Resolution After"
                      className="w-full h-56 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => setSelectedImageModal(report.resolutionPhotoUrl)}
                    />
                    <div className="absolute top-2 right-2 bg-emerald-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                      Cleaned
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-56 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-400 p-4 text-center space-y-2">
                    <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
                    <p className="text-xs font-semibold text-slate-300">Cleanup In Progress</p>
                    <p className="text-[10px] text-slate-400">
                      Proof photo will appear after team completes remediation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location & Ward Info */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Location & GPS Geotag</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Exact Address</span>
                <p className="font-semibold text-white mt-1">{report.address}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Ward / Sector</span>
                <p className="font-semibold text-white mt-1">{report.ward || report.area}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">GPS Coordinates</span>
                <p className="font-mono font-bold text-teal-300 mt-1">
                  {Number(report.latitude).toFixed(5)}, {Number(report.longitude).toFixed(5)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Landmark</span>
                <p className="text-slate-300 mt-1">{report.landmark || 'Not specified'}</p>
              </div>
            </div>

            {/* Map Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 mt-2">
              <InteractiveMap
                height="220px"
                markers={[
                  {
                    lat: Number(report.latitude) || 12.9784,
                    lng: Number(report.longitude) || 77.6408,
                    label: `${report.reportId}: ${report.wasteType} at ${report.address}`
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Triage Actions, Status Pipeline & Workflow */}
        <div className="lg:col-span-5 space-y-6">
          {/* Current Status Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-400">Current Lifecycle Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                {report.status}
              </span>
            </div>

            {/* Workflow Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {report.status === 'Reported' && (
                <button
                  onClick={handleVerify}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Verify Incident Legitimacy</span>
                </button>
              )}

              {(report.status === 'Reported' || report.status === 'Verified') && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>2. Dispatch Sanitation Response Team</span>
                </button>
              )}

              {report.status === 'Assigned' && (
                <button
                  onClick={handleStartCleanup}
                  className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>3. Mark Cleanup Underway on Site</span>
                </button>
              )}

              {report.status === 'Cleanup in Progress' && (
                <button
                  onClick={() => setShowCleanedModal(true)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>4. Upload Resolution Proof & Mark Cleaned</span>
                </button>
              )}

              {report.status === 'Cleaned' && (
                <button
                  onClick={handleCloseReport}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>5. Finalize & Close Grievance File</span>
                </button>
              )}

              {/* RRC Circular Recovery Forwarding */}
              {!report.forwardedToRRC ? (
                <button
                  onClick={() => setShowRrcModal(true)}
                  className="w-full py-3 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Forward Waste to RRC Recovery Dock</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-purple-400" />
                    <span>Forwarded to RRC Dock</span>
                  </div>
                  <span className="font-mono text-[10px]">{report.rrcCollectionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Cleanup Squad Card */}
          {report.assignedTeam && (
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-purple-950/10 space-y-3">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Dispatched Cleanup Unit
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">{report.assignedTeam.teamName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{report.assignedTeam.notes}</p>
              </div>
            </div>
          )}

          {/* AI Waste Triage & Yield Estimate */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Severity & Recovery Assessment
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Grade A Segregation
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Waste Category</span>
                <span className="font-bold text-white mt-0.5 block">{report.wasteType}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Yield</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">35 - 55 kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISPATCH CLEANUP TEAM MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 bg-slate-900 max-w-lg w-full space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Dispatch Cleanup Squad</h3>
                  <p className="text-xs text-slate-400">Assign authorized sanitation team to {report.reportId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignTeam} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Select Sanitation Team</label>
                <div className="space-y-2">
                  {CLEANUP_TEAMS.map((team) => (
                    <label
                      key={team.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedTeamId === team.id
                          ? 'bg-purple-500/15 border-purple-500/50 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="team"
                          value={team.id}
                          checked={selectedTeamId === team.id}
                          onChange={() => setSelectedTeamId(team.id)}
                          className="text-purple-600 focus:ring-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{team.name}</p>
                          <p className="text-[11px] text-slate-400">{team.vehicle}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Special Dispatch Instructions</label>
                <textarea
                  rows={2}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="e.g. Bring hydraulic compactor and PPE for hazardous items..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLUTION PROOF MODAL */}
      {showCleanedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 bg-slate-900 max-w-lg w-full space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Upload Resolution Proof</h3>
                  <p className="text-xs text-slate-400">Mark dumping site cleaned with photo evidence</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCleanedModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMarkCleaned} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Cleaned Site Photo (After)</label>
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 mb-2">
                  <img src={resolutionPhoto} alt="Cleaned site preview" className="w-full h-44 object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => resolutionFileInputRef.current?.click()}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-teal-400" />
                  <span>Choose / Snap After Photo</span>
                </button>
                <input
                  type="file"
                  ref={resolutionFileInputRef}
                  accept="image/*"
                  onChange={handleResolutionPhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCleanedModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
                >
                  Submit Proof & Resolve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RRC RECOVERY MODAL */}
      {showRrcModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 bg-slate-900 max-w-lg w-full space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Forward Waste to RRC</h3>
                  <p className="text-xs text-slate-400">Route recovered waste to Resource Recovery Centre Dock</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRrcModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleForwardToRRC} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Destination RRC Facility</label>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200">
                  <span className="font-bold text-teal-300 block">RRC Alpha Central Facility (Indiranagar Zone)</span>
                  <span className="text-[11px] text-slate-400">Secondary Segregation & B2B Packaging Dock #2</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Estimated Net Material Weight (kg)</label>
                <input
                  type="number"
                  value={estimatedRrcWeight}
                  onChange={(e) => setEstimatedRrcWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRrcModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold shadow-lg shadow-teal-500/30"
                >
                  Transfer to RRC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
