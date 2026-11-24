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
  ArrowRight,
  Globe2,
  Palette,
  ChevronDown,
  Sparkles,
  Zap,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { authService, parseJwt } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';
import { BankLogo } from '../components/BankLogo';

export default function LoginPage({ onLoginSuccess, onSkipToDemo }) {
  const { login, lang, setLang, t, authAlert, clearAuthAlert } = useAuth();
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

  const fillCredentials = (userType) => {
    if (userType === 'admin') {
      setIdentifier('admin');
      setPassword('admin123');
    } else {
      setIdentifier('teller');
      setPassword('teller123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError(lang === 'kh' ? 'សូមបញ្ចូលឈ្មោះ និងលេខសម្ងាត់' : 'Please provide identifier and password');
      return;
    }

    setError('');
    if (authAlert) clearAuthAlert();

    await withLoading(
      lang === 'kh' ? 'កំពុងផ្ទៀងផ្ទាត់គណនីចូលប្រព័ន្ធ...' : 'Authenticating Terminal Officer Credentials...',
      async () => {
        try {
          const res = await authService.login(identifier, password);
          const data = res.data;
          const payload = parseJwt(data.token);
          const userRole = data.role || payload?.role || (data.username?.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER');
          const isAdminUser = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';
          const isTeller = userRole === 'ROLE_USER' || data.username?.toLowerCase() === 'teller';
          
          login(data.token, {
            username: data.username || identifier,
            role: userRole,
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
      300,
      lang === 'kh' ? 'សូមរង់ចាំមួយភ្លែត ប្រព័ន្ធកំពុងដំណើរការ...' : 'Please wait while the request is processing.'
    );
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0f172a] text-slate-100 font-sans select-none overflow-hidden">
      {/* LEFT COLUMN: Premium Bank Imagery & Value Proposition (Visible on LG screens) */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Bank Skyscraper Photograph */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/banking-hero.jpg')` }}
        />
        {/* Deep luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/85 to-blue-950/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        {/* Ambient Top Glow */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ backgroundColor: theme.primary }}
        />

        {/* Top Header in Left Column */}
        <div className="relative z-10 flex items-center gap-3">
          <BankLogo size={40} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">
                {t.brandName || 'TRUST BANK'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-khmer">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {lang === 'kh' ? 'ទទួលស្គាល់ដោយ NBC' : 'NBC Cleared'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium font-khmer">
              {lang === 'kh' 
                ? 'បណ្តាញធនាគារស្នូល និងទុនបម្រុងជាតិកម្ពុជា' 
                : 'National Depository & Core Banking Network'}
            </p>
          </div>
        </div>

        {/* Center Hero Copy in Left Column */}
        <div className="relative z-10 max-w-xl space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/15 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'kh' ? 'ប្រព័ន្ធធនាគារស្នូលឌីជីថលជំនាន់ថ្មី' : 'Next-Gen Core Depository & Treasury Terminal'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-white leading-relaxed md:leading-[1.7] tracking-normal font-khmer">
            {lang === 'kh' ? (
              <>
                សុវត្ថិភាពខ្ពស់បំផុតសម្រាប់ <br />
                <span className="text-blue-400 font-bold inline-block mt-1">
                  ប្រតិបត្តិការហិរញ្ញវត្ថុ
                </span>
              </>
            ) : (
              <>
                Institutional-Grade <br />
                <span className="text-blue-400 font-bold inline-block mt-1">
                  Financial Workstation
                </span>
              </>
            )}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-lg font-khmer">
            {lang === 'kh'
              ? 'គ្រប់គ្រងលំហូរសាច់ប្រាក់ បញ្ជរបេឡា OTC កំណត់ត្រា KYC និងការទូទាត់ប្រាក់ទូទាំងប្រទេសកម្ពុជាប្រកបដោយតម្លាភាព និងភាពត្រឹមត្រូវខ្ពស់បំផុត។'
              : 'Seamlessly orchestrate over-the-counter teller deposits, withdrawals, internal transfers, and regulatory compliance audits with real-time National Bank of Cambodia clearing.'}
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-xs font-bold text-white mb-1 font-khmer">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'kh' ? 'ទូទាត់ប្រាក់ភ្លាមៗ' : 'Instant Settlements'}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-khmer leading-relaxed">
                {lang === 'kh' 
                  ? 'កែសម្រួលសមតុល្យភ្លាមៗ និងបោះពុម្ពបង្កាន់ដៃបេឡា។' 
                  : 'Live ledger balance adjustments & teller slip printing.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-xs font-bold text-white mb-1 font-khmer">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>{lang === 'kh' ? 'សវនកម្មស្តង់ដារ NBC' : 'NBC Audited Ledger'}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-khmer leading-relaxed">
                {lang === 'kh' 
                  ? 'កំណត់ត្រាសវនកម្មមិនអាចកែប្រែបាន ១០០% និងគ្រប់គ្រងហានិភ័យ។' 
                  : '100% immutable audit event trail & risk controls.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Status Info in Left Column */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-khmer">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px]">
              {lang === 'kh' ? 'ម៉ាស៊ីនមេ #TB-0492 ដំណើរការ' : 'Core Node #TB-0492 Online'}
            </span>
          </div>
          <span className="text-[11px] font-khmer">
            {lang === 'kh' ? '© ២០១៤–២០២៦ ធនាគារ ត្រាស់ ប៊ែង • រក្សាសិទ្ធិគ្រប់យ៉ាង' : '© 2014-2026 Trust Bank Core. All rights reserved.'}
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Modern High-Contrast Login Card */}
      <div className="w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-[#0b1120] relative z-20">
        {/* Top Header Utilities (Lang & Theme) */}
        <div className="flex items-center justify-between pb-6">
          <div className="lg:hidden flex items-center gap-2">
            <BankLogo size={28} />
            <span className="font-extrabold text-sm text-white tracking-wider">
              TRUST BANK
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>
          </div>
        </div>

        {/* Main Center Form */}
        <div className="max-w-md w-full mx-auto my-auto py-6">
          <div className="mb-6 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-400 shadow-lg shadow-blue-500/10">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'kh' ? 'ចូលប្រើប្រាស់ប្រព័ន្ធ' : 'Sign in to Terminal'}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
              {lang === 'kh' 
                ? 'សូមបញ្ចូលឈ្មោះ និងលេខសម្ងាត់របស់មន្ត្រីធនាគារ' 
                : 'Enter your core banking credentials to access the terminal workstation.'}
            </p>
          </div>

          {authAlert && !error && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t[authAlert] || authAlert}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'kh' ? 'ឈ្មោះអ្នកប្រើប្រាស់ ឬ អ៊ីមែល' : 'Username or Email'} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={lang === 'kh' ? 'បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ ឬ អ៊ីមែល...' : 'Enter your username or email...'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 font-mono transition-colors shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'kh' ? 'លេខសម្ងាត់' : 'Password'} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer group active:scale-[0.99]"
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

        {/* Right Column Footer */}
        <div className="text-center text-[11px] text-slate-500 pt-4">
          <span>{lang === 'kh' ? 'សម្រាប់តែមន្ត្រីធនាគារដែលទទួលបានការអនុញ្ញាត • សាខាកណ្តាល' : 'Authorized Banking Personnel Only • Central Terminal'}</span>
        </div>
      </div>
    </div>
  );
}
