import React, { useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { role } = useParams();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const targetRole = role || 'waste-giver';

  const roleTitles = {
    'waste-giver': 'Waste Giver',
    'collector': 'Collector',
    'buyer': 'B2B Buyer',
    'ngo': 'NGO',
    'admin': 'Admin'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await login(email.trim(), password.trim(), targetRole);
      setLoading(false);
      if (res.success) {
        navigate(`/${targetRole}/dashboard`);
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    } catch (err) {
      setLoading(false);
      setError('Authentication failed.');
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-300 shadow-2xl space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-black font-heading text-emerald-700">{roleTitles[targetRole]} Login</h2>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 text-lg font-bold flex items-center gap-2">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-bold text-slate-800 mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-slate-300 text-lg text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>

        <div className="relative">
          <label className="block text-lg font-bold text-slate-800 mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-5 py-4 rounded-xl bg-white border-2 border-slate-300 text-lg text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-2"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl eco-gradient-btn text-xl font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-3"
        >
          {loading ? 'Wait...' : 'Login'}
          <ArrowRight className="w-6 h-6" />
        </button>
      </form>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={async () => {
          setLoading(true);
          try {
            await loginWithGoogle(targetRole);
            setLoading(false);
            navigate(`/${targetRole}/dashboard`);
          } catch (err) {
            setLoading(false);
            navigate(`/${targetRole}/dashboard`);
          }
        }}
        disabled={loading}
        className="w-full py-4 px-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-lg font-bold text-slate-700 shadow-md transition-all flex items-center justify-center gap-3 mt-4"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
          <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
        </svg>
        Login with Google
      </button>

      {targetRole !== 'admin' && (
        <div className="text-center pt-6 text-lg font-bold">
          <NavLink to={`/signup/${targetRole}`} className="text-emerald-700 hover:underline">
            Create an Account
          </NavLink>
        </div>
      )}
    </div>
  );
}
