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
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-sm shadow-2xs">
              {customer.firstName?.[0]}{customer.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base">
                  {customer.firstName} {customer.lastName}
                </h3>
                <span className="text-[10px] font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-semibold">
                  #{customer.id}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  KYC VERIFIED
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {lang === 'kh' ? 'ព័ត៌មានលម្អិតអំពីអតិថិជន និងគណនីធនាគារ' : 'Customer Profile & Active Banking Accounts'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* KYC Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Identity & Contact Details
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-gray-700">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono font-medium">{customer.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-mono font-semibold">
                    ID: {customer.nationalIdOrPassport || 'KH-109283741'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{customer.address || 'Phnom Penh, Cambodia'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Financial Position
                </div>
                <div className="text-xs text-gray-500">Total Consolidated Balance</div>
                <div className="text-2xl font-black text-gray-900 font-mono mt-1">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{customerAccounts.length} Active Accounts Linked</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                <span>Compliance Level: Tier 2 (NBC)</span>
                <span className="text-gray-700 font-mono font-medium">Status: ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Accounts List for this Customer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span>Connected Bank Accounts</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCreateAccount) onOpenCreateAccount(customer);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+ Open Another Account</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {customerAccounts.length === 0 ? (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500">
                No active bank accounts linked yet. Click "+ Open Another Account" to create one.
              </div>
            ) : (
              <div className="space-y-2">
                {customerAccounts.map((acc) => (
                  <div 
                    key={acc.id}
                    className="p-3.5 rounded-lg bg-white border border-gray-200 flex items-center justify-between shadow-2xs hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900 text-xs">
                            {acc.accountNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {acc.accountType} ACCOUNT • USD
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-gray-900 text-sm">
                        ${(parseFloat(acc.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
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
        <div className="px-6 py-3.5 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 transition-colors shadow-2xs cursor-pointer"
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-all cursor-pointer"
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
