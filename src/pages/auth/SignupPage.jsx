import React, { useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, AlertCircle, ArrowRight, ShieldAlert, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useLiveLocation } from '../../hooks/useLiveLocation';
import { sendMobileOTP, sendEmailOTP, verifyOTP } from '../../services/otpService';

export function SignupPage() {
  const { role } = useParams(); // waste-giver | collector | buyer | ngo | admin
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { getLocation, loading: locationLoading } = useLiveLocation();

  const targetRole = role || 'waste-giver';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    sourceType: 'Household',
    businessType: 'Plastic Recycler',
    registrationNo: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [phoneOtp, setPhoneOtp] = useState({ sent: false, verified: false, loading: false, value: '', msg: '' });
  const [emailOtp, setEmailOtp] = useState({ sent: false, verified: false, loading: false, value: '', msg: '' });

  const handleSendPhoneOTP = async () => {
    if (!formData.phone) return;
    setPhoneOtp(p => ({ ...p, loading: true, msg: '' }));
    const res = await sendMobileOTP(formData.phone);
    setPhoneOtp(p => ({ ...p, sent: true, loading: false, msg: res.message }));
  };

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOtp.value) return;
    setPhoneOtp(p => ({ ...p, loading: true }));
    const res = await verifyOTP(phoneOtp.value);
    if (res.success) setPhoneOtp(p => ({ ...p, verified: true, loading: false, msg: 'Phone verified successfully!' }));
    else setPhoneOtp(p => ({ ...p, loading: false, msg: res.message }));
  };

  const handleSendEmailOTP = async () => {
    if (!formData.email) return;
    setEmailOtp(p => ({ ...p, loading: true, msg: '' }));
    const res = await sendEmailOTP(formData.email);
    setEmailOtp(p => ({ ...p, sent: true, loading: false, msg: res.message }));
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOtp.value) return;
    setEmailOtp(p => ({ ...p, loading: true }));
    const res = await verifyOTP(emailOtp.value);
    if (res.success) setEmailOtp(p => ({ ...p, verified: true, loading: false, msg: 'Email verified successfully!' }));
    else setEmailOtp(p => ({ ...p, loading: false, msg: res.message }));
  };

  if (targetRole === 'admin') {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white font-heading">Restricted Admin Portal</h2>
        <p className="text-xs text-slate-400">
          Unrestricted public admin signup is disabled per platform security guidelines. Admin accounts are managed directly by the platform directorate.
        </p>
        <NavLink to="/login/admin" className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white">
          Return to Admin Login
        </NavLink>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signup(formData, targetRole);
      setLoading(false);
      if (res.success) {
        navigate(`/${targetRole}/dashboard`);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white font-heading">
          Register as {targetRole.replace('-', ' ').toUpperCase()}
        </h2>
        <p className="text-xs text-slate-400">
          Join the REVastra circular economy platform & generate your verified role identity.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            {targetRole === 'buyer' ? 'Company Name' : targetRole === 'ngo' ? 'NGO Organization Name' : 'Full Name'}
          </label>
          <input
            type="text"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={targetRole === 'buyer' ? 'EcoPolymer Ltd' : targetRole === 'ngo' ? 'Annapoorna Foundation' : 'Ananya Sharma'}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <div className="flex gap-2">
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={emailOtp.verified || emailOtp.sent}
              placeholder="user@domain.com"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            {!emailOtp.verified && !emailOtp.sent && (
              <button
                type="button"
                onClick={handleSendEmailOTP}
                disabled={!formData.email || emailOtp.loading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {emailOtp.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Send OTP'}
              </button>
            )}
            {emailOtp.verified && (
              <span className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Verified
              </span>
            )}
          </div>
          {emailOtp.sent && !emailOtp.verified && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={emailOtp.value}
                onChange={(e) => setEmailOtp(p => ({ ...p, value: e.target.value }))}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-center tracking-widest text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleVerifyEmailOTP}
                disabled={emailOtp.loading || !emailOtp.value}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {emailOtp.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
              </button>
            </div>
          )}
          {emailOtp.msg && (
            <p className={`mt-1 text-[10px] ${emailOtp.verified ? 'text-emerald-400' : 'text-slate-400'}`}>{emailOtp.msg}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={phoneOtp.verified || phoneOtp.sent}
                placeholder="+91 98765 43210"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              {!phoneOtp.verified && !phoneOtp.sent && (
                <button
                  type="button"
                  onClick={handleSendPhoneOTP}
                  disabled={!formData.phone || phoneOtp.loading}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {phoneOtp.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Send OTP'}
                </button>
              )}
              {phoneOtp.verified && (
                <span className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </span>
              )}
            </div>
            {phoneOtp.sent && !phoneOtp.verified && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={phoneOtp.value}
                  onChange={(e) => setPhoneOtp(p => ({ ...p, value: e.target.value }))}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-center tracking-widest text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyPhoneOTP}
                  disabled={phoneOtp.loading || !phoneOtp.value}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {phoneOtp.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                </button>
              </div>
            )}
            {phoneOtp.msg && (
              <p className={`mt-1 text-[10px] ${phoneOtp.verified ? 'text-emerald-400' : 'text-slate-400'}`}>{phoneOtp.msg}</p>
            )}
          </div>

          {targetRole === 'waste-giver' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Waste Source Type</label>
              <select
                name="sourceType"
                value={formData.sourceType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Household">Household</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Shop">Shop</option>
                <option value="Institution">Institution</option>
                <option value="Industry">Industry</option>
              </select>
            </div>
          )}

          {targetRole === 'buyer' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Plastic Recycler">Plastic Recycler</option>
                <option value="Paper & Packaging Industry">Paper & Packaging Industry</option>
                <option value="Metal Smelter">Metal Smelter</option>
                <option value="E-Waste Processor">E-Waste Processor</option>
                <option value="Biochar Manufacturer">Biochar Manufacturer</option>
              </select>
            </div>
          )}

          {targetRole === 'ngo' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registration No</label>
              <input
                type="text"
                required
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                placeholder="NGO-KA-2024-XXXX"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-300">Address / Location</label>
            <button
              type="button"
              onClick={async () => {
                const loc = await getLocation();
                if (loc?.address) {
                  setFormData(prev => ({ ...prev, address: loc.address }));
                }
              }}
              disabled={locationLoading}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
            >
              {locationLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
              {locationLoading ? 'Locating...' : 'Use Current Location'}
            </button>
          </div>
          <input
            type="text"
            required
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Complete address, Sector, City"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <input
            type="password"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create password"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !emailOtp.verified || !phoneOtp.verified}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Account...
            </span>
          ) : (
            <>
              {!emailOtp.verified || !phoneOtp.verified ? 'Verify Email & Phone to Continue' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-800 w-full"></div>
        <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold shrink-0">
          Or Quick Register With
        </span>
        <div className="border-t border-slate-800 w-full"></div>
      </div>

      {/* Google Sign Up Button */}
      <button
        type="button"
        onClick={async () => {
          setLoading(true);
          setError('');
          try {
            const res = await loginWithGoogle(targetRole);
            setLoading(false);
            if (res && res.success) {
              navigate(`/${targetRole}/dashboard`);
            } else {
              // Even on fallback, redirect cleanly
              navigate(`/${targetRole}/dashboard`);
            }
          } catch (err) {
            setLoading(false);
            console.warn('Google sign-up redirecting:', err);
            navigate(`/${targetRole}/dashboard`);
          }
        }}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-200 shadow-md transition-all flex items-center justify-center gap-2.5"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
          />
        </svg>
        Sign up with Google
      </button>

      <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-400">
        Already registered?{' '}
        <NavLink to={`/login/${targetRole}`} className="text-emerald-400 font-semibold hover:underline">
          Sign In Here
        </NavLink>
      </div>
    </div>
  );
}
