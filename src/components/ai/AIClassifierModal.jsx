import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Sparkles, Upload, CheckCircle2, Cpu, ArrowRight } from 'lucide-react';

export function AIClassifierModal({ isOpen, onClose, onApplyClassification }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const sampleClasses = [
    { category: 'PET Bottles', materialId: 'mat-pet', confidence: 96, estValueKg: 42, qualityGrade: 'Grade A', bonusCoins: 15 },
    { category: 'Clean Plastic', materialId: 'mat-plastic', confidence: 92, estValueKg: 38, qualityGrade: 'Grade A', bonusCoins: 20 },
    { category: 'E-Waste PCB', materialId: 'mat-ewaste', confidence: 94, estValueKg: 280, qualityGrade: 'Grade A', bonusCoins: 50 },
    { category: 'Coconut Waste', materialId: 'mat-coconut', confidence: 98, estValueKg: 18, qualityGrade: 'Grade A', bonusCoins: 30 }
  ];

  const handleSimulateAI = (fileOrPreset) => {
    setAnalyzing(true);
    setResult(null);

    if (typeof fileOrPreset === 'string') {
      setPreviewUrl(fileOrPreset);
    } else {
      setPreviewUrl('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400');
    }

    setTimeout(() => {
      setAnalyzing(false);
      const chosen = sampleClasses[Math.floor(Math.random() * sampleClasses.length)];
      setResult(chosen);
    }, 1200);
  };

  const handleApply = () => {
    if (result && onApplyClassification) {
      onApplyClassification(result);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Vision Waste Classifier" maxWidth="max-w-lg">
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Upload or capture a waste material photo. Our computer vision model predicts category, quality grade, and market value.
        </p>

        {/* Upload box */}
        <div className="relative h-44 bg-slate-950 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/50 transition-colors flex flex-col items-center justify-center p-4 overflow-hidden group">
          {previewUrl ? (
            <img src={previewUrl} alt="Waste preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          ) : null}

          {analyzing ? (
            <div className="relative z-10 flex flex-col items-center gap-2 bg-slate-950/80 p-4 rounded-xl backdrop-blur-md">
              <Cpu className="w-8 h-8 text-emerald-400 animate-bounce" />
              <span className="text-xs text-emerald-300 font-semibold">Running Neural Classifier Inference...</span>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center text-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-emerald-400 transition-colors" />
              <p className="text-xs font-semibold text-slate-200">Drag & drop waste image or click to upload</p>
              <span className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</span>
              <button
                onClick={() => handleSimulateAI('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400')}
                className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Sample Photo Classification
              </button>
            </div>
          )}
        </div>

        {/* AI Result Card */}
        {result && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white">{result.category}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {result.confidence}% Confidence
              </span>
            </div>

            <div className="grid grid-[#10b981] grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-emerald-500/20">
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-400">Quality Grade</span>
                <span className="font-bold text-emerald-400">{result.qualityGrade}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-400">Est Market Value</span>
                <span className="font-bold text-emerald-400">₹{result.estValueKg}/kg</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-400">Bonus Rate</span>
                <span className="font-bold text-emerald-400">+{result.bonusCoins} Coins/kg</span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/30"
            >
              <span>Auto-Fill Collection Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
