import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { QRScannerModal } from '../../components/qr/QRScannerModal';
import { RouteOptimizerView } from '../../components/ai/RouteOptimizerView';
import {
  ScanLine,
  Truck,
  CheckCircle2,
  Clock,
  Route,
  ArrowRight,
  PlusCircle,
  Building2
} from 'lucide-react';

export function CollectorDashboard() {
  const { currentUser } = useAuth();
  const { data } = useData();
  const navigate = useNavigate();

  const [showScanner, setShowScanner] = useState(false);

  const pendingRequests = data.collections.filter(c => c.status === 'Pending' || c.status === 'Requested' || c.status === 'Accepted' || c.status === 'Assigned');
  const myCompleted = data.collections.filter(c => c.status === 'Sent to Recovery Centre' || c.status === 'Completed');
  const activeRoute = data.routes[0];

  const handleScanSuccess = (scannedCode) => {
    navigate(`/collector/scan-qr?code=${encodeURIComponent(scannedCode)}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Truck className="w-4 h-4" />
            <span>Authorized Collector #{currentUser?.id?.slice(-3) || '104'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Collector Hub: <span className="text-blue-400">{currentUser?.name || 'Ramesh Kumar'}</span>
          </h1>
          <p className="text-xs text-slate-400">
            Assigned Zone: <strong className="text-slate-200">{currentUser?.assignedZone || 'East Zone Corridor 4'}</strong> • Vehicle: <code className="text-blue-400 bg-slate-950 px-2 py-0.5 rounded">{currentUser?.vehicleNo || 'KA-01-EV-4092'}</code>
          </p>
        </div>

        <button
          onClick={() => setShowScanner(true)}
          className="w-full md:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
        >
          <ScanLine className="w-5 h-5 animate-pulse" />
          <span>Scan Waste Giver QR</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Pickups"
          value={`${pendingRequests.length} Requests`}
          subtext="In East Zone Corridor 4"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed Today"
          value={`${myCompleted.length} Collections`}
          subtext="Processed to Recovery Dock"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Weight Picked"
          value="164.5 kg"
          subtext="PET, Cardboard, E-Waste & Organic"
          icon={Truck}
          color="cyan"
        />
        <StatCard
          title="Assigned Route"
          value="14.2 km"
          subtext="3/3 Collection stops covered"
          icon={Route}
          color="purple"
        />
      </div>

      {/* AI Route & Pending Collections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Route Guidance */}
        <div className="lg:col-span-2 space-y-4">
          <RouteOptimizerView route={activeRoute} />
        </div>

        {/* Right: Quick Pickup Queue */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Pending Pickup Queue</h3>
            <NavLink to="/collector/requests" className="text-xs text-blue-400 hover:underline font-semibold">
              View All
            </NavLink>
          </div>

          <div className="space-y-2.5">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{req.giverName}</span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-[11px] text-slate-400 truncate">{req.notes || req.materialName}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                  <span className="font-mono text-emerald-400">{req.qrCode}</span>
                  <button
                    onClick={() => handleScanSuccess(req.qrCode)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30 flex items-center gap-1"
                  >
                    <ScanLine className="w-3 h-3" /> Record Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
