import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function OfficialReportPrint({
  reportTitleKh = 'របាយការណ៍ផ្លូវការធនាគារ',
  reportTitleEn = 'OFFICIAL CORE BANKING LEDGER REPORT',
  reportRef = 'RPT-2026-001',
  summaryCards = [],
  columns = [],
  data = [],
}) {
  const { user } = useAuth();
  const printDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const officerName = user?.fullName || user?.username || 'System Administrator';
  const officerRole = (user?.role || 'Admin').replace('ROLE_', '');

  return (
    <div className="official-report-print font-sans text-slate-900 bg-white">
      {/* 1. Official Bank Letterhead Header */}
      <div className="border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-start justify-between">
          {/* Left: Bank Logo & Official Entity Info */}
          <div className="flex items-start gap-3">
            {/* Neoclassical Bank Crest */}
            <div className="w-13 h-13 shrink-0 flex items-center justify-center mt-0.5">
              <svg viewBox="0 0 64 64" className="w-13 h-13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" fill="#0f2b48" stroke="#d97706" strokeWidth="2.5" />
                <circle cx="32" cy="32" r="26" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="2 2" />
                <path d="M32 13L17 22H47L32 13Z" fill="#f59e0b" />
                <rect x="15" y="22" width="34" height="2.5" rx="0.5" fill="#f8fafc" />
                <rect x="19" y="26" width="3.5" height="15" rx="1" fill="#f8fafc" />
                <rect x="25.5" y="26" width="3.5" height="15" rx="1" fill="#f8fafc" />
                <rect x="35" y="26" width="3.5" height="15" rx="1" fill="#f8fafc" />
                <rect x="41.5" y="26" width="3.5" height="15" rx="1" fill="#f8fafc" />
                <circle cx="32" cy="33.5" r="2.5" fill="#f59e0b" />
                <rect x="16" y="42" width="32" height="2" fill="#f8fafc" />
                <rect x="14" y="45" width="36" height="3" rx="0.8" fill="#f59e0b" />
              </svg>
            </div>

            <div>
              <div className="text-lg font-bold text-slate-950 font-khmer leading-snug">
                ធនាគារ ត្រាស់ ប៊ែង ភីអិលស៊ី
              </div>
              <div className="text-xs font-black tracking-widest text-[#0f2b48]">
                TRUST BANK PLC.
              </div>
              <div className="text-[9px] text-slate-600 mt-0.5 font-medium">
                ធនាគារពាណិជ្ជទទួលអាជ្ញាប័ណ្ណពីធនាគារជាតិនៃកម្ពុជា (NBC) • Commercial Banking License #0492
              </div>
              <div className="text-[9px] text-slate-500">
                Head Office: #128 Preah Monivong Blvd, Phnom Penh, Cambodia • SWIFT: TRUSKHP1
              </div>
            </div>
          </div>

          {/* Right: Document Identity & Metadata */}
          <div className="text-right">
            <div className="text-base font-black uppercase tracking-wider text-slate-950">
              {reportTitleEn}
            </div>
            <div className="text-[11px] font-bold text-slate-700 font-khmer mt-0.5">
              {reportTitleKh}
            </div>
            <div className="mt-2 space-y-0.5 text-[9px] text-slate-600 font-mono">
              <div>Ref / លេខយោង: <strong className="text-slate-900 font-bold">{reportRef}</strong></div>
              <div>Printed / កាលបរិច្ឆេទ: <strong className="text-slate-900 font-bold">{printDate}</strong></div>
              <div>Officer / មន្ត្រីបោះពុម្ព: <strong className="text-slate-900 font-bold">{officerName} ({officerRole})</strong></div>
              <div>Classification: <strong className="text-rose-700 font-bold">CONFIDENTIAL // INTERNAL AUDIT</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive Summary Metrics Bar */}
      {summaryCards && summaryCards.length > 0 && (
        <div className={`grid grid-cols-${Math.min(summaryCards.length, 4)} gap-2.5 mb-3.5`}>
          {summaryCards.map((card, idx) => (
            <div key={idx} className="border border-slate-300 rounded p-2 bg-slate-50/70">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                {card.label}
              </div>
              <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                {card.value}
              </div>
              {card.subtext && (
                <div className="text-[8px] text-slate-500 mt-0.5">
                  {card.subtext}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. Official Structured Report Table */}
      <div className="border border-slate-400 rounded overflow-hidden mb-5">
        <table className="w-full text-left text-[10px] border-collapse">
          <thead>
            <tr className="bg-[#0f2b48] text-white border-b-2 border-slate-900 font-bold uppercase tracking-wider text-[9px]">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`py-2 px-2.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-slate-400 italic">
                  No records to display in official report.
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  className={`transition-colors ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                >
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`py-1.5 px-2.5 ${col.align === 'right' ? 'text-right font-mono' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                    >
                      {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Official Signatures, Seal & Regulatory Verification Block */}
      <div className="pt-3 border-t border-slate-300 mt-auto">
        <div className="grid grid-cols-2 gap-8 text-[10px]">
          {/* Prepared By Officer */}
          <div className="border border-slate-300 rounded p-3 bg-slate-50/40">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[9px] mb-1">
              រៀបចំដោយ / Prepared by Reporting Officer
            </div>
            <div className="text-slate-600 space-y-1 mt-2 text-[9px]">
              <div>Name: <strong className="text-slate-900">{officerName}</strong></div>
              <div>Position: <strong className="text-slate-900">{officerRole} Officer</strong></div>
              <div className="pt-5 flex items-end justify-between">
                <span>Signature: __________________________</span>
                <span>Date: ____ / ____ / 2026</span>
              </div>
            </div>
          </div>

          {/* Approved By Branch Auditor */}
          <div className="border border-slate-300 rounded p-3 bg-slate-50/40 relative">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[9px] mb-1">
              ត្រួតពិនិត្យ & យល់ព្រម / Approved by Branch Auditor
            </div>
            <div className="text-slate-600 space-y-1 mt-2 text-[9px]">
              <div>Designation: <strong className="text-slate-900">Head of Internal Audit & Compliance</strong></div>
              <div>Branch: <strong className="text-slate-900">Phnom Penh Main Banking Branch</strong></div>
              <div className="pt-5 flex items-end justify-between">
                <span>Signature: __________________________</span>
                <span>Seal / ត្រា: [  NBC VERIFIED  ]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Regulatory Notice */}
        <div className="flex items-center justify-between text-[8px] text-slate-500 pt-3 mt-2 border-t border-slate-200">
          <span>Trust Bank Core Terminal #TB-0492 • Official Audit Trail Compliant</span>
          <span>Regulated under Prakas of the National Bank of Cambodia (NBC)</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
