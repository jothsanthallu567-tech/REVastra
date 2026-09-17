import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { AIClassifierModal } from '../../components/ai/AIClassifierModal';
import { Truck, Sparkles, AlertCircle, ArrowRight, Leaf, ShieldAlert, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export function RequestCollection() {
  const { currentUser } = useAuth();
  const { data, requestCollection } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedMaterial, setSelectedMaterial] = useState('mat-pet');
  const [estimatedQty, setEstimatedQty] = useState('15');
  const [requestedDate, setRequestedDate] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState('Clean & segregated for recovery dock verification.');

  const [showAIModal, setShowAIModal] = useState(false);
  const [showProhibitedInfo, setShowProhibitedInfo] = useState(true);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const currentMatObj = data.materials.find((m) => m.id === selectedMaterial) || data.materials[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!estimatedQty || Number(estimatedQty) <= 0) return;

    const col = requestCollection({
      giverId: currentUser?.id || 'usr-giver-1',
      giverName: currentUser?.name || 'Ananya Sharma',
      sourceType: currentUser?.sourceType || 'Household',
      qrCode: currentUser?.qrCode || 'QR-WG-1001',
      materialId: currentMatObj.id,
      materialName: currentMatObj.name,
      estimatedQty: Number(estimatedQty),
      unit: 'kg',
      requestedDate,
      notes
    });

    setSubmittedMessage(`Collection request ${col.id} created! Sent to Collector queue.`);

    setTimeout(() => {
      navigate('/waste-giver/collections');
    }, 1200);
  };

  const handleApplyAI = (aiResult) => {
    const matchedMat = data.materials.find((m) => m.id === aiResult.materialId || m.name.toLowerCase().includes(aiResult.category.toLowerCase()));
    if (matchedMat) {
      setSelectedMaterial(matchedMat.id);
    }
    setNotes(`AI Vision Verified: ${aiResult.category} (${aiResult.confidence}% confidence, Grade ${aiResult.qualityGrade})`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">{t('nav_request_collection')}</h1>
          <p className="text-xs text-slate-400">
            Schedule a verified pickup from your location. Requests automatically sync to local Collectors.
          </p>
        </div>

        <button
          onClick={() => setShowAIModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Vision Classifier</span>
        </button>
      </div>

      {submittedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Leaf className="w-5 h-5" />
          <span>{submittedMessage}</span>
        </div>
      )}

      {/* ⚠️ Prohibited Waste Guidance Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-rose-500/40 bg-rose-950/20 space-y-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowProhibitedInfo(!showProhibitedInfo)}>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse" />
            <span>{t('prohibited_title')}</span>
          </div>
          <button className="text-rose-400 p-1 hover:bg-rose-500/10 rounded-lg">
            {showProhibitedInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs text-rose-200 font-medium">
          "{t('prohibited_warning')}"
        </p>

        {showProhibitedInfo && (
          <div className="pt-2 border-t border-rose-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-300">
            {(data.prohibitedWaste || []).map((item) => (
              <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-500/20 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white text-xs">{item.title}</strong>
                  <span className="text-[10px] text-slate-400">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Source QR Identity Banner */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Source Identity Tag</span>
            <p className="text-xs font-bold text-white">{currentUser?.name} • {currentUser?.sourceType || 'Household'}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {currentUser?.qrCode || 'QR-WG-1001'}
          </span>
        </div>

        {/* Material Selection Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Select Accepted Material Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {data.materials.map((mat) => (
              <button
                type="button"
                key={mat.id}
                onClick={() => setSelectedMaterial(mat.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedMaterial === mat.id
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="block text-xs font-bold text-slate-100">{mat.name}</span>
                <span className="text-[10px] font-semibold text-emerald-400 mt-1 block">
                  {mat.baseRatePerKg || mat.bonusCoins || 20} Base Coins/kg
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Quantity (kg)</label>
            <input
              type="number"
              min="1"
              max="1000"
              required
              value={estimatedQty}
              onChange={(e) => setEstimatedQty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Pickup Date & Time</label>
            <input
              type="datetime-local"
              required
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Green Coins Potential Preview */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Estimated Green Coin Reward</span>
            <p className="text-slate-300">
              Base reward (~35 coins) + {currentMatObj.name} bonus ({currentMatObj.bonusCoins} x {estimatedQty}kg = {currentMatObj.bonusCoins * Number(estimatedQty)} coins)
            </p>
          </div>
          <span className="text-base font-extrabold text-amber-400 font-heading">
            ~{35 + currentMatObj.bonusCoins * Number(estimatedQty)} Coins
          </span>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Instructions</label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Confirm & Submit Collection Request</span>
        </button>
      </form>

      <AIClassifierModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onApplyClassification={handleApplyAI}
      />
    </div>
  );
}
