import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Globe2,
  Palette,
  ChevronDown
} from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';

export default function LoginPage({ onLoginSuccess, onSkipToDemo }) {
  const { login, lang, setLang, t } = useAuth();
  const { currentTheme, setCurrentTheme, themes, theme } = useTheme();
  const { withLoading } = useLoading();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Prevent browser back/forward while on login screen
  useEffect(() => {
    window.history.pushState({ page: 'login' }, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState({ page: 'login' }, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError(lang === 'kh' ? 'សូមបញ្ចូលឈ្មោះ និងលេខសម្ងាត់' : 'Please provide identifier and password');
      return;
    }

    setError('');

    await withLoading(
      lang === 'kh' ? 'កំពុងផ្ទៀងផ្ទាត់គណនីចូលប្រព័ន្ធ...' : 'Authenticating Terminal Officer Credentials...',
      async () => {
        try {
          const res = await authService.login(identifier, password);
          const data = res.data;
          const isTeller = (data.username || identifier).toLowerCase() === 'teller';
          const isAdminUser = (data.username || identifier).toLowerCase().includes('admin');
          login(data.token, {
            username: data.username || identifier,
            role: data.role || (isAdminUser ? 'ROLE_ADMIN' : 'ROLE_TELLER'),
            fullName: isAdminUser ? 'System Administrator' : (isTeller ? 'Teller Officer' : (data.username || 'Bank Officer')),
            email: data.email || `${identifier}@trustbank.com`,
          });
          if (onLoginSuccess) {
            onLoginSuccess(
              lang === 'kh'
                ? `សូមស្វាគមន៍ការចូលប្រើប្រាស់, ${data.username || identifier}!`
                : `Welcome back, ${data.username || identifier}!`
            );
          }
        } catch (err) {
          console.warn('Backend login error:', err);
          const rawMsg = err.response?.data?.message || '';
          const isTechnical = rawMsg.includes('unexpected error') || rawMsg.includes('No static resource') || rawMsg.includes('Internal Server Error');
          
          if (err.response?.status === 401 || err.response?.status === 400) {
            setError(!isTechnical && rawMsg ? rawMsg : (lang === 'kh' ? 'ឈ្មោះ ឬលេខសម្ងាត់មិនត្រឹមត្រូវ' : 'Invalid credentials. Please verify your login info.'));
          } else {
            setError(!isTechnical && rawMsg ? rawMsg : (lang === 'kh' ? 'មិនអាចតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ Server បានទេ។ សូមព្យាយាមម្តងទៀត!' : 'Cannot connect to server. Please try again.'));
          }
        }
      },
      650
    );
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background ambient radial gradients */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: theme.primaryLight }}
      />
      <div 
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: theme.primaryLight }}
      />

      {/* Top Bar on Login Screen */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md bg-slate-950/40 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-wider text-white">
            {t.brandName}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            {t.terminalTitle}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span className="capitalize hidden sm:inline">{theme.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showThemeMenu && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-fadeIn"
                onMouseLeave={() => setShowThemeMenu(false)}
              >
                {Object.values(themes).map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setCurrentTheme(th.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      currentTheme === th.id 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: th.primaryLight }}
                      />
                      <span>{lang === 'kh' ? th.nameKh : th.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 my-6">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
          {/* Subtle top light bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.primaryLight}, #6366f1)`
            }}
          />

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'kh' ? 'ប្រព័ន្ធធនាគារស្នូល' : 'Core Banking System'}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {lang === 'kh' ? 'ចូលប្រើប្រាស់គណនីបុគ្គលិក' : 'Staff Portal Sign In'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'kh' 
                ? 'សូមបញ្ចូលព័ត៌មានគណនីរបស់អ្នកដើម្បីចូលប្រើប្រាស់ស្ថានីយ' 
                : 'Enter your credentials to access the banking terminal'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'kh' ? 'ឈ្មោះអ្នកប្រើប្រាស់ / អ៊ីមែល / លេខទូរស័ព្ទ' : 'Username, Email or Phone'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={lang === 'kh' ? 'ឈ្មោះ ឬ លេខទូរស័ព្ទ' : 'Enter username or phone'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'kh' ? 'លេខសម្ងាត់' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 mt-2 group"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
              }}
            >
              <KeyRound className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span>
                {loading 
                  ? (lang === 'kh' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Signing in...') 
                  : (lang === 'kh' ? 'ចូលប្រើប្រាស់ប្រព័ន្ធ' : 'Sign In to Terminal')}
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="px-6 py-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500 backdrop-blur-md bg-slate-950/40 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          <span>TRUST BANK Core Banking Systems • Terminal #TB-0492</span>
        </div>
      </footer>
    </div>
  );
}
