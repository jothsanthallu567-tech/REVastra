import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  calculateGreenCoins,
  DEFAULT_MATERIAL_RATES,
  DEFAULT_GRADE_A_BONUS_PERCENT
} from '../../services/greenCoinService';
import {
  Coins,
  Calculator,
  Sparkles,
  Info,
  Scale,
  Award,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export function GreenCoinCalculator({ title = 'Green Coin Calculator', subtitle, isAdminMode = false }) {
  const { data } = useData();

  const ratesConfig = data.coinRatesConfig || DEFAULT_MATERIAL_RATES;
  const gradeABonusPercent = data.gradeABonusPercent || DEFAULT_GRADE_A_BONUS_PERCENT;

  const materialKeys = Object.keys(ratesConfig);
  const [selectedMaterial, setSelectedMaterial] = useState('mat-plastic');
  const [quantityKg, setQuantityKg] = useState('5');
  const [grade, setGrade] = useState('Grade A');

  // Perform Calculation
  const result = calculateGreenCoins({
    materialKey: selectedMaterial,
    quantityKg: Number(quantityKg),
    grade,
    bonusPercent: gradeABonusPercent,
    customRates: ratesConfig
  });

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-emerald-950/20 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
              {title}
              {isAdminMode && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Admin Simulator
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {subtitle || 'Estimate reward value based on material weight and expected segregation grade.'}
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
          100 Green Coins = ₹1 INR
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Material Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span>1. Waste Material Category</span>
              <span className="text-emerald-400 font-normal text-[11px]">
                (Base: {ratesConfig[selectedMaterial]?.baseRatePerKg || 200} coins/kg)
              </span>
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              {materialKeys.map((key) => {
                const mat = ratesConfig[key];
                return (
                  <option key={key} value={key} className="bg-slate-950 text-white">
                    {mat.name} ({mat.category}) — {mat.baseRatePerKg} coins/kg
                  </option>
                );
              })}
            </select>
          </div>

          {/* 2. Quantity Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>2. Quantity in Kilograms (kg)</span>
              <span className="text-slate-400 text-[11px] font-normal">Must be greater than 0</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                placeholder="Enter weight in kg (e.g. 5)"
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-black text-white focus:outline-none focus:border-emerald-500 font-mono transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                KG
              </span>
            </div>
          </div>

          {/* 3. Expected Grade Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              3. Expected Quality Grade (Assigned at Recovery Centre)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'Grade A', label: 'Grade A', desc: `+${gradeABonusPercent}% Bonus`, color: 'border-emerald-500 bg-emerald-950/30 text-emerald-300' },
                { key: 'Grade B', label: 'Grade B', desc: 'Base Rate (100%)', color: 'border-blue-500 bg-blue-950/30 text-blue-300' },
                { key: 'Grade C', label: 'Grade C', desc: 'Base Rate (No Cut)', color: 'border-amber-500 bg-amber-950/30 text-amber-300' }
              ].map((g) => (
                <button
                  type="button"
                  key={g.key}
                  onClick={() => setGrade(g.key)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    grade === g.key
                      ? `${g.color} ring-1 font-bold shadow-lg`
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-black">{g.label}</span>
                  <span className="text-[10px] block opacity-80 mt-0.5">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-emerald-500/40 relative overflow-hidden space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                CALCULATOR ESTIMATE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Provisional
              </span>
            </div>

            {/* Error handling */}
            {!result.isValid ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{result.error}</span>
              </div>
            ) : (
              <>
                {/* Main Total Highlight */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] text-slate-300 block font-medium">Estimated Green Coins:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400 font-heading">
                      {result.totalCoins.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-300">Coins</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Approx. Reward Value:</span>
                    <span className="text-lg font-black text-emerald-400 font-heading">
                      ₹{result.rewardValueRupees.toFixed(2)} INR
                    </span>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Green Coins ({result.quantityKg}kg × {result.baseRatePerKg}):</span>
                    <span className="font-mono text-slate-200 font-semibold">{result.baseCoins}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{result.grade} Bonus ({result.gradeBonusPercent}%):</span>
                    <span className="font-mono text-emerald-400 font-bold">+{result.gradeBonusCoins}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 text-white font-bold">
                    <span>Expected Total:</span>
                    <span className="font-mono text-amber-400">{result.totalCoins} Coins</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mandatory verification label */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <p className="font-bold text-amber-300 flex items-center gap-1">
              <Info className="w-3 h-3 text-amber-400 shrink-0" /> Clearly labeled: Estimated Green Coins
            </p>
            <p className="text-[10px] leading-relaxed">
              Provisional coins are issued upon collection. The final reward coins are confirmed strictly after secondary segregation, weighing, and grading at the Resource Recovery Centre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
