import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { QRViewerModal } from '../../components/qr/QRViewerModal';
import {
  Coins,
  Truck,
  QrCode,
  ShoppingBag,
  Leaf,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Heart
} from 'lucide-react';

export function WasteGiverDashboard() {
  const { currentUser } = useAuth();
  const { data } = useData();

  const [showQRModal, setShowQRModal] = useState(false);

  // Filter collections and food donations for this waste giver
  const myCollections = data.collections.filter(c => c.giverId === currentUser?.id || c.giverName === currentUser?.name);
  const myDonations = data.foodDonations.filter(f => f.donorUserId === currentUser?.id || f.donorName === currentUser?.name);
  const myRedemptions = data.redemptions.filter(r => r.userId === currentUser?.id);

  const totalSubmittedKg = myCollections.reduce((acc, c) => acc + (c.actualQty || c.estimatedQty || 0), 0);
  const baseCoinsToday = currentUser?.baseCoinsToday || 35;
  const greenCoins = currentUser?.greenCoinsBalance || 480;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5" />
            <span>{currentUser?.sourceType || 'Household'} Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Welcome back, <span className="text-emerald-400">{currentUser?.name || 'Waste Giver'}</span> 👋
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Your waste contributions are tracked via your unique QR identity code <code className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded">{currentUser?.qrCode || 'QR-WG-1001'}</code> and converted into verified Green Coins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full md:w-auto">
          <button
            onClick={() => setShowQRModal(true)}
            className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>My QR</span>
          </button>

          <NavLink
            to="/waste-giver/donate-food"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Donate Food</span>
          </NavLink>

          <NavLink
            to="/waste-giver/request-collection"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pickup Request</span>
          </NavLink>
        </div>
      </div>

      {/* Green Coins & Participation Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Green Coins Balance"
          value={`${greenCoins} Coins`}
          subtext={`Equivalent to ₹${(greenCoins / 100).toFixed(2)} INR value`}
          icon={Coins}
          color="amber"
        />

        <StatCard
          title="Today's Base Coins"
          value={`${baseCoinsToday} / 50`}
          subtext="Daily participation cap limit"
          icon={Sparkles}
          color="emerald"
        />

        <StatCard
          title="Regular Streak Bonus"
          value={`${currentUser?.streakDays || 4} Days Streak`}
          subtext="+10 Coins every 3 consecutive days"
          icon={Award}
          color="cyan"
        />

        <StatCard
          title="Total Waste Submitted"
          value={`${totalSubmittedKg} kg`}
          subtext="Across all verified pickups"
          icon={Truck}
          color="purple"
        />
      </div>

      {/* Main Grid: Recent Collections & Grocery Rewards Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Collections (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading">Recent Collections</h3>
              <p className="text-xs text-slate-400">Track pickup status & credited Green Coins</p>
            </div>
            <NavLink to="/waste-giver/collections" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="space-y-2.5">
            {myCollections.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No collections requested yet.</p>
            ) : (
              myCollections.slice(0, 4).map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{c.materialName}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      ID: <span className="font-mono text-slate-300">{c.id}</span> • Picked by {c.collectorName}
                    </p>
                    <p className="text-[10px] text-slate-400">{c.requestedDate}</p>
                  </div>

                  <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="text-sm font-extrabold text-white font-heading">
                      {c.actualQty || c.estimatedQty} {c.unit}
                    </span>
                    {c.coinsEarned > 0 && (
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Coins className="w-3 h-3" /> +{c.coinsEarned} Coins
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick Grocery Catalogue Rewards Teaser */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Grocery Rewards</h3>
                <p className="text-xs text-slate-400">Redeem coins for essential groceries</p>
              </div>
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                Backend Reward Rate Rule
              </span>
              <p className="text-xs text-slate-200">
                <strong>100 Green Coins = ₹1 INR Value</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Redeem verified rewards at designated RRC Grocery Kiosks with direct backend validation.
              </p>
            </div>

            <div className="space-y-2">
              {data.groceryCatalogue.slice(0, 2).map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-slate-800" />
                    <div>
                      <p className="text-xs font-semibold text-white">{item.name}</p>
                      <span className="text-[10px] text-slate-400">{item.weight}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400">{item.coinCost} Coins</span>
                </div>
              ))}
            </div>
          </div>

          <NavLink
            to="/waste-giver/grocery-rewards"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <span>Open Grocery Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </div>

      {/* Food Rescue Donations Activity Strip */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-heading">
              Surplus Food Rescue Portal • Waste Givers Only
            </h4>
            <p className="text-xs text-slate-300">
              {myDonations.length > 0
                ? `You have ${myDonations.length} active/past surplus food donation(s) broadcasted to verified NGOs.`
                : 'Have unserved cooked meals, bakery stock, or groceries? List them to feed verified local shelters.'}
            </p>
          </div>
        </div>

        <NavLink
          to="/waste-giver/donate-food"
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>{myDonations.length > 0 ? 'Manage Food Donations' : 'Donate Food Now'}</span>
          <ArrowRight className="w-4 h-4" />
        </NavLink>
      </div>

      {/* QR Viewer Modal */}
      <QRViewerModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        userOrSource={currentUser}
      />
    </div>
  );
}
