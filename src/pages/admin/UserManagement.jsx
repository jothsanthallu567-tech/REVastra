import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { fetchCollectionFromFirestore, syncDocToFirestore } from '../../services/firebase';
import { INITIAL_USERS } from '../../services/mockData';
import { getStoredState, saveState } from '../../services/apiService';
import { generateSourceQR } from '../../services/qrService';
import {
  Users,
  Search,
  ShieldCheck,
  RefreshCw,
  Coins,
  QrCode,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Database,
  Sparkles,
  UserCheck,
  UserPlus,
  Plus,
  X,
  Lock
} from 'lucide-react';

const normalizeRole = (r) => {
  if (!r) return '';
  const lower = r.toLowerCase().trim().replace(/[\s_]/g, '-');
  if (lower.includes('giver') || lower.includes('household')) return 'waste-giver';
  if (lower.includes('collector') || lower.includes('picker')) return 'collector';
  if (lower.includes('buyer') || lower.includes('recycler') || lower.includes('industry')) return 'buyer';
  if (lower.includes('ngo') || lower.includes('foundation') || lower.includes('food')) return 'ngo';
  if (lower.includes('admin') || lower.includes('director')) return 'admin';
  return lower;
};

export function AdminUserManagement() {
  const { data, refreshData, registerUser } = useData();
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [cloudSynced, setCloudSynced] = useState(false);
  const [cloudUsers, setCloudUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'waste-giver',
    phone: '',
    address: '',
    sourceType: 'Household',
    businessType: 'Plastic Recycler',
    registrationNo: ''
  });

  // Auto sync cloud on mount & listen to storage events
  useEffect(() => {
    handleCloudSync(true);

    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('revastra_storage_updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('revastra_storage_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Guarantee ALL signed up users from every possible source are displayed
  const masterUsers = useMemo(() => {
    const userMap = new Map();
    const emailMap = new Map();

    // 1. Seed initial preset users
    (INITIAL_USERS || []).forEach((u) => {
      if (u.id) userMap.set(u.id, u);
      if (u.email) emailMap.set(u.email.toLowerCase().trim(), u.id);
    });

    // 2. Layer directly from localStorage persistent state
    try {
      const localState = getStoredState();
      (localState?.users || []).forEach((u) => {
        const emailKey = (u.email || '').toLowerCase().trim();
        if (emailKey && emailMap.has(emailKey)) {
          const existingId = emailMap.get(emailKey);
          userMap.set(existingId, { ...(userMap.get(existingId) || {}), ...u });
        } else if (u.id) {
          userMap.set(u.id, { ...(userMap.get(u.id) || {}), ...u });
          if (emailKey) emailMap.set(emailKey, u.id);
        }
      });
    } catch (e) {}

    // 3. Layer from reactive DataContext
    (data.users || []).forEach((u) => {
      const emailKey = (u.email || '').toLowerCase().trim();
      if (emailKey && emailMap.has(emailKey)) {
        const existingId = emailMap.get(emailKey);
        userMap.set(existingId, { ...(userMap.get(existingId) || {}), ...u });
      } else if (u.id) {
        userMap.set(u.id, { ...(userMap.get(u.id) || {}), ...u });
        if (emailKey) emailMap.set(emailKey, u.id);
      }
    });

    // 4. Layer from any Cloud Firestore users
    (cloudUsers || []).forEach((u) => {
      const emailKey = (u.email || '').toLowerCase().trim();
      if (emailKey && emailMap.has(emailKey)) {
        const existingId = emailMap.get(emailKey);
        userMap.set(existingId, { ...(userMap.get(existingId) || {}), ...u });
      } else if (u.id) {
        userMap.set(u.id, { ...(userMap.get(u.id) || {}), ...u });
        if (emailKey) emailMap.set(emailKey, u.id);
      }
    });

    // 5. Layer active session user if present
    try {
      const sessionUserRaw = localStorage.getItem('revastra_session_user');
      if (sessionUserRaw) {
        const su = JSON.parse(sessionUserRaw);
        if (su && su.id) {
          const emailKey = (su.email || '').toLowerCase().trim();
          if (emailKey && emailMap.has(emailKey)) {
            const existingId = emailMap.get(emailKey);
            userMap.set(existingId, { ...(userMap.get(existingId) || {}), ...su });
          } else {
            userMap.set(su.id, { ...(userMap.get(su.id) || {}), ...su });
          }
        }
      }
    } catch (e) {}

    return Array.from(userMap.values());
  }, [data.users, cloudUsers]);

  const handleCloudSync = async (silent = false) => {
    if (!silent) setLoadingCloud(true);
    try {
      const cloudRes = await fetchCollectionFromFirestore('users');
      if (cloudRes.success && cloudRes.data && cloudRes.data.length > 0) {
        setCloudUsers(cloudRes.data);
        // Also ensure they are stored locally
        const state = getStoredState();
        const existingMap = new Map((state.users || []).map((u) => [u.id, u]));
        cloudRes.data.forEach((u) => {
          existingMap.set(u.id, { ...(existingMap.get(u.id) || {}), ...u });
        });
        const updatedState = { ...state, users: Array.from(existingMap.values()) };
        saveState(updatedState);
        refreshData();
        setCloudSynced(true);
      }
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }
    if (!silent) setLoadingCloud(false);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const newId = `usr-${newUserForm.role}-${Date.now().toString().slice(-4)}`;
    const qrCode = newUserForm.role === 'waste-giver' ? generateSourceQR({ id: newId }) : null;
    const userObj = {
      id: newId,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      phone: newUserForm.phone || '+91 98765 00000',
      address: newUserForm.address || 'Registered Office / Household',
      sourceType: newUserForm.role === 'waste-giver' ? (newUserForm.sourceType || 'Household') : '',
      businessType: newUserForm.role === 'buyer' ? (newUserForm.businessType || 'Plastic Recycler') : '',
      registrationNo: newUserForm.role === 'ngo' ? (newUserForm.registrationNo || 'NGO-KA-2026') : '',
      qrCode,
      greenCoinsBalance: newUserForm.role === 'waste-giver' ? 100 : 0,
      baseCoinsToday: 0,
      streakDays: 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newUserForm.name)}`
    };

    registerUser(userObj);
    syncDocToFirestore('users', userObj.id, userObj).catch(() => {});
    setShowAddModal(false);
    setNewUserForm({
      name: '',
      email: '',
      role: 'waste-giver',
      phone: '',
      address: '',
      sourceType: 'Household',
      businessType: 'Plastic Recycler',
      registrationNo: ''
    });
    alert(`User "${userObj.name}" successfully registered and provisioned in Ecosystem Directory!`);
  };

  const filteredUsers = masterUsers.filter((u) => {
    const userRoleNorm = normalizeRole(u.role);
    const filterRoleNorm = normalizeRole(filterRole);
    const matchesRole = filterRole === 'All' || userRoleNorm === filterRoleNorm;

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term)) ||
      (u.qrCode && u.qrCode.toLowerCase().includes(term)) ||
      (u.id && u.id.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term)) ||
      (u.sourceType && u.sourceType.toLowerCase().includes(term)) ||
      (u.businessType && u.businessType.toLowerCase().includes(term)) ||
      (u.registrationNo && u.registrationNo.toLowerCase().includes(term)) ||
      (u.vehicleNo && u.vehicleNo.toLowerCase().includes(term)) ||
      (u.collectorBadgeId && u.collectorBadgeId.toLowerCase().includes(term)) ||
      (u.address && u.address.toLowerCase().includes(term));

    return matchesRole && matchesSearch;
  });

  const countByRole = (role) => {
    const roleNorm = normalizeRole(role);
    return masterUsers.filter((u) => normalizeRole(u.role) === roleNorm).length;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              Ecosystem User Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Database className="w-3 h-3" />
              All Users Verified ({masterUsers.length})
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time unified directory for all registered Waste Givers, Collectors, B2B Recyclers, NGOs & System Admins.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Provision User</span>
          </button>

          <button
            onClick={() => handleCloudSync(false)}
            disabled={loadingCloud}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingCloud ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
            <span>{loadingCloud ? 'Syncing...' : 'Sync Cloud Directory'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { role: 'All', label: 'Total Users', count: masterUsers.length, color: 'text-white', bg: 'bg-slate-900/90' },
          { role: 'waste-giver', label: 'Waste Givers', count: countByRole('waste-giver'), color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-500/20' },
          { role: 'collector', label: 'Collectors', count: countByRole('collector'), color: 'text-blue-400', bg: 'bg-blue-950/20 border-blue-500/20' },
          { role: 'buyer', label: 'B2B Buyers', count: countByRole('buyer'), color: 'text-purple-400', bg: 'bg-purple-950/20 border-purple-500/20' },
          { role: 'ngo', label: 'NGO Partners', count: countByRole('ngo'), color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-500/20' },
          { role: 'admin', label: 'Administrators', count: countByRole('admin'), color: 'text-rose-400', bg: 'bg-rose-950/20 border-rose-500/20' }
        ].map((st) => (
          <button
            key={st.label}
            onClick={() => setFilterRole(st.role)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterRole === st.role
                ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/50'
                : `border-slate-800 ${st.bg} hover:border-slate-700`
            }`}
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">{st.label}</span>
            <span className={`text-2xl font-black font-heading ${st.color}`}>{st.count}</span>
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { key: 'All', label: 'All Users' },
              { key: 'waste-giver', label: 'Waste Givers' },
              { key: 'collector', label: 'Collectors' },
              { key: 'buyer', label: 'B2B Buyers' },
              { key: 'ngo', label: 'NGOs' },
              { key: 'admin', label: 'Admins' }
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setFilterRole(r.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  filterRole === r.key
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, QR, ID, address..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Complete User Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            Displaying all {filteredUsers.length} active registered users
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> 100% Comprehensive Coverage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role & Authority</th>
                <th className="px-6 py-4">Contact Information</th>
                <th className="px-6 py-4">Category / Location</th>
                <th className="px-6 py-4">Green Coins Balance</th>
                <th className="px-6 py-4">Identity / QR Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    No registered users match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || 'User')}`}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{u.name || 'Registered User'}</p>
                          <span className="text-[10px] text-slate-400 font-mono block">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={u.role} />
                      {u.authProvider === 'google.com' && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-cyan-400 font-medium block">
                          <Sparkles className="w-2.5 h-2.5" /> Google Auth
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[200px]">{u.email}</span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{u.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-slate-200 font-medium block">
                        {u.sourceType || u.businessType || u.department || 'Active Account'}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                        {u.address || u.assignedZone || 'Location Registered'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {u.greenCoinsBalance !== undefined ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
                          <Coins className="w-3.5 h-3.5" />
                          {u.greenCoinsBalance} Coins
                          <span className="text-[10px] text-slate-400 ml-0.5 font-normal">(₹{(u.greenCoinsBalance / 100).toFixed(2)})</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {u.qrCode ? (
                        <span className="font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs">
                          {u.qrCode}
                        </span>
                      ) : (
                        <span className="font-mono text-slate-400 text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {u.registrationNo || u.vehicleNo || u.collectorBadgeId || u.id}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Provision User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Provision Ecosystem User</h3>
                  <p className="text-xs text-slate-400">Add a new verified account to the platform directory</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name / Org Name *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Recyclers / Smt. Rekha"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="user@domain.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Type *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="waste-giver">Waste Giver (Household/Comm)</option>
                    <option value="collector">Authorized Waste Collector</option>
                    <option value="buyer">B2B Recycler / Industrial Buyer</option>
                    <option value="ngo">NGO / Food Rescue Partner</option>
                    <option value="admin">System Directorate Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {newUserForm.role === 'waste-giver' ? 'Source Type' : newUserForm.role === 'buyer' ? 'Industry Type' : 'Department/Zone'}
                  </label>
                  <input
                    type="text"
                    value={newUserForm.sourceType}
                    onChange={(e) => setNewUserForm({ ...newUserForm, sourceType: e.target.value, businessType: e.target.value })}
                    placeholder="e.g. Household / Plastic Recycler / North Zone"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Station</label>
                <input
                  type="text"
                  value={newUserForm.address}
                  onChange={(e) => setNewUserForm({ ...newUserForm, address: e.target.value })}
                  placeholder="Sector, Ward, City"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Provision & Activate Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
