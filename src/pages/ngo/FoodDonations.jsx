import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/Badge';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
  Heart,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Calendar,
  Utensils,
  Store,
  Home,
  Building2,
  AlertCircle,
  Check,
  X,
  Filter,
  Users,
  Sparkles
} from 'lucide-react';

export function NGOFoodDonations() {
  const { currentUser } = useAuth();
  const { data, acceptFoodDonation, rejectFoodDonation } = useData();

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [rejectingDonation, setRejectingDonation] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('Today 18:30');
  const [rejectionReason, setRejectionReason] = useState('NGO vehicle capacity full for this zone');
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const availableDonations = data.foodDonations.filter((f) => f.status === 'Available');
  const myAcceptedDonations = data.foodDonations.filter(
    (f) => f.acceptedByNgoId === currentUser?.id || (f.status === 'Accepted' && f.acceptedByNgoName)
  );

  const filteredAvailable = availableDonations.filter((f) => {
    if (categoryFilter === 'All') return true;
    return (f.donorCategory || '').toLowerCase() === categoryFilter.toLowerCase();
  });

  const totalAvailableServings = availableDonations.reduce((acc, f) => acc + (f.peopleServed || 0), 0);

  const mapMarkers = filteredAvailable.map((f, i) => ({
    lat: 12.9716 + ((i % 5) * 0.005) - 0.01,
    lng: 77.5946 + ((i % 3) * 0.005) - 0.005,
    label: `${f.donorName} - ${f.foodType} (${f.peopleServed} servings)`
  }));

  const handleAcceptConfirm = () => {
    if (!selectedDonation) return;

    acceptFoodDonation({
      donationId: selectedDonation.id,
      ngoUser: currentUser || { id: 'usr-ngo-1', name: 'Annapoorna Food Foundation' },
      scheduledTime
    });

    setActionSuccessMessage(`Accepted donation: "${selectedDonation.foodType}". Pickup scheduled for ${scheduledTime}.`);
    setSelectedDonation(null);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleRejectConfirm = () => {
    if (!rejectingDonation) return;

    rejectFoodDonation({
      donationId: rejectingDonation.id,
      ngoUser: currentUser || { id: 'usr-ngo-1', name: 'Annapoorna Food Foundation' },
      reason: rejectionReason
    });

    setActionSuccessMessage(`Declined donation: "${rejectingDonation.foodType}". Donor notified.`);
    setRejectingDonation(null);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const getCategoryIcon = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'restaurant':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'shop':
        return <Store className="w-3.5 h-3.5 text-blue-400" />;
      case 'institution':
        return <Building2 className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Home className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* NGO Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-amber-400" />
            <span>NGO Food Rescue Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Review Surplus Food Donations
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Surplus edible meals submitted by registered households, restaurants, and grocery shops. Review food safety windows and click <strong>Accept</strong> to dispatch rescue vehicles or <strong>Reject</strong> if out of capacity.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
            <span className="text-xs text-slate-400 font-semibold block">Available</span>
            <span className="text-xl font-extrabold text-amber-400 font-heading">
              {availableDonations.length}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
            <span className="text-xs text-slate-400 font-semibold block">People Fed</span>
            <span className="text-xl font-extrabold text-emerald-400 font-heading">
              {totalAvailableServings}
            </span>
          </div>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Source Filter:
          </span>
          {['All', 'Restaurant', 'Shop', 'Household', 'Institution'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'All' ? 'All Sources' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredAvailable.length}</strong> pending donations
        </span>
      </div>

      {/* Map View */}
      {filteredAvailable.length > 0 && (
        <div className="mb-6">
          <InteractiveMap height="350px" markers={mapMarkers} />
        </div>
      )}

      {/* Available Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAvailable.length === 0 ? (
          <div className="md:col-span-2 glass-panel p-12 text-center text-slate-400 rounded-3xl space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-slate-200">No Pending Donations in this Category</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All surplus food donations from waste givers have been reviewed or assigned to NGO volunteers.
            </p>
          </div>
        ) : (
          filteredAvailable.map((food) => (
            <div
              key={food.id}
              className="glass-panel rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
            >
              <div>
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={food.image || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400'}
                    alt={food.foodType}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white shadow-md">
                    {getCategoryIcon(food.donorCategory)}
                    <span>{food.donorCategory || 'Household'}</span>
                  </div>

                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {food.peopleServed} Meals Fed
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-amber-400 uppercase font-extrabold">
                        {food.donorName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {food.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-white font-heading mt-0.5">{food.foodType}</h3>
                    <p className="text-xs text-slate-400 mt-1">{food.description}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Quantity / Pack:</span>
                    <span className="font-bold text-emerald-400">{food.quantity}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Safe Until: <strong className="text-white">{food.safeUntilDateTime}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{food.pickupLocation}</span>
                    </div>
                    {food.contactPhone && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{food.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Accept or Reject */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setRejectingDonation(food)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => setSelectedDonation(food)}
                  className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Accept Food</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Accept Donation Modal */}
      <Modal isOpen={!!selectedDonation} onClose={() => setSelectedDonation(null)} title="Accept Surplus Food Donation" maxWidth="max-w-md">
        {selectedDonation && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase">{selectedDonation.donorName}</span>
              <h3 className="text-sm font-bold text-white">{selectedDonation.foodType}</h3>
              <p className="text-xs text-slate-400">{selectedDonation.quantity} • {selectedDonation.peopleServed} People Fed</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5" /> {selectedDonation.pickupLocation}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Doorstep Pickup Time *
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. Today 18:30 or Within 45 mins"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
              Accepting will dispatch an alert to the donor with your NGO details and ETA.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAcceptConfirm}
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xl shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Pickup</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Donation Modal */}
      <Modal isOpen={!!rejectingDonation} onClose={() => setRejectingDonation(null)} title="Decline Food Donation" maxWidth="max-w-md">
        {rejectingDonation && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-rose-400 font-bold uppercase">{rejectingDonation.donorName}</span>
              <h3 className="text-sm font-bold text-white">{rejectingDonation.foodType}</h3>
              <p className="text-xs text-slate-400">{rejectingDonation.quantity}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for Inability to Accept:
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="NGO vehicle capacity full for this zone">NGO vehicle capacity full for this zone</option>
                <option value="Outside current volunteer operational radius">Outside current volunteer operational radius</option>
                <option value="Safe consumption window too short for transit">Safe consumption window too short for transit</option>
                <option value="Shelter already met daily food requirement">Shelter already met daily food requirement</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingDonation(null)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Confirm Reject</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
