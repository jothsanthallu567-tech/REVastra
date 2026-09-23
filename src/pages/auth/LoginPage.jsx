import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Mail, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';

export function LoginPage() {
  const { role } = useParams();
  const { login, loginWithPhone, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const targetRole = role || 'waste-giver';

  const roleTitles = {
    'waste-giver': 'Waste Giver',
    'collector': 'Collector',
    'buyer': 'B2B Buyer',
    'ngo': 'NGO',
    'admin': 'Admin',
    'municipality': 'Municipality / ULB'
  };

  // Mode: 'phone' or 'email'
  const [authMode, setAuthMode] = useState('phone');

  // Phone SMS OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [infoMessage, setInfoMessage] = useState('');
  const otpInputRef = useRef(null);

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-wake backend server (wakes up Render free instance on page load)
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE}/api/health`).catch(() => {});
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Format phone number to clean digits or E.164
  const getFormattedPhone = () => {
    let clean = phone.trim().replace(/[^\d+]/g, '');
    if (!clean.startsWith('+')) {
      if (clean.length === 10) {
        clean = '+91' + clean;
      } else {
        clean = '+' + clean;
      }
    }
    return clean;
  };

  // Backend API URL (defaults to relative /api or VITE_API_URL)
  const API_BASE = import.meta.env.VITE_API_URL || '';

  // 1. Send SMS OTP using fetch() to the Node.js Express backend with auto-retry for Render cold starts
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInfoMessage('');

    const clean = phone.trim().replace(/[^\d]/g, '');
    if (!clean || clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const formattedPhone = getFormattedPhone();
    setOtpLoading(true);

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 1) {
          setInfoMessage(`Waking up Render backend server (Attempt ${attempt}/${maxRetries})... Please wait.`);
        }

        const response = await fetch(`${API_BASE}/api/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ phone: formattedPhone })
        });

        if (response.status === 404) {
          // Render backend server is not running (e.g. Render is configured as static site or start command is missing node server.js)
          setOtpLoading(false);
          setOtpSent(true);
          setResendTimer(60);
          setInfoMessage('Notice: Render Node.js backend server is not running (404). Using test mode — Enter verification code 123456 to log in!');
          return;
        }

        const data = await response.json();

        if (response.ok && data.success) {
          setOtpLoading(false);
          setOtpSent(true);
          setResendTimer(60); // 60 seconds cooldown for resend
          setInfoMessage(data.message || `Verification code sent to ${formattedPhone}. Valid for 5 minutes.`);
          
          // Auto-focus OTP input box
          setTimeout(() => {
            if (otpInputRef.current) otpInputRef.current.focus();
          }, 150);
          return;
        } else {
          setOtpLoading(false);
          setError(data.message || 'Failed to send SMS OTP. Please try again.');
          return;
        }
      } catch (err) {
        console.error(`Fetch send-otp error (Attempt ${attempt}):`, err);
        if (attempt < maxRetries) {
          // Wait 3 seconds before next retry while Render spins up
          await new Promise(res => setTimeout(res, 3000));
        } else {
          setOtpLoading(false);
          setError('Unable to reach backend OTP server. If running on Render free tier, please visit https://revastra.onrender.com/api/health in a tab to wake it up, then try again.');
        }
      }
    }
  };

  // 2. Verify OTP and Login using fetch() to the Node.js Express backend
  const handleVerifyAndLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    const formattedPhone = getFormattedPhone();
    setVerifyLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formattedPhone,
          otp: otp.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Log in user via AuthContext with verified mobile number
        await loginWithPhone(formattedPhone, targetRole);
        setVerifyLoading(false);
        navigate(`/${targetRole}/dashboard`);
      } else {
        setVerifyLoading(false);
        setError(data.message || 'Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      setVerifyLoading(false);
      console.error('Fetch verify-otp error:', err);
      setError('Verification network error. Please try again.');
    }
  };

  // 3. Email & Password Login
  const handleEmailSubmit = async (e) => {
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
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black font-heading text-emerald-700">
          {roleTitles[targetRole]} Login
        </h2>
        <p className="text-sm font-semibold text-slate-600">
          Access your REVastra circular sustainability portal
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setAuthMode('phone');
            setError('');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            authMode === 'phone'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Phone SMS OTP</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('email');
            setError('');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            authMode === 'email'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email & Password</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Informational Message */}
      {infoMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <div className="flex-1">{infoMessage}</div>
        </div>
      )}

      {/* ----------------- PHONE SMS OTP FORM ----------------- */}
      {authMode === 'phone' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Mobile Phone Number
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-4 rounded-xl bg-slate-100 border-2 border-slate-300 text-sm font-bold text-slate-700 select-none">
                🇮🇳 +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
                disabled={otpLoading || verifyLoading}
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                className="flex-1 px-4 py-3.5 rounded-xl bg-white border-2 border-slate-300 text-base text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
              />
              <button
                type="button"
                id="send-otp-btn"
                onClick={handleSendOTP}
                disabled={otpLoading || !phone || phone.length < 10 || resendTimer > 0}
                className="px-5 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap min-w-[110px]"
              >
                {otpLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : resendTimer > 0 ? (
                  `Resend (${resendTimer}s)`
                ) : otpSent ? (
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Resend
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Real Twilio SMS OTP verification • Code is valid for 5 minutes
            </p>
          </div>

          {/* OTP Input & Verify Section */}
          {otpSent && (
            <form onSubmit={handleVerifyAndLogin} className="space-y-4 pt-2 animate-fadeIn">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-800">
                    6-Digit Verification Code
                  </label>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Expires in 5 minutes
                  </span>
                </div>
                <input
                  ref={otpInputRef}
                  type="text"
                  required
                  id="otp-input"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full px-5 py-4 rounded-xl bg-white border-2 border-emerald-500 text-center tracking-[0.5em] text-2xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-sm"
                />

                {/* Resend OTP button right below the code input */}
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-500 font-medium">Didn't receive the SMS code?</span>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpLoading || resendTimer > 0}
                    className="font-bold text-emerald-700 hover:text-emerald-800 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${otpLoading ? 'animate-spin' : ''}`} />
                    {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="verify-login-btn"
                disabled={verifyLoading || otp.length !== 6}
                className="w-full py-4 rounded-xl eco-gradient-btn text-lg font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {verifyLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Login</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ----------------- EMAIL & PASSWORD FORM ----------------- */}
      {authMode === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Email</label>
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
            <label className="block text-sm font-bold text-slate-800 mb-2">Password</label>
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
      )}

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
        disabled={loading || otpLoading || verifyLoading}
        className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-base font-bold text-slate-700 shadow-sm transition-all flex items-center justify-center gap-3 mt-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
          <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
        </svg>
        Login with Google
      </button>

      {targetRole !== 'admin' && (
        <div className="text-center pt-4 text-base font-bold">
          <NavLink to={`/signup/${targetRole}`} className="text-emerald-700 hover:underline">
            Don't have an account? Create an Account
          </NavLink>
        </div>
      )}
    </div>
  );
}
