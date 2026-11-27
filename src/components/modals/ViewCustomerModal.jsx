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
  CheckCircle2,
  Edit3
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
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl classic-modal flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[2px] bg-[#3c8dbc] text-white border-[#367fa9] flex items-center justify-center font-bold text-sm shadow-inner">
              {customer.firstName?.[0]}{customer.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base tracking-wide">
                  {customer.firstName} {customer.lastName}
                </h3>
                <span className="text-[10px] font-mono text-[#3c8dbc] bg-blue-50 px-2 py-0.5 rounded-[2px] border border-blue-200 font-semibold">
                  #{customer.id}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-[#3c8dbc]" />
                  KYC VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'kh' ? 'ព័ត៌មានលម្អិតអំពីអតិថិជន និងគណនីធនាគារ' : 'Customer Profile & Active Banking Accounts'}
              </p>
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

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* KYC Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="classic-fieldset space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5">
                Identity & Contact Details
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-800 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono font-medium">{customer.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-mono font-semibold">
                    ID: {customer.nationalIdOrPassport || 'KH-109283741'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <MapPin className="w-4 h-4 text-[#3c8dbc] shrink-0" />
                  <span className="truncate">{customer.address || 'Phnom Penh, Cambodia'}</span>
                </div>
              </div>
            </div>

            <div className="classic-fieldset flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 mb-2">
                  Financial Position
                </div>
                <div className="text-xs text-slate-500">Total Consolidated Balance</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{customerAccounts.length} Active Accounts Linked</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Compliance Level: Tier 2 (NBC)</span>
                <span className="text-slate-800 font-mono font-bold">Status: ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Accounts List for this Customer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#d2d6de] pb-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#3c8dbc]" />
                <span>Connected Bank Accounts</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCreateAccount) onOpenCreateAccount(customer);
                }}
                className="text-xs text-slate-800 hover:text-[#3c8dbc] font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+ Open Another Account</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {customerAccounts.length === 0 ? (
              <div className="classic-fieldset text-center text-xs text-slate-500">
                No active bank accounts linked yet. Click "+ Open Another Account" to create one.
              </div>
            ) : (
              <div className="space-y-2">
                {customerAccounts.map((acc) => (
                  <div 
                    key={acc.id}
                    className="p-3.5 rounded-[2px] bg-white border border-[#d2d6de] flex items-center justify-between shadow-[inset_0_1px_2px_rgba(20,40,75,0.04)] hover:border-[#3c8dbc] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[2px] bg-slate-50 text-slate-800 border border-[#d2d6de] flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 text-xs">
                            {acc.accountNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {acc.accountType} ACCOUNT • USD
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-800 text-sm">
                        ${(parseFloat(acc.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-[2px] border border-emerald-200 inline-block mt-0.5">
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
        <div className="px-6 py-3.5 border-t border-[#d2d6de] flex items-center justify-between bg-[#f7f9fb]">
          <button
            type="button"
            onClick={onClose}
            className="classic-btn-secondary"
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
              className="classic-btn-primary"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{lang === 'kh' ? 'កែប្រែព័ត៌មាន (Update Profile)' : 'Update Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
