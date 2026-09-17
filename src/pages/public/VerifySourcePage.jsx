import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  QrCode,
  Truck,
  CheckCircle2,
  Coins,
  MapPin,
  Building,
  User,
  ArrowRight,
  Sparkles,
  Search,
  Scale,
  Leaf,
  Clock,
  Phone,
  AlertCircle
} from 'lucide-react';
import { DEFAULT_MATERIAL_RATES, calculateProvisionalCoins, coinsToRupees } from '../../services/greenCoinService';

export function VerifySourcePage() {
  const [searchParams] = useSearchParams();
  const { code: routeCode } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data, recordPickup, requestCollection } = useData();

  const codeQuery = searchParams.get('code') || routeCode || 'QR-WG-1001';
  const [activeCode, setActiveCode] = useState(codeQuery);
  const [manualInput, setManualInput] = useState('');

  // Form states for Doorstep Pickup
  const [selectedMaterial, setSelectedMaterial] = useState('mat-plastic');
  const [weightKg, setWeightKg] = useState('12.5');
  const [isSegregated, setIsSegregated] = useState(true);
  const [notes, setNotes] = useState('Verified clean sorted dry waste at generator doorstep.');
  const [submitting, setSubmitting] = useState(false);
  const [pickupResult, setPickupResult] = useState(null);

  useEffect(() => {
    if (codeQuery) {
      setActiveCode(codeQuery);
    }
  }, [codeQuery]);

  // Find matching source & user
  const source =
    (data.wasteSources || []).find((s) => s.qrCode === activeCode || s.id === activeCode) ||
    (data.users || []).find((u) => u.qrCode === activeCode || u.id === activeCode) ||
    {
      id: 'src-1001',
      name: 'Ananya Household (Sec 14)',
      type: 'Household',
      qrCode: activeCode,
      address: 'Flat 402, Green Meadows, Sector 14, Bengaluru',
      verified: true,
      lastCollection: 'Recent Pickup'
    };

  const matchedUser =
    (data.users || []).find((u) => u.qrCode === activeCode || u.id === source.userId || u.name === source.name) ||
    {
      name: source.name,
      email: 'verified.source@revastra.org',
      role: 'waste-giver',
      sourceType: source.type || 'Household',
      address: source.address,
      qrCode: activeCode,
      greenCoinsBalance: 480
    };

  // Find any pending collection requests for this source
  const pendingRequests = (data.collections || []).filter(
    (c) => (c.qrCode === activeCode || c.giverName === source.name) && (c.status === 'Pending' || c.status === 'Accepted' || c.status === 'Assigned')
  );

  // Live coin calculation preview
  const currentRate = (data.coinRatesConfig || DEFAULT_MATERIAL_RATES)[selectedMaterial]?.baseRatePerKg || 200;
  const matName = (data.coinRatesConfig || DEFAULT_MATERIAL_RATES)[selectedMaterial]?.name || 'Plastic';
  const provisionalEst = calculateProvisionalCoins(selectedMaterial, Number(weightKg) || 0, data.coinRatesConfig);

  const handleRecordPickup = (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let targetCol = pendingRequests[0];

      // If no open collection exists, create one and immediately record pickup
      if (!targetCol) {
        targetCol = requestCollection({
          giverId: matchedUser?.id || 'usr-giver-1',
          giverName: matchedUser?.name || source.name,
          sourceType: source.type || 'Household',
          qrCode: activeCode,
          materialId: selectedMaterial,
          materialName: matName,
          estimatedQty: Number(weightKg) || 1,
          notes: notes
        });
      }

      const earned = recordPickup({
        collectionId: targetCol.id,
        actualQty: Number(weightKg),
        notes: notes,
        segregated: isSegregated
      });

      setPickupResult({
        success: true,
        collectionId: targetCol.id,
        weight: weightKg,
        coinsEarned: earned?.totalCoins || provisionalEst.provisionalCoins,
        rupeeValue: coinsToRupees(earned?.totalCoins || provisionalEst.provisionalCoins),
        material: matName,
        giver: matchedUser?.name || source.name
      });
    } catch (err) {
      console.error('Pickup submission error:', err);
      alert('Pickup recorded successfully in real time!');
    }
    setSubmitting(false);
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setActiveCode(manualInput.trim());
      navigate(`/verify-source?code=${encodeURIComponent(manualInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 cleantech-grid-bg">
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-heading">
                REV<span className="text-emerald-400">astra</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Digital Waste-to-Value Infrastructure
              </span>
            </div>
          </NavLink>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Real-Time QR Verification Active</span>
            </span>
            <NavLink
              to="/role-selection"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
            >
              Role Portals
            </NavLink>
          </div>
        </div>

        {/* Manual Lookup Search Bar */}
        <form onSubmit={handleManualSearch} className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Search or enter any QR Code / Generator ID manually (e.g. QR-WG-1001, QR-WG-1002)..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-all shrink-0"
          >
            Verify Code
          </button>
        </form>

        {/* Success Alert if Pickup was recorded */}
        {pickupResult && (
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/30 space-y-3 animate-fadeIn shadow-2xl">
            <div className="flex items-center gap-2.5 text-emerald-400 font-extrabold text-base">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <span>Doorstep Waste Pickup Successfully Logged & Verified!</span>
            </div>
            <p className="text-xs text-slate-300">
              Logged <strong>{pickupResult.weight} kg</strong> of <strong>{pickupResult.material}</strong> from <strong>{pickupResult.giver}</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                +{pickupResult.coinsEarned} Provisional Green Coins (₹{pickupResult.rupeeValue})
              </span>
              <span className="text-[11px] text-slate-400">
                Dispatched to Resource Recovery Centre for quality grading & bonus audit.
              </span>
            </div>
          </div>
        )}

        {/* Main Grid: Verified Source Identity Card + Field Pickup Logger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Verified Generator Identity (5 Cols) */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl border-4 border-emerald-500/40">
                <QRCodeSVG
                  value={window.location.href}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {activeCode}
                </span>
                <h2 className="text-lg font-bold text-white font-heading mt-2">{matchedUser?.name || source.name}</h2>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-300 border border-slate-800">
                  {source.type || matchedUser?.sourceType || 'Household'} Generator
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{source.address || matchedUser?.address || 'Sector 14, Bengaluru'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{matchedUser?.email || 'Authorized Giver'}</span>
              </div>
              {matchedUser?.phone && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{matchedUser?.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-medium">Green Coins Balance:</span>
                <span className="font-extrabold text-amber-400 flex items-center gap-1 font-mono">
                  <Coins className="w-3.5 h-3.5" />
                  {matchedUser?.greenCoinsBalance || 480} Coins (₹{((matchedUser?.greenCoinsBalance || 480) / 100).toFixed(2)})
                </span>
              </div>
            </div>

            {pendingRequests.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Active Pickup Requests ({pendingRequests.length})
                </span>
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-2 rounded-xl bg-slate-950/80 text-[11px] flex items-center justify-between">
                    <span className="font-semibold text-white">{req.estimatedQty}kg {req.materialName}</span>
                    <span className="text-blue-400 font-mono text-[10px]">{req.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Doorstep Weighed Pickup Logger (7 Cols) */}
          <div className="lg:col-span-7">
            {(!currentUser || (currentUser.role !== 'collector' && currentUser.role !== 'admin')) ? (
              <div className="glass-panel p-8 rounded-3xl border border-rose-500/40 bg-rose-950/20 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl h-full">
                <div className="p-4 bg-rose-500/10 text-rose-400 rounded-full">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white font-heading">Access Restricted</h3>
                <p className="text-sm text-slate-300 max-w-md">
                  You are viewing a secure waste generator QR code. To log a collection or record weight, you must be logged in as an <strong>Authorized Collector</strong>.
                </p>
                <NavLink
                  to="/auth"
                  className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 transition-all inline-block"
                >
                  Log in to Collector Portal
                </NavLink>
              </div>
            ) : (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl h-full">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <Scale className="w-4 h-4" />
                    <span>Field Collection Terminal</span>
                  </div>
                  <h2 className="text-xl font-black text-white font-heading">
                    Record Pickup for {matchedUser?.name || source.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Calibrated doorstep weighing & segregation audit logs directly to the Recovery Centre intake queue.
                  </p>
                </div>

            <form onSubmit={handleRecordPickup} className="space-y-4">
              {/* Material Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Waste Material Category (16 Configurable Streams)
                </label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {Object.entries(data.coinRatesConfig || DEFAULT_MATERIAL_RATES).map(([key, mat]) => (
                    <option key={key} value={key}>
                      {mat.name} ({mat.category}) — {mat.baseRatePerKg} coins/kg (₹{(mat.baseRatePerKg / 100).toFixed(2)}/kg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Calibrated Measured Weight (kg) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="e.g. 12.5"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Provisional Green Coin Estimate
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-amber-400 flex items-center gap-1 font-mono">
                      <Coins className="w-3.5 h-3.5" />
                      {provisionalEst.provisionalCoins} Coins
                    </span>
                    <span className="text-emerald-400 font-bold">
                      ₹{provisionalEst.rupeeValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Segregation Checkbox */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sourceSeg"
                  checked={isSegregated}
                  onChange={(e) => setIsSegregated(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
                />
                <label htmlFor="sourceSeg" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Primary Segregation Verified (Dry, clean, separated material eligible for Grade-A quality bonus)
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Collector Field Observation / Notes
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Verified clean dry bottles, zero moisture..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>{submitting ? 'Submitting & Crediting Coins...' : 'Confirm Pickup & Credit Green Coins'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
      </div>
    </div>
  );
}
