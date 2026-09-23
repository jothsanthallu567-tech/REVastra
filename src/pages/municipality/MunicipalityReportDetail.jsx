import React, { useState, useRef } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
  Building2,
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
  Plus
} from 'lucide-react';

const CLEANUP_TEAMS = [
  { id: 'TEAM-03', name: 'Municipal Quick Response Team 03 - East Sanitation', vehicle: 'KA-01-M-8840 (Mini-Tipper)' },
  { id: 'TEAM-07', name: 'South Zone Rapid Sweepers Unit 07', vehicle: 'KA-05-M-4211 (Hydraulic Tipper)' },
  { id: 'TEAM-12', name: 'Heavy Debris Clearing Squad 12', vehicle: 'KA-03-M-9022 (Loader Truck)' },
  { id: 'TEAM-09', name: 'North Tech Sanitation Squad 09', vehicle: 'KA-04-M-3301 (Waste Van)' }
];

export function MunicipalityReportDetail() {
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

  if (!report) {
    return (
      <div className="p-8 glass-panel rounded-3xl text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Report Not Found</h2>
        <NavLink to="/municipality/dashboard" className="text-teal-400 font-bold hover:underline">
          Return to Dashboard
        </NavLink>
      </div>
    );
  }

  // Strict Workflow Actions
  const handleVerify = () => {
    verifyCivicReport(report.reportId, 'Verified by Municipal Sanitation Directorate');
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
          onClick={() => navigate('/municipality/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Municipality Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Status:</span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
            {report.status}
          </span>
        </div>
      </div>

      {rrcSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{rrcSuccessMsg}</span>
          </div>
          <NavLink
            to="/recovery-centre/segregation"
            className="px-3 py-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
          >
            Go to RRC Dock
          </NavLink>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Evidence & Incident Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
                  Civic Incident Record
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading mt-0.5">
                  Report <span className="text-teal-400 font-mono">{report.reportId}</span>
                </h1>
                <p className="text-xs text-slate-300 mt-1">{report.address}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Reported Timestamp</span>
                <span className="text-xs font-mono text-white font-bold">{report.reportedAt}</span>
              </div>
            </div>

            {/* Photos (Before & After) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Visual Evidence Photos:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Original Photo */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-rose-400 block">
                    1. Citizen Report (Before)
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                      src={report.photoUrl}
                      alt="Citizen report photo"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>

                {/* Resolution Photo */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                    2. Resolution Proof (After)
                  </span>
                  {report.resolutionPhotoUrl ? (
                    <div className="rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950">
                      <img
                        src={report.resolutionPhotoUrl}
                        alt="Cleaned resolution photo"
                        className="w-full h-56 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 rounded-2xl bg-slate-950 border border-dashed border-slate-800 flex flex-col items-center justify-center p-4 text-center text-slate-400 text-xs">
                      <Camera className="w-8 h-8 text-slate-400 mb-2 opacity-60" />
                      <span>Resolution photo not uploaded yet.</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Upload once site is cleared.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Incident Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-400" /> Waste Category
                </span>
                <p className="font-bold text-white text-sm">{report.wasteType}</p>
                <p className="text-[11px] text-slate-400">Description: {report.description || 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-400" /> Ward & Landmark
                </span>
                <p className="font-bold text-white">{report.ward}</p>
                <p className="text-[11px] text-slate-400">Landmark: {report.landmark || 'Not specified'}</p>
              </div>
            </div>

            {/* Map Preview */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                GPS Location Marker ({Number(report.latitude).toFixed(5)}, {Number(report.longitude).toFixed(5)}):
              </span>
              <InteractiveMap
                height="180px"
                markers={[
                  {
                    lat: Number(report.latitude),
                    lng: Number(report.longitude),
                    label: `${report.reportId}: ${report.address}`
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Strict Workflow Action Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-teal-500/40 bg-slate-900/80 shadow-2xl space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                Workflow Actions
              </span>
              <h3 className="text-lg font-black text-white font-heading mt-0.5">
                Municipal Action Centre
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Strict sequential status workflow:
                <br />
                <span className="font-mono text-[10px] text-teal-300">
                  Reported → Verified → Assigned → Cleanup → Cleaned → Closed
                </span>
              </p>
            </div>

            {/* Workflow Step 1: Verify */}
            {report.status === 'Reported' && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>Step 1: Verify Incident</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Inspect photo and location validity to approve this report for municipal dispatch.
                </p>
                <button
                  type="button"
                  onClick={handleVerify}
                  id="btn-verify-report"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Verify Incident Report
                </button>
              </div>
            )}

            {/* Workflow Step 2: Assign Team */}
            {report.status === 'Verified' && (
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
                  <Truck className="w-4 h-4" />
                  <span>Step 2: Assign Sanitation Team</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Assign a quick response team and vehicle to clear the reported dumping.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(true)}
                  id="btn-assign-team"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Assign Cleanup Team
                </button>
              </div>
            )}

            {/* Workflow Step 3: Start Cleanup */}
            {report.status === 'Assigned' && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Step 3: Dispatched to {report.assignedTeam?.teamName}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Mark active when field team reaches the dumping site.
                </p>
                <button
                  type="button"
                  onClick={handleStartCleanup}
                  id="btn-start-cleanup"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Start Field Cleanup
                </button>
              </div>
            )}

            {/* Workflow Step 4: Resolution Photo & Mark Cleaned */}
            {report.status === 'Cleanup in Progress' && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Camera className="w-4 h-4" />
                  <span>Step 4: Upload Resolution & Mark Cleaned</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Attach aftermath resolution proof and define recovery potential for circular processing.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCleanedModal(true)}
                  id="btn-mark-cleaned"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Upload Proof & Mark Cleaned
                </button>
              </div>
            )}

            {/* Workflow Step 5: Close Report */}
            {report.status === 'Cleaned' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Step 5: Incident Cleaned • Close Record</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Finalize municipal record audit and mark status as closed.
                </p>
                <button
                  type="button"
                  onClick={handleCloseReport}
                  id="btn-close-report"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Close Incident Report
                </button>
              </div>
            )}

            {report.status === 'Closed' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Incident Fully Resolved & Closed</p>
                <p className="text-[10px] text-slate-400">{report.closedAt || 'Completed'}</p>
              </div>
            )}

            {/* ========================================================
                CIRCULAR VALUE RECOVERY CENTRE CONNECTION
                ======================================================== */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5" /> ReVastra Circular Integration
              </span>

              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Recovery Potential:</span>
                  <span className="font-bold text-purple-300 uppercase">
                    {report.recoveryPotential || 'Pending Assessment'}
                  </span>
                </div>

                {report.forwardedToRRC ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center justify-between">
                    <span>Forwarded to RRC Dock ({report.rrcCollectionId || 'COL-2026-CIVIC'})</span>
                    <NavLink
                      to="/recovery-centre/segregation"
                      className="text-white underline font-bold"
                    >
                      View Dock
                    </NavLink>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowRrcModal(true)}
                    disabled={report.status === 'Reported' || report.status === 'Verified'}
                    id="btn-forward-rrc"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                      report.status === 'Reported' || report.status === 'Verified'
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
                    }`}
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Forward to Recovery Centre (RRC)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL: ASSIGN TEAM
          ======================================================== */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 bg-slate-900 max-w-md w-full space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-400" /> Assign Cleanup Squad
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignTeam} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Municipal Squad</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                >
                  {CLEANUP_TEAMS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.vehicle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Dispatch Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring hydraulic compactor, 3 sanitation marshals required..."
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: UPLOAD RESOLUTION PROOF & MARK CLEANED
          ======================================================== */}
      {showCleanedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 bg-slate-900 max-w-md w-full space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" /> Resolution Proof & Cleaned Status
              </h3>
              <button
                onClick={() => setShowCleanedModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMarkCleaned} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Resolution Photo (After Cleanup)</label>
                {resolutionPhoto && (
                  <div className="rounded-xl overflow-hidden border border-emerald-500/40 mb-2">
                    <img src={resolutionPhoto} alt="Preview resolution" className="w-full h-36 object-cover" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => resolutionFileInputRef.current?.click()}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload / Take After Photo</span>
                </button>
                <input
                  type="file"
                  ref={resolutionFileInputRef}
                  accept="image/*"
                  onChange={handleResolutionPhotoUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Recovery Potential</label>
                <select
                  value={recoveryPotential}
                  onChange={(e) => setRecoveryPotential(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="Recoverable">Recoverable (Contains plastics/metals/dry recyclables)</option>
                  <option value="Partially Recoverable">Partially Recoverable</option>
                  <option value="Non-Recoverable">Non-Recoverable (Sent to scientific landfill/energy)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCleanedModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save & Mark Cleaned
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: FORWARD TO RRC RECOVERY DOCK
          ======================================================== */}
      {showRrcModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 bg-slate-900 max-w-md w-full space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Repeat className="w-4 h-4 text-purple-400" /> Forward Waste to Recovery Centre
              </h3>
              <button
                onClick={() => setShowRrcModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleForwardToRRC} className="space-y-4 text-xs">
              <p className="text-slate-300">
                This transfers the collected <strong>{report.wasteType}</strong> from site <strong>{report.reportId}</strong> directly into ReVastra Resource Recovery Centre Dock #2 for secondary segregation, grading, weighing, and digital inventory listing.
              </p>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Estimated Net Weight (kg)</label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={estimatedRrcWeight}
                  onChange={(e) => setEstimatedRrcWeight(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-300 space-y-1">
                <span className="text-[10px] uppercase font-bold block">Destination RRC</span>
                <p className="font-semibold text-white">RRC Alpha-01 (East Zone Industrial Dock #2)</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRrcModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-600/30"
                >
                  Dispatch to RRC Dock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
