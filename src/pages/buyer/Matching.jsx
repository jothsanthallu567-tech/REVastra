import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export function BuyerMatching() {
  const { data } = useData();

  const stock1 = data.warehouseStock?.[0] || { category: 'Plastics', material: 'Verified PET Bottle Flakes (Grade A)', availableQtyKg: 450, pricePerKg: 42, qualityGrade: 'Grade A' };
  const stock2 = data.warehouseStock?.[3] || data.warehouseStock?.[1] || { category: 'Aluminium Cans', material: 'Shredded Aluminium Scrap (Grade A)', availableQtyKg: 380, pricePerKg: 135, qualityGrade: 'Grade A' };

  const matches = [
    {
      stock: stock1,
      matchScore: 98,
      reasons: ['Exact match for PET Plastic Recycler spec', 'Grade A washed flakes verified', 'Sufficient volume for batch delivery']
    },
    {
      stock: stock2,
      matchScore: 92,
      reasons: ['Aluminium Can scrap matching metal foundry spec', 'Located nearby at GreenLoop Hub South']
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">AI Intelligent Material Matcher</h1>
        <p className="text-xs text-slate-400">
          Algorithmic matching pairing your company's raw material quality parameters with verified RRC batch inventory.
        </p>
      </div>

      <div className="space-y-4">
        {matches.map((m, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-purple-400 uppercase font-extrabold">{m.stock.category}</span>
                <h3 className="text-lg font-bold text-white font-heading">{m.stock.material}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {m.matchScore}% Match Score
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Available Inventory</span>
                <strong className="text-emerald-400 font-bold text-sm">{m.stock.availableQtyKg} kg</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Market Price</span>
                <strong className="text-white font-bold text-sm">₹{m.stock.pricePerKg} / kg</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Quality Grade</span>
                <strong className="text-teal-300 font-bold text-sm">{m.stock.qualityGrade}</strong>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-300">Matching Factors Evaluated:</span>
              {m.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <NavLink
              to="/buyer/marketplace"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Procure Matched Stock via Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}
