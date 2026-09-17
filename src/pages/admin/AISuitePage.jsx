import React, { useState } from 'react';
import { AIClassifierModal } from '../../components/ai/AIClassifierModal';
import { RouteOptimizerView } from '../../components/ai/RouteOptimizerView';
import { useData } from '../../context/DataContext';
import { Cpu, Sparkles, Route, Store, ArrowRight } from 'lucide-react';

export function AISuitePage() {
  const { data } = useData();
  const [showClassifier, setShowClassifier] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">AI & Smart Feature Suite</h1>
        <p className="text-xs text-slate-400">
          Modular intelligence layers enhancing classification, pricing, route optimization & buyer matching.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 1 */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Computer Vision
            </span>
          </div>

          <h3 className="text-lg font-bold text-white font-heading">AI Waste Classification</h3>
          <p className="text-xs text-slate-400">
            Upload or capture waste photo. TensorFlow CNN predicts material category (PET, E-Waste, Coconut), quality grade A/B/C, and estimated market yield.
          </p>

          <button
            onClick={() => setShowClassifier(true)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Launch AI Image Classifier Modal
          </button>
        </div>

        {/* Feature 2 */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <Route className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
              Graph Optimization
            </span>
          </div>

          <h3 className="text-lg font-bold text-white font-heading">Collector Route Optimizer</h3>
          <p className="text-xs text-slate-400">
            Calculates optimal pickup node sequences for electric vehicle collectors to save fuel, reduce travel time, and handle traffic bottlenecks.
          </p>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            Saved 3.2 km average per pickup trip • 14.2 km total distance
          </div>
        </div>
      </div>

      <AIClassifierModal
        isOpen={showClassifier}
        onClose={() => setShowClassifier(false)}
      />
    </div>
  );
}
