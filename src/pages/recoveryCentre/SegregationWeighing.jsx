import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { Building2, Scale, Layers, Award, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export function SegregationWeighing() {
  const { data, processRecoveryDock } = useData();
  const navigate = useNavigate();

  // Pick collections at Recovery Dock waiting for secondary segregation/weighing
  const dockCollections = data.collections.filter(
    (c) => c.status === 'Sent to Recovery Centre' || c.status === 'Verified'
  );

  const [selectedColId, setSelectedColId] = useState(dockCollections[0]?.id || 'COL-2026-8901');
  const [grossWeight, setGrossWeight] = useState('12.5');
  const [segregatedWeight, setSegregatedWeight] = useState('12.0');
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [createdBatch, setCreatedBatch] = useState(null);

  const activeCol = dockCollections.find((c) => c.id === selectedColId) || dockCollections[0];

  const handleProcessDock = (e) => {
    e.preventDefault();
    if (!activeCol) return;

    const batch = processRecoveryDock({
      collectionId: activeCol.id,
      grossWeightKg: Number(grossWeight),
      segregatedWeightKg: Number(segregatedWeight),
      qualityGrade
    });

    setCreatedBatch(batch);

    setTimeout(() => {
      navigate('/admin/inventory');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">RRC Secondary Segregation, Weighing & Grading</h1>
        <p className="text-xs text-slate-400">
          Resource Recovery Centre Dock #2 • Process incoming raw waste into digital inventory stock batches.
        </p>
      </div>

      {createdBatch && (
        <div className="p-5 rounded-3xl bg-teal-500/20 border border-teal-500/40 text-teal-300 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <span>Digital Inventory Created & Published to B2B Marketplace!</span>
          </div>
          <p className="text-xs text-slate-200">
            Batch ID: <strong className="font-mono text-emerald-400">{createdBatch.batchId}</strong> • Quality Grade: <strong>{createdBatch.grade}</strong> • Segregated Net: <strong>{createdBatch.segregatedWeightKg} kg</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dock Queue Selection List (1 col) */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dock Arrival Queue</h3>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {dockCollections.map((col) => (
              <button
                key={col.id}
                onClick={() => {
                  setSelectedColId(col.id);
                  setGrossWeight(String(col.actualQty || col.estimatedQty));
                  setSegregatedWeight(String((col.actualQty || col.estimatedQty) * 0.96));
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                  selectedColId === col.id
                    ? 'bg-teal-500/15 border-teal-500/50 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-400">{col.id}</span>
                  <StatusBadge status={col.status} />
                </div>
                <p className="text-xs font-bold text-white mt-1">{col.materialName}</p>
                <p className="text-[10px] text-slate-400">Source: {col.giverName} ({col.sourceType})</p>
              </button>
            ))}
          </div>
        </div>

        {/* Processing Form (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Collection Under Process</span>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading">{activeCol?.materialName || 'PET Bottles'}</h3>
              <span className="text-xs font-mono text-teal-400 font-bold">{activeCol?.id}</span>
            </div>
            <p className="text-xs text-slate-400">
              Collector: {activeCol?.collectorName} • Source QR: <code className="text-slate-200">{activeCol?.qrCode}</code>
            </p>
          </div>

          <form onSubmit={handleProcessDock} className="space-y-5">
            {/* Weighing inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gross Arrival Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Net Segregated Clean Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={segregatedWeight}
                  onChange={(e) => setSegregatedWeight(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-bold text-teal-400"
                />
              </div>
            </div>

            {/* Quality Grade Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Quality Grading Classification</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { grade: 'Grade A', desc: 'Premium, clean, un-contaminated' },
                  { grade: 'Grade B', desc: 'Standard industrial grade' },
                  { grade: 'Grade C', desc: 'Mixed / raw processing required' }
                ].map((g) => (
                  <button
                    type="button"
                    key={g.grade}
                    onClick={() => setQualityGrade(g.grade)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      qualityGrade === g.grade
                        ? 'bg-teal-500/20 border-teal-500/60 text-teal-300 font-bold shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-extrabold">{g.grade}</span>
                    <span className="text-[9px] block text-slate-400 mt-1">{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Final Green Coins Preview Box */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  Final Green Coins Reward (To be Credited)
                </span>
                <span className="text-xs text-slate-300">
                  Calculated based on {segregatedWeight} kg @ {qualityGrade}
                </span>
              </div>
              <span className="text-xl font-black text-amber-400 font-heading">
                {activeCol && Math.round(Number(segregatedWeight) * (qualityGrade === 'Grade A' ? 1.25 : 1) * 180)} Coins
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow-xl shadow-teal-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>Verify & Convert to Digital Marketplace Stock</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
