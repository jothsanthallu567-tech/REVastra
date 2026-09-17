import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import {
  Heart,
  Utensils,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Home,
  Store,
  Sparkles,
  ShieldCheck,
  Send,
  Calendar,
  XCircle,
  Truck
} from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    category: 'Restaurant',
    title: 'Buffet Surplus Rice, Gravy & Roti',
    quantity: '40 Servings',
    peopleServed: 40,
    safeHours: 6,
    storage: 'Insulated Hot Container (FSSAI standard)',
    desc: 'Surplus untouched lunch buffet items packed in food-grade foil containers.',
    icon: Utensils
  },
  {
    category: 'Shop',
    title: 'Fresh Bakery Breads & Fruit Packets',
    quantity: '25 Packets',
    peopleServed: 25,
    safeHours: 12,
    storage: 'Dry Ambient Shelf Packaged',
    desc: 'Unsold day-fresh whole wheat loaves and seasonal fruit baskets.',
    icon: Store
  },
  {
    category: 'Household',
    title: 'Home Cooked Rice & Dal Meal Boxes',
    quantity: '15 Meals',
    peopleServed: 15,
    safeHours: 5,
    storage: 'Clean Sealed Containers',
    desc: 'Prepared extra for family gathering, freshly made 1 hour ago.',
    icon: Home
  }
];

export function DonateFoodPage() {
  const { currentUser } = useAuth();
  const { data, createFoodDonation } = useData();

  const [donorCategory, setDonorCategory] = useState(currentUser?.sourceType || 'Household');
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [peopleServed, setPeopleServed] = useState('');
  const [safeUntilHours, setSafeUntilHours] = useState(6);
  const [pickupLocation, setPickupLocation] = useState(currentUser?.address || '128 Commercial Street, Bengaluru');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98450 11223');
  const [storageInstructions, setStorageInstructions] = useState('Kept hygienically covered at controlled temperature');
  const [description, setDescription] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('donate'); // 'donate' | 'history'

  // Filter donations belonging to this waste giver
  const myDonations = data.foodDonations.filter(
    (f) => f.donorUserId === currentUser?.id || f.donorName === currentUser?.name
  );

  const applyTemplate = (tpl) => {
    setDonorCategory(tpl.category);
    setFoodType(tpl.title);
    setQuantity(tpl.quantity);
    setPeopleServed(tpl.peopleServed);
    setSafeUntilHours(tpl.safeHours);
    setStorageInstructions(tpl.storage);
    setDescription(tpl.desc);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodType || !quantity || !peopleServed) {
      alert('Please fill in food item name, quantity and estimated people served.');
      return;
    }

    createFoodDonation({
      donorUser: currentUser || { id: 'usr-giver-1', name: 'Waste Giver', address: pickupLocation, phone: contactPhone },
      donorCategory,
      foodType,
      quantity,
      peopleServed,
      safeUntilHours,
      pickupLocation,
      contactPhone,
      description,
      storageInstructions
    });

    setSubmittedSuccess(true);
    // Reset form fields
    setFoodType('');
    setQuantity('');
    setPeopleServed('');
    setDescription('');
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('history');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Surplus Food Rescue • Waste Givers Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Donate Surplus Food to Verified NGOs
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Households, restaurants, grocery shops, and cafeterias can donate edible unserved meals. Verified NGOs will receive instant notifications to review, accept, and schedule rapid doorstep pickup.
          </p>
        </div>

        <div className="flex gap-2 relative z-10 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('donate')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'donate'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Donate Food Now</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>My Donations ({myDonations.length})</span>
          </button>
        </div>
      </div>

      {submittedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold">Surplus Food Donation Broadcasted Successfully!</p>
            <p className="text-[11px] text-emerald-400/90 mt-0.5">
              Verified food rescue NGOs have been notified. Once an NGO accepts your donation, pickup schedule details will appear under "My Donations".
            </p>
          </div>
        </div>
      )}

      {activeTab === 'donate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Donation Form */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Food Donation Details</h2>
              <p className="text-xs text-slate-400">Specify safe consumption window and quantity for NGO dispatch.</p>
            </div>

            {/* Quick Templates */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                1-Click Preset Templates
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESET_TEMPLATES.map((tpl, idx) => {
                  const Icon = tpl.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-rose-500/40 hover:bg-slate-900 text-left transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-white truncate">{tpl.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium truncate">{tpl.title}</p>
                      <span className="text-[10px] text-amber-400">{tpl.quantity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Donor Entity Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  I am Donating As:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Household', icon: Home, label: 'Household' },
                    { id: 'Restaurant', icon: Utensils, label: 'Restaurant / Hotel' },
                    { id: 'Shop', icon: Store, label: 'Shop / Supermarket' },
                    { id: 'Institution', icon: Building2, label: 'Cafeteria / Hostel' }
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = donorCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setDonorCategory(cat.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Food Item Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Food Item Name & Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Steamed Rice, Dal Tadka & 40 Phulkas"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Servings & People Feedable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quantity / Volume *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 Servings / 15 kg"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated People Fed (Count) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 40"
                    value={peopleServed}
                    onChange={(e) => setPeopleServed(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Safe Consumption Window */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Safe for Consumption For: <strong className="text-amber-400">{safeUntilHours} Hours</strong>
                  </label>
                  <span className="text-[10px] text-slate-400">FSSAI food safety window</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  step="1"
                  value={safeUntilHours}
                  onChange={(e) => setSafeUntilHours(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>2 hrs (Quick rescue)</span>
                  <span>6 hrs (Standard)</span>
                  <span>12 hrs</span>
                  <span>24 hrs (Packaged)</span>
                </div>
              </div>

              {/* Storage Instructions & Condition */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Storage Condition / Packaging
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stored in insulated hot containers / Clean sealed foil boxes"
                  value={storageInstructions}
                  onChange={(e) => setStorageInstructions(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Pickup Address & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Doorstep Pickup Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full address for NGO pickup"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98450 11223"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Additional Notes for NGO Volunteer (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Ring the bell at back gate, containers are ready for immediate loading."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-extrabold shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Submit Food Donation to NGOs</span>
              </button>
            </form>
          </div>

          {/* Right Column: Safety Guidelines & Impact */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Food Safety Protocol</h3>
                  <p className="text-[11px] text-slate-400">Zero-waste hygiene criteria</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unserved & Fresh:</strong> Food must not have been partially consumed by customers or family.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Clean Containers:</strong> Packaged in stainless steel pots, thermal boxes, or food-grade containers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Rapid Logistics:</strong> NGOs are notified within seconds and coordinate doorstep pickup.</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wide">Food Rescue Impact</span>
              </div>
              <p className="text-xs text-slate-300">
                Over <strong className="text-amber-400">8,400+ meals</strong> have been saved across Bengaluru through REVastra's donor-to-NGO network, preventing organic methane emissions and feeding local shelters.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* My Food Donations History Tab */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">My Submitted Food Donations</h2>
              <p className="text-xs text-slate-400">Real-time status of NGO reviews and scheduled pickups</p>
            </div>
            <button
              onClick={() => setActiveTab('donate')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate More Food</span>
            </button>
          </div>

          {myDonations.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No food donations submitted yet.</p>
              <p className="text-xs text-slate-500">
                Whenever you have surplus cooked food, groceries or bakery stock, list it here for instant NGO pickup.
              </p>
              <button
                onClick={() => setActiveTab('donate')}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold"
              >
                Create First Donation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {myDonations.map((food) => (
                <div
                  key={food.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-rose-400 font-extrabold uppercase">
                          {food.donorCategory || 'Household'} Donation
                        </span>
                        <h3 className="text-sm font-bold text-white font-heading">{food.foodType}</h3>
                      </div>
                      <StatusBadge status={food.status} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">
                        {food.quantity}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-emerald-400 font-bold">{food.peopleServed} People Fed</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{food.description}</p>

                    <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Safe Until: <strong className="text-slate-200">{food.safeUntilDateTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">{food.pickupLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Status Callout */}
                  <div className="pt-2 border-t border-slate-900">
                    {food.status === 'Accepted' ? (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Accepted by: {food.acceptedByNgoName || 'Verified NGO'}
                        </p>
                        <p className="text-slate-300">
                          Pickup Time: <strong className="text-white">{food.scheduledPickupTime || 'Today 18:30'}</strong>
                        </p>
                      </div>
                    ) : food.status === 'Rejected' ? (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 space-y-0.5">
                        <p className="font-bold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          Not Picked Up
                        </p>
                        <p className="text-slate-300">{food.rejectionReason || 'NGO capacity full in this sector.'}</p>
                      </div>
                    ) : food.status === 'Delivered' ? (
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Successfully Distributed to Community</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Awaiting NGO volunteer acceptance...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
