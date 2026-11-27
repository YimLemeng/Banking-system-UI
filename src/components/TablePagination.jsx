import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TablePagination({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) {
  const { lang } = useAuth();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startEntry = totalItems === 0 ? 0 : (validPage - 1) * pageSize + 1;
  const endEntry = Math.min(validPage * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (validPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    if (validPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [validPage - 2, validPage - 1, validPage, validPage + 1, validPage + 2];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 text-xs text-slate-500">
      <div>
        {lang === 'kh' ? (
          <>
            បង្ហាញ <span className="font-semibold text-slate-700">{startEntry}-{endEntry}</span> នៃ{' '}
            <span className="font-semibold text-slate-700">{totalItems}</span> លទ្ធផល
          </>
        ) : (
          <>
            Showing <span className="font-semibold text-slate-700">{startEntry}-{endEntry}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalItems}</span> results
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">{lang === 'kh' ? 'ជួរ' : 'Rows'}</span>
          <div className="relative inline-flex items-center group">
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                if (onPageSizeChange) {
                  onPageSizeChange(newSize);
                }
                if (onPageChange) {
                  onPageChange(1);
                }
              }}
              className="appearance-none bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold pl-2.5 pr-7 py-1 rounded border border-slate-300 hover:border-slate-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer transition-colors"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 group-hover:text-slate-600 transition-colors">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            disabled={validPage <= 1}
            onClick={() => onPageChange && onPageChange(validPage - 1)}
            className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {lang === 'kh' ? 'មុន' : 'Previous'}
          </button>

          {pageNumbers.map((num) => {
            const isActive = num === validPage;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange && onPageChange(num)}
                className={`min-w-[28px] px-2 py-1 text-xs rounded border cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#2563eb] text-white border-[#2563eb] font-semibold'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {num}
              </button>
            );
          })}

          <button
            type="button"
            disabled={validPage >= totalPages}
            onClick={() => onPageChange && onPageChange(validPage + 1)}
            className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {lang === 'kh' ? 'បន្ទាប់' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
