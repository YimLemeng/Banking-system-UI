import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  Calendar,
  Wallet,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ViewCustomerModal({ 
  isOpen, 
  onClose, 
  customer, 
  accounts = [], 
  onOpenEdit,
  onOpenCreateAccount 
}) {
  const { lang, t } = useAuth();
  const { theme } = useTheme();

  if (!isOpen || !customer) return null;

  // Find accounts belonging to this customer
  const customerAccounts = accounts.filter(a => 
    a.customerId === customer.id || 
    a.customerName?.toLowerCase() === `${customer.firstName} ${customer.lastName}`.toLowerCase()
  );

  const totalBalance = customerAccounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);

  return createPortal(
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#0a101f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
              {customer.firstName?.[0]}{customer.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {customer.firstName} {customer.lastName}
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  #{customer.id}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  KYC VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'kh' ? 'ព័ត៌មានលម្អិតអំពីអតិថិជន និងគណនីធនាគារ' : 'Customer Profile & Active Banking Accounts'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* KYC Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Identity & Contact Details
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono">{customer.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-mono font-semibold">
                    ID: {customer.nationalIdOrPassport || 'KH-109283741'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{customer.address || 'Phnom Penh, Cambodia'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Financial Position
                </div>
                <div className="text-xs text-slate-400">Total Consolidated Balance</div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{customerAccounts.length} Active Accounts Linked</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Compliance Level: Tier 2 (NBC)</span>
                <span className="text-slate-300 font-mono">Status: ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Accounts List for this Customer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span>Connected Bank Accounts</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCreateAccount) onOpenCreateAccount(customer);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1"
              >
                <span>+ Open Another Account</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {customerAccounts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                No active bank accounts linked yet. Click "+ Open Another Account" to create one.
              </div>
            ) : (
              <div className="space-y-2">
                {customerAccounts.map((acc) => (
                  <div key={acc.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex items-center justify-between hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-white text-xs">{acc.accountNumber}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">{acc.accountType} ACCOUNT • {acc.currency || 'USD'}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-white text-sm">
                        ${(parseFloat(acc.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        {acc.status || 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {t.cancel || 'Close'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenEdit) onOpenEdit(customer);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
            >
              {lang === 'kh' ? 'កែប្រែព័ត៌មាន (Update Profile)' : 'Update Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
