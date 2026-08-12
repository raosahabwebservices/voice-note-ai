import React, { useState } from 'react';
import { UserProfile, ActiveTab } from '../types';
import { Shield, Mail, Lock, User, Phone, Globe, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface AuthViewProps {
  currentUser: UserProfile | null;
  onLogin: (email: string, pass: string) => boolean;
  onSignup: (profile: Omit<UserProfile, 'id' | 'createdAt'>, pass: string) => boolean;
  onLogout: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  showToast: (msg: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  onLogin,
  onSignup,
  onLogout,
  setActiveTab,
  showToast,
}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('India (+91)');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter email and password.');
      return;
    }

    if (isSignup) {
      if (!fullName || !phone) {
        showToast('Please fill in your full name and phone number.');
        return;
      }
      const success = onSignup({
        fullName,
        email: email.trim().toLowerCase(),
        country,
        phone,
        isAdmin: email.trim().toLowerCase() === 'hy399035@gmail.com' || email.trim().toLowerCase() === 'raos38908@gmail.com',
        isPremium: email.trim().toLowerCase() === 'hy399035@gmail.com' || email.trim().toLowerCase() === 'raos38908@gmail.com',
      }, password);

      if (success) {
        showToast('Account created successfully! Welcome to VoiceNotes AI.');
        setActiveTab(email.trim().toLowerCase() === 'hy399035@gmail.com' ? 'admin' : 'notes');
      } else {
        showToast('Email already registered or invalid details.');
      }
    } else {
      const success = onLogin(email.trim().toLowerCase(), password);
      if (success) {
        showToast('Logged in successfully!');
        if (email.trim().toLowerCase() === 'hy399035@gmail.com') {
          setActiveTab('admin');
        } else {
          setActiveTab('notes');
        }
      } else {
        showToast('Invalid email or password. (Hint: Try hy399035@gmail.com or signup)');
      }
    }
  };

  if (currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto text-2xl font-bold">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">{currentUser.fullName}</h2>
            <p className="text-sm text-slate-400">{currentUser.email}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              currentUser.isAdmin ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300'
            }`}>
              {currentUser.isAdmin ? '👑 Admin' : '👤 Member'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              currentUser.isPremium ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {currentUser.isPremium ? '⚡ Premium Lifetime' : '🔒 Payment Pending'}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            {currentUser.isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Open Admin Panel (/admin)</span>
              </button>
            )}

            {!currentUser.isPremium && !currentUser.isAdmin && (
              <button
                onClick={() => setActiveTab('presale')}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>View Payment & Pre-Sale Details (₹1,999)</span>
              </button>
            )}

            <button
              onClick={() => {
                onLogout();
                showToast('Logged out successfully.');
              }}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isSignup ? 'Create VoiceNotes AI Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignup ? 'Register to access voice AI & pre-sale lifetime deal' : 'Sign in to access your smart voice notes'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                      <option>India (+91)</option>
                      <option>United States (+1)</option>
                      <option>United Kingdom (+44)</option>
                      <option>UAE (+971)</option>
                      <option>Singapore (+65)</option>
                      <option>Canada (+1)</option>
                      <option>Australia (+61)</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">WhatsApp / Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@example.com (Admin: hy399035@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSignup ? 'Create Account & Start' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
          </button>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">Admin Credentials Test:</p>
          <p>Email: <code className="text-indigo-300">hy399035@gmail.com</code> (Auto-assigned Admin & Premium)</p>
        </div>
      </div>
    </div>
  );
};
