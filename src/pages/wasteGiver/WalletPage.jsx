import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { GreenCoinCalculator } from '../../components/common/GreenCoinCalculator';
import { DEFAULT_MATERIAL_RATES, DEFAULT_GRADE_A_BONUS_PERCENT } from '../../services/greenCoinService';
import {
  Coins,
  ShoppingBag,
  Sparkles,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Info,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

export function WalletPage() {
  const { currentUser } = useAuth();
  const { data } = useData();

  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW | RATE_CARD | HISTORY | REDEMPTIONS
  const [rateSearch, setRateSearch] = useState('');
  const [rateCategory, setRateCategory] = useState('All');

  const ratesConfig = data.coinRatesConfig || DEFAULT_MATERIAL_RATES;
  const gradeABonus = data.gradeABonusPercent || DEFAULT_GRADE_A_BONUS_PERCENT;

  // Active User Balance & Calculations
  const userRecord = (data.users || []).find((u) => u.id === currentUser?.id) || currentUser;
  const balance = userRecord?.greenCoinsBalance ?? 480;
  const rupeeEquivalent = (balance / 100).toFixed(2);
  const baseToday = userRecord?.baseCoinsToday || 35;

  // Transactions & History
  const myCollections = (data.collections || []).filter(
    (c) => c.giverId === userRecord?.id || c.giverName === userRecord?.name
  );

  const myCoinTxns = (data.coinTransactions || []).filter(
    (tx) => tx.userId === userRecord?.id || tx.userName === userRecord?.name
  );

  const myRedemptions = (data.redemptions || []).filter((r) => r.userId === userRecord?.id);

  // Rate card materials list
  const materialsList = Object.entries(ratesConfig).map(([key, item]) => ({
    key,
    ...item,
    gradeARate: Math.round(item.baseRatePerKg * (1 + gradeABonus / 100))
  }));

  const filteredRates = materialsList.filter((m) => {
    const matchesCat = rateCategory === 'All' || m.category === rateCategory;
    const matchesSearch = !rateSearch || m.name.toLowerCase().includes(rateSearch.toLowerCase()) || m.category.toLowerCase().includes(rateSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const uniqueCategories = ['All', ...new Set(materialsList.map((m) => m.category))];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/30 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Green Coin Standard: 100 Green Coins = ₹1 INR Reward Value</span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
              {balance.toLocaleString()} <span className="text-amber-400 text-2xl sm:text-3xl font-bold">Green Coins</span>
            </h1>
          </div>

          <p className="text-xs text-slate-300 flex items-center gap-2">
            <span>Equivalent Guaranteed Reward Value:</span>
            <strong className="text-emerald-400 text-sm font-heading font-black">₹{rupeeEquivalent} INR</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/waste-giver/grocery-rewards"
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Redeem for Groceries</span>
          </NavLink>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'OVERVIEW', label: 'Rewards Hub & Calculator' },
          { key: 'RATE_CARD', label: 'Green Coin Rate Card' },
          { key: 'HISTORY', label: 'Earning & Grade Bonus History' },
          { key: 'REDEMPTIONS', label: 'Redemption History' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === tab.key
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW WITH CALCULATOR */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Green Coin Calculator */}
          <GreenCoinCalculator />

          {/* Participation & Grade Bonus Rule Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Provisional Coins</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-xs text-slate-200 font-bold">Awarded Instantly at Collection</p>
              <p className="text-[11px] text-slate-400">
                Collector assigns provisional Grade-B base coins at pickup upon weighing.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Grade A Quality Bonus</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-emerald-300 font-bold">+{gradeABonus}% Bonus on Base Rate</p>
              <p className="text-[11px] text-slate-400">
                Assigned at Recovery Centre for clean, dry, well-segregated recyclable waste.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recovery Centre Check</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs text-slate-200 font-bold">Final Verified Calculation</p>
              <p className="text-[11px] text-slate-400">
                Final rewards are confirmed and adjusted post secondary segregation at RRC.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GREEN COIN RATE CARD */}
      {activeTab === 'RATE_CARD' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white font-heading">Complete Green Coin Rate Card</h3>
              <p className="text-xs text-slate-400">
                Configurable per-kg reward values for segregated recyclable and organic materials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Category Filter */}
              <select
                value={rateCategory}
                onChange={(e) => setRateCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {uniqueCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Search */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search material..."
                  value={rateSearch}
                  onChange={(e) => setRateSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Waste Material</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Grade B Base Rate</th>
                  <th className="px-6 py-4">Grade A Rate (+{gradeABonus}%)</th>
                  <th className="px-6 py-4 text-right">Approx ₹ Value / kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                      No materials found matching search.
                    </td>
                  </tr>
                ) : (
                  filteredRates.map((mat) => (
                    <tr key={mat.key} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-white text-xs">{mat.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {mat.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-amber-400">{mat.baseRatePerKg}</span>
                        <span className="text-[10px] text-slate-400 ml-1">coins / kg</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-emerald-400">{mat.gradeARate}</span>
                        <span className="text-[10px] text-emerald-500/80 ml-1 font-semibold">(+{mat.gradeARate - mat.baseRatePerKg})</span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-400 font-heading">
                        ₹{(mat.baseRatePerKg / 100).toFixed(2)} - ₹{(mat.gradeARate / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EARNING & GRADE BONUS HISTORY */}
      {activeTab === 'HISTORY' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
          <div>
            <h3 className="text-base font-bold text-white font-heading">Green Coin Earning History</h3>
            <p className="text-xs text-slate-400">
              Clear breakdown distinguishing between <strong>PROVISIONAL COINS (Collection)</strong> and <strong>FINAL COINS (Recovery Centre Verification)</strong>.
            </p>
          </div>

          <div className="space-y-3">
            {myCoinTxns.length === 0 && myCollections.length === 0 ? (
              <div className="p-8 text-center text-slate-400 rounded-2xl bg-slate-950 border border-slate-800">
                No coin earning history recorded yet. Submit a waste collection request to start earning!
              </div>
            ) : (
              (myCoinTxns.length > 0 ? myCoinTxns : myCollections).map((item) => {
                const isFinal = item.stageBadge === 'Final Verified Coins' || item.status === 'Completed';
                return (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${isFinal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        <ArrowDownLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white">
                            {item.materialName} ({item.quantityKg || item.actualQty || item.estimatedQty} kg)
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isFinal ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          }`}>
                            {isFinal ? 'FINAL VERIFIED COINS' : 'PROVISIONAL COINS'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.date || item.collectedDate || item.requestedDate} • ID: {item.id} • Grade: <strong>{item.grade || 'Grade A'}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-amber-400 font-heading block">
                        +{item.totalCoins || item.coinsEarned} Green Coins
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        ₹{((item.totalCoins || item.coinsEarned) / 100).toFixed(2)} Reward Value
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REDEMPTION HISTORY */}
      {activeTab === 'REDEMPTIONS' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading">Grocery Rewards Redemption History</h3>
              <p className="text-xs text-slate-400">Subsidised groceries and household essentials claimed with Green Coins.</p>
            </div>
            <NavLink
              to="/waste-giver/grocery-rewards"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Redeem More
            </NavLink>
          </div>

          <div className="space-y-3">
            {myRedemptions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 rounded-2xl bg-slate-950 border border-slate-800">
                No grocery redemptions found. Redeem your Green Coins in the Grocery Rewards catalogue!
              </div>
            ) : (
              myRedemptions.map((red) => (
                <div key={red.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{red.itemName}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {red.date} • Pickup Code: <strong className="font-mono text-cyan-400">{red.redemptionCode}</strong> • {red.pickupPoint}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-rose-400 font-heading block">
                      -{red.coinsSpent} Coins
                    </span>
                    <span className="text-[10px] text-slate-400">₹{red.rupeeEquivalent} value</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
