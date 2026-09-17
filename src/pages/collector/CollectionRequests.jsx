import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Truck,
  ScanLine,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Scale,
  Sparkles,
  AlertCircle,
  Building,
  UserCheck
} from 'lucide-react';

export function CollectionRequests() {
  const { data, acceptCollectionRequest, recordPickup } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actualQty, setActualQty] = useState('');
  const [segregated, setSegregated] = useState(true);
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const zones = ['All', 'East Zone Corridor 4', 'North Tech Corridor', 'Central Market', 'South Industrial Area'];

  // Match all active/pending collection requests
  const activeRequests = data.collections.filter(
    (c) => c.status === 'Pending' || c.status === 'Requested' || c.status === 'Accepted' || c.status === 'Assigned'
  );

  const filteredRequests = activeRequests.filter((req) => {
    if (selectedZone === 'All') return true;
    const addr = req.notes || req.sourceType || '';
    return addr.toLowerCase().includes(selectedZone.toLowerCase().split(' ')[0]);
  });

  const handleAccept = (req) => {
    acceptCollectionRequest(req.id, currentUser || { id: 'usr-collector-1', name: 'Ramesh Kumar' });
    setSuccessMsg(`Collection request ${req.id} accepted and assigned to your route!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRecordPickupSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const earned = recordPickup({
      collectionId: selectedRequest.id,
      actualQty: Number(actualQty) || selectedRequest.estimatedQty || 5,
      notes: notes || 'Verified and weighed on site by Collector',
      segregated
    });

    setSelectedRequest(null);
    setActualQty('');
    setNotes('');
    setSuccessMsg(`Pickup recorded successfully! ${earned?.totalCoins || 50} Green Coins credited to ${selectedRequest.giverName}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
            Zone Pickup Requests
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time municipal & community waste collection requests waiting for pickup
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/collector/scan-qr')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
          >
            <ScanLine className="w-4 h-4" /> Open Camera Scanner
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Active Zone Requests</span>
            <p className="text-2xl font-black text-white font-heading">{activeRequests.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Est. Recoverable Material</span>
            <p className="text-2xl font-black text-emerald-400 font-heading">
              {activeRequests.reduce((acc, r) => acc + (Number(r.estimatedQty) || 0), 0)} kg
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Collector</span>
            <p className="text-base font-bold text-white font-heading truncate">{currentUser?.name || 'Ramesh Kumar'}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Zone Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-xs text-slate-400 font-semibold shrink-0 mr-1">Filter Zone:</span>
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedZone === zone
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Truck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No active pickup requests in this zone</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All submitted waste collections have been serviced or dispatched to recovery centres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-400">{req.id}</span>
                    <h3 className="text-base font-bold text-white font-heading mt-0.5">{req.giverName}</h3>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>
                      Material: <strong className="text-white">{req.materialName}</strong> (~{req.estimatedQty} {req.unit || 'kg'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Source QR: <code className="text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono font-bold">{req.qrCode || 'QR-WG-1001'}</code>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <Building className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Source Category: <strong className="text-slate-200">{req.sourceType || 'Household'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Requested: {req.requestedDate}</span>
                  </div>

                  {req.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      "{req.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                {req.status === 'Pending' || req.status === 'Requested' ? (
                  <button
                    onClick={() => handleAccept(req)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept Request
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Assigned to Route
                  </span>
                )}

                <button
                  onClick={() => {
                    setSelectedRequest(req);
                    setActualQty(String(req.estimatedQty || 5));
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <Scale className="w-4 h-4 text-emerald-400" /> Weigh & Collect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Direct Record Pickup Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Record Verified Pickup • ${selectedRequest.id}`}
        >
          <form onSubmit={handleRecordPickupSubmit} className="space-y-4">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <p className="text-slate-400">Waste Giver: <strong className="text-white">{selectedRequest.giverName}</strong></p>
              <p className="text-slate-400">Material: <strong className="text-emerald-400">{selectedRequest.materialName}</strong></p>
              <p className="text-slate-400">Source QR: <code className="text-slate-200 font-mono font-bold">{selectedRequest.qrCode}</code></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Verified Net Weight ({selectedRequest.unit || 'kg'})
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={actualQty}
                onChange={(e) => setActualQty(e.target.value)}
                placeholder="Enter net measured weight"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="segregatedCheck"
                checked={segregated}
                onChange={(e) => setSegregated(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
              />
              <label htmlFor="segregatedCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                Material is cleanly segregated (Eligible for full Green Coins bonus)
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Collector Field Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Clean PET bottles, verified on mobile scale"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm Pickup & Award Green Coins
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
