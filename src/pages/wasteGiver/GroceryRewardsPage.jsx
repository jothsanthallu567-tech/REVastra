import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ShoppingBag, Coins, CheckCircle2, AlertCircle, Sparkles, Check, ArrowRight } from 'lucide-react';

export function GroceryRewardsPage() {
  const { currentUser } = useAuth();
  const { data, redeemGrocery } = useData();

  const [selectedQty, setSelectedQty] = useState({});
  const [feedback, setFeedback] = useState(null);

  const balance = currentUser?.greenCoinsBalance || 0;

  const handleRedeem = (item) => {
    setFeedback(null);
    const qty = selectedQty[item.id] || 1;

    const res = redeemGrocery({
      user: currentUser,
      item,
      requestedQuantity: Number(qty)
    });

    if (res.success) {
      setFeedback({ type: 'success', message: `${res.message} Pickup Code: ${res.redemption.redemptionCode}` });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const myRedemptions = data.redemptions.filter((r) => r.userId === currentUser?.id);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Essential Grocery Rewards</h1>
          <p className="text-xs text-slate-400">
            Exchange your verified Green Coins for government & partner subsidized essential groceries.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-2">
          <Coins className="w-4 h-4" />
          <span>Balance: {balance} Green Coins</span>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
          feedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Catalogue Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.groceryCatalogue.map((item) => {
          const qty = selectedQty[item.id] || 1;
          const canAfford = balance >= item.coinCost * qty;

          return (
            <div
              key={item.id}
              className="glass-panel rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                    Limit: {item.allowedQtyPerWeek} / week
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">{item.name}</h3>
                    <span className="text-xs text-slate-400 font-medium">{item.weight}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-lg font-extrabold text-amber-400 font-heading">{item.coinCost}</span>
                      <span className="text-[10px] text-slate-400 ml-1">Coins</span>
                    </div>
                    <span className="text-xs text-slate-400 line-through">₹{item.marketPriceRupees} MRP</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Available Stock: <strong className="text-slate-200">{item.availableStock} units</strong></span>
                    <span className="text-emerald-400 font-semibold">Verified Quality</span>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <select
                  value={qty}
                  onChange={(e) => setSelectedQty({ ...selectedQty, [item.id]: Number(e.target.value) })}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>1 Unit</option>
                  <option value={2}>2 Units</option>
                </select>

                <button
                  onClick={() => handleRedeem(item)}
                  disabled={!canAfford || item.availableStock === 0}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Redeem Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Redemptions Table */}
      {myRedemptions.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">My Grocery Redemption History</h3>
          <div className="space-y-2">
            {myRedemptions.map((red) => (
              <div key={red.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{red.itemName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {red.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pickup Point: {red.pickupPoint} • Code: <strong className="text-amber-400 font-mono">{red.redemptionCode}</strong>
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-400">{red.coinsSpent} Coins</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
