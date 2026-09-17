import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { FileCheck2, Search, CheckCircle2, QrCode, Truck, Building2, Boxes, ShoppingCart, DollarSign } from 'lucide-react';

export function BatchTraceabilityPage() {
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id');
  const { data } = useData();

  const [selectedBatchId, setSelectedBatchId] = useState(idFromUrl || 'BATCH-2026-0891');
  const [searchQuery, setSearchQuery] = useState('');

  const activeBatch = data.batches.find(b => b.batchId === selectedBatchId) || data.batches[0];

  const timelineIcons = [QrCode, Truck, Building2, Boxes, ShoppingCart, DollarSign];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">End-to-End Batch Traceability</h1>
          <p className="text-xs text-slate-400">
            Immutable tracking history from raw waste source QR registration to B2B recycler dispatch.
          </p>
        </div>

        {/* Quick Batch Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Batch ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Batch Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {data.batches.map((b) => (
          <button
            key={b.batchId}
            onClick={() => setSelectedBatchId(b.batchId)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors border ${
              selectedBatchId === b.batchId
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {b.batchId} ({b.materialName})
          </button>
        ))}
      </div>

      {/* Main Active Batch Visual Timeline Card */}
      {activeBatch && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8">
          {/* Header Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-extrabold text-cyan-400">{activeBatch.batchId}</span>
                <StatusBadge status={activeBatch.grade} />
              </div>
              <h3 className="text-lg font-bold text-white font-heading mt-1">{activeBatch.materialName} Batch</h3>
              <p className="text-xs text-slate-400">
                Source: <strong>{activeBatch.giverName}</strong> ({activeBatch.sourceType}) • QR: <code className="text-slate-200">{activeBatch.qrIdentity}</code>
              </p>
            </div>

            <div className="text-right sm:text-right space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Segregated Net Weight</span>
              <p className="text-2xl font-black text-emerald-400 font-heading">{activeBatch.segregatedWeightKg} kg</p>
              <span className="text-xs text-slate-400 block">{activeBatch.recoveryCentreName}</span>
            </div>
          </div>

          {/* Step-by-Step Visual Timeline */}
          <div className="relative space-y-6 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {activeBatch.traceabilityTimeline.map((item, index) => {
              const Icon = timelineIcons[index % timelineIcons.length];
              return (
                <div key={index} className="relative flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 z-10 shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{item.step}</h4>
                      <span className="text-[10px] font-mono text-cyan-400">{item.date}</span>
                    </div>
                    <p className="text-xs text-slate-300">{item.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
