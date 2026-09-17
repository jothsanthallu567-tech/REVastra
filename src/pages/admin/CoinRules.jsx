import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';
import { GreenCoinCalculator } from '../../components/common/GreenCoinCalculator';
import { DEFAULT_MATERIAL_RATES, DEFAULT_GRADE_A_BONUS_PERCENT } from '../../services/greenCoinService';
import {
  Coins,
  ShoppingBag,
  ShieldAlert,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Settings2,
  Sliders,
  Users,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Edit2,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export function AdminCoinRules() {
  const { data, updateCoinRatesConfig, updateGradeABonus, addGroceryItem, addProhibitedItem } = useData();

  const [activeTab, setActiveTab] = useState('MANAGEMENT'); // MANAGEMENT | RATES | USERS | TRANSACTIONS | GROCERY | PROHIBITED
  const [searchTerm, setSearchTerm] = useState('');

  // Editable Rates State
  const ratesConfig = data.coinRatesConfig || DEFAULT_MATERIAL_RATES;
  const [editableRates, setEditableRates] = useState(ratesConfig);
  const [isEditingRates, setIsEditingRates] = useState(false);

  // Editable Grade A Bonus
  const gradeABonus = data.gradeABonusPercent || DEFAULT_GRADE_A_BONUS_PERCENT;
  const [bonusInput, setBonusInput] = useState(gradeABonus);

  // Grocery and Prohibited Modal states
  const [showAddGrocModal, setShowAddGrocModal] = useState(false);
  const [showAddProModal, setShowAddProModal] = useState(false);

  const [newGroc, setNewGroc] = useState({
    name: 'Biscuits Pack',
    weight: '200g Pack',
    coinCost: 2000,
    marketPriceRupees: 22,
    allowedQtyPerWeek: 3,
    availableStock: 100,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=300'
  });

  const [newPro, setNewPro] = useState({
    title: 'Industrial Chemical Waste',
    description: 'Concentrated toxic solvents, acids, heavy metal residues',
    severity: 'High Hazard'
  });

  // Calculate Aggregates
  const usersWithCoins = (data.users || []).filter((u) => u.greenCoinsBalance !== undefined);
  const totalCoinsInCirculation = usersWithCoins.reduce((acc, u) => acc + (u.greenCoinsBalance || 0), 0);
  const totalCoinsIssued = data.impactMetrics?.greenCoinsIssuedTotal || 184500;
  const totalRedemptions = (data.redemptions || []).reduce((acc, r) => acc + (r.coinsSpent || 0), 0);
  
  const coinTxns = data.coinTransactions || [];
  const totalGradeBonuses = coinTxns.reduce((acc, t) => acc + (t.gradeBonusCoins || 0), 0);

  const handleSaveRates = () => {
    updateCoinRatesConfig(editableRates);
    setIsEditingRates(false);
    alert('Material Green Coin base rates updated and synced to Firestore!');
  };

  const handleSaveBonus = () => {
    const num = Math.min(30, Math.max(15, Number(bonusInput)));
    updateGradeABonus(num);
    alert(`Grade A Bonus updated to ${num}%!`);
  };

  const handleRateChange = (matKey, newRate) => {
    setEditableRates((prev) => ({
      ...prev,
      [matKey]: {
        ...prev[matKey],
        baseRatePerKg: Math.max(0, Number(newRate))
      }
    }));
  };

  const handleCreateGrocery = (e) => {
    e.preventDefault();
    addGroceryItem(newGroc);
    setShowAddGrocModal(false);
    alert('New grocery reward item added to catalogue!');
  };

  const handleCreateProhibited = (e) => {
    e.preventDefault();
    addProhibitedItem(newPro);
    setShowAddProModal(false);
    alert('Prohibited waste list updated!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white font-heading">
              Green Coin Rewards Management & Rate Configuration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Configure material reward base rates, Grade A segregation bonuses, inspect user balances, and audit reward transactions.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
          Standard: 100 Green Coins = ₹1.00 INR
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Coins Issued</span>
          <p className="text-2xl font-black text-emerald-400 font-heading">{totalCoinsIssued.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400">Equivalent to ₹{(totalCoinsIssued / 100).toLocaleString()}</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Coins Redeemed</span>
          <p className="text-2xl font-black text-rose-400 font-heading">{totalRedemptions.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400">Via Grocery Catalogue (₹{(totalRedemptions / 100).toLocaleString()})</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Grade A Bonuses Given</span>
          <p className="text-2xl font-black text-cyan-400 font-heading">{totalGradeBonuses.toLocaleString()}</p>
          <span className="text-[10px] text-cyan-300">+{gradeABonus}% segregation premium</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active User Balances</span>
          <p className="text-2xl font-black text-amber-400 font-heading">{totalCoinsInCirculation.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400">Across {usersWithCoins.length} registered accounts</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'MANAGEMENT', label: 'Rate Configuration & Calculator', icon: Settings2 },
          { key: 'USERS', label: 'User Balances Directory', icon: Users },
          { key: 'TRANSACTIONS', label: 'Green Coin Audit Log', icon: History },
          { key: 'GROCERY', label: 'Grocery Catalogue', icon: ShoppingBag },
          { key: 'PROHIBITED', label: 'Prohibited Materials', icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === tab.key
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MANAGEMENT (CALCULATOR + EDITABLE RATES) */}
      {activeTab === 'MANAGEMENT' && (
        <div className="space-y-6">
          {/* Admin Embedded Calculator */}
          <GreenCoinCalculator
            title="Green Coin Verification & Simulation Engine"
            subtitle="Test material conversion rates, simulate collections, and audit verified Grade A/B/C coin calculations."
            isAdminMode={true}
          />

          {/* Configurable Rates Panel */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Configurable Material Grade-B Base Rates (coins / kg)
                </h3>
                <p className="text-xs text-slate-400">
                  Base rates apply to Grade B and Grade C collections. Grade A receives configured bonus on top of base rate.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isEditingRates ? (
                  <>
                    <button
                      onClick={() => {
                        setEditableRates(ratesConfig);
                        setIsEditingRates(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveRates}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Base Rates
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditableRates(ratesConfig);
                      setIsEditingRates(true);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" /> Edit Base Rates
                  </button>
                )}
              </div>
            </div>

            {/* Grade A Bonus Setting Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Grade A Quality Bonus Percentage
                </span>
                <p className="text-[11px] text-slate-400">
                  Standard rule: 20%–25% extra bonus coins awarded to waste givers for premium segregated dry waste.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-28">
                  <input
                    type="number"
                    min="15"
                    max="35"
                    value={bonusInput}
                    onChange={(e) => setBonusInput(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
                <button
                  onClick={handleSaveBonus}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-all"
                >
                  Update Bonus
                </button>
              </div>
            </div>

            {/* 16 Material Rates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(editableRates).map(([key, mat]) => (
                <div key={key} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{mat.category}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">Grade B</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{mat.name}</h4>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Base Rate:</span>
                    {isEditingRates ? (
                      <div className="relative w-24">
                        <input
                          type="number"
                          min="1"
                          value={mat.baseRatePerKg}
                          onChange={(e) => handleRateChange(key, e.target.value)}
                          className="w-full pl-2 pr-6 py-1 rounded-lg bg-slate-900 border border-emerald-500 text-xs font-bold text-amber-400 text-right focus:outline-none"
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-semibold">c/kg</span>
                      </div>
                    ) : (
                      <span className="font-extrabold text-amber-400 text-xs font-mono">
                        {mat.baseRatePerKg} <span className="text-[10px] text-slate-400 font-normal">coins/kg</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER BALANCES DIRECTORY */}
      {activeTab === 'USERS' && (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white font-heading">User-Wise Green Coin Balances</h3>
              <p className="text-xs text-slate-400">Live ledger of circulating Green Coins across all ecosystem participants.</p>
            </div>
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name, ID, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role & Category</th>
                  <th className="px-6 py-4">QR / ID Reference</th>
                  <th className="px-6 py-4 text-right">Green Coins Balance</th>
                  <th className="px-6 py-4 text-right">Rupee Purchasing Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {usersWithCoins
                  .filter((u) => !searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <strong className="text-white block text-xs">{u.name}</strong>
                        <span className="text-[10px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-200 capitalize block">{u.role.replace('-', ' ')}</span>
                        <span className="text-[10px] text-slate-400">{u.sourceType || u.businessType || 'General'}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{u.qrCode || u.id}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-extrabold text-amber-400 font-heading text-sm">
                          {u.greenCoinsBalance} Coins
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-emerald-400">
                          ₹{(u.greenCoinsBalance / 100).toFixed(2)} INR
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTIONS AUDIT LOG */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading">Global Green Coin Transaction & Bonus Audit</h3>
            <p className="text-xs text-slate-400">Complete immutable record of provisional rewards, RRC grade bonuses, and redemptions.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Txn ID & Date</th>
                  <th className="px-6 py-4">Beneficiary</th>
                  <th className="px-6 py-4">Material & Weight</th>
                  <th className="px-6 py-4">Stage & Verified Grade</th>
                  <th className="px-6 py-4">Base + Grade Bonus</th>
                  <th className="px-6 py-4 text-right">Total Green Coins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {coinTxns.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                      No Green Coin transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  coinTxns.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-purple-400 font-bold">
                        {tx.id}
                        <span className="block text-[10px] text-slate-400 font-normal">{tx.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <strong className="text-white block">{tx.userName}</strong>
                        <span className="text-[10px] text-slate-400">{tx.userId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-200 block">{tx.materialName}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{tx.quantityKg} kg</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 block w-fit">
                          {tx.grade}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{tx.stage}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 block">{tx.baseCoins} Base</span>
                        {tx.gradeBonusCoins > 0 && (
                          <span className="text-emerald-400 font-bold text-[10px]">+{tx.gradeBonusCoins} Grade Bonus</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-amber-400 font-heading text-sm">
                        +{tx.totalCoins} Coins
                        <span className="block text-[10px] text-emerald-400 font-normal">(₹{tx.rupeeValue?.toFixed(2)})</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GROCERY REWARDS CATALOGUE */}
      {activeTab === 'GROCERY' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading">Configurable Essential Grocery Catalogue</h3>
              <p className="text-xs text-slate-400">Subsidised items redeemable with Green Coins by Waste Givers.</p>
            </div>
            <button
              onClick={() => setShowAddGrocModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Add Grocery Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.groceryCatalogue.map((g) => (
              <div key={g.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{g.name}</p>
                  <span className="text-[10px] text-slate-400">{g.weight} • Stock: {g.availableStock}</span>
                </div>
                <span className="text-xs font-bold text-amber-400">{g.coinCost} Coins</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROHIBITED MATERIALS */}
      {activeTab === 'PROHIBITED' && (
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-rose-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading">Configurable Prohibited Waste List</h3>
              <p className="text-xs text-slate-400">Materials displayed to Waste Givers as strictly non-accepted.</p>
            </div>
            <button
              onClick={() => setShowAddProModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Add Prohibited Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(data.prohibitedWaste || []).map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <strong className="text-xs font-bold text-white block">{item.title}</strong>
                  <span className="text-[10px] text-slate-400">{item.description}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                  {item.severity || 'Prohibited'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Grocery Modal */}
      <Modal isOpen={showAddGrocModal} onClose={() => setShowAddGrocModal(false)} title="Add Grocery Catalogue Item" maxWidth="max-w-md">
        <form onSubmit={handleCreateGrocery} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name</label>
            <input
              type="text"
              required
              value={newGroc.name}
              onChange={(e) => setNewGroc({ ...newGroc, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Weight / Unit</label>
              <input
                type="text"
                required
                value={newGroc.weight}
                onChange={(e) => setNewGroc({ ...newGroc, weight: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Green Coin Cost</label>
              <input
                type="number"
                required
                value={newGroc.coinCost}
                onChange={(e) => setNewGroc({ ...newGroc, coinCost: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold text-amber-400"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold">
            Publish Grocery Item
          </button>
        </form>
      </Modal>

      {/* Add Prohibited Item Modal */}
      <Modal isOpen={showAddProModal} onClose={() => setShowAddProModal(false)} title="Add Prohibited Waste Guideline" maxWidth="max-w-md">
        <form onSubmit={handleCreateProhibited} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={newPro.title}
              onChange={(e) => setNewPro({ ...newPro, title: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Examples</label>
            <textarea
              rows="2"
              required
              value={newPro.description}
              onChange={(e) => setNewPro({ ...newPro, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            ></textarea>
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 text-white text-xs font-bold">
            Save Prohibited Guideline
          </button>
        </form>
      </Modal>
    </div>
  );
}
