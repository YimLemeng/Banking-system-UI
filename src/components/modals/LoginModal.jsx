import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const { theme } = useTheme();

  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login(identifier, password);
      const data = res.data;
      login(data.token, {
        username: data.username || identifier,
        role: data.role || 'ROLE_ADMIN',
        fullName: data.username === 'admin' ? 'System Administrator' : data.username,
        email: data.email,
      });
      onSuccess(`Logged in as ${data.username || identifier}!`);
      onClose();
    } catch (err) {
      console.warn('Backend login error:', err);
      const rawMsg = err.response?.data?.message || '';
      const isTechnical = rawMsg.includes('unexpected error') || rawMsg.includes('No static resource') || rawMsg.includes('Internal Server Error');
      setError(!isTechnical && rawMsg ? rawMsg : 'Invalid credentials. Please verify your login info.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-sm classic-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3">
            <div className="classic-header-icon">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base tracking-wide">Terminal Authentication</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">JWT Security Token Access</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="classic-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="classic-error">
              <AlertCircle className="w-4 h-4 text-[#dd4b39] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="classic-label">
              Username, Email or Phone
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin"
              className="classic-input"
            />
          </div>

          <div>
            <label className="classic-label">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="classic-input"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="classic-btn-primary w-full py-2.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Terminal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
