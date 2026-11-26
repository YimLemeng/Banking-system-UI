import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function TablePagination({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) {
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-gray-500">
      <div>
        Showing <span className="font-semibold text-gray-700">{startEntry}</span> to{' '}
        <span className="font-semibold text-gray-700">{endEntry}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalItems}</span> entries
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">Page Size</span>
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
              className="appearance-none bg-white hover:bg-gray-50/80 text-gray-700 text-xs font-semibold pl-2.5 pr-7 py-1 rounded border border-gray-300 hover:border-gray-400 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer transition-colors"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-gray-800">
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 group-hover:text-gray-600 transition-colors">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="inline-flex rounded-md shadow-2xs">
          <button
            type="button"
            disabled={validPage <= 1}
            onClick={() => onPageChange && onPageChange(1)}
            className="px-2.5 py-1 text-xs border border-gray-300 bg-white text-gray-600 rounded-l hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            First
          </button>
          <button
            type="button"
            disabled={validPage <= 1}
            onClick={() => onPageChange && onPageChange(validPage - 1)}
            className="px-2.5 py-1 text-xs border-t border-b border-r border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Prev
          </button>

          {pageNumbers.map((num) => {
            const isActive = num === validPage;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange && onPageChange(num)}
                className={`px-2.5 py-1 text-xs border-t border-b border-r border-gray-300 cursor-pointer ${
                  isActive
                    ? 'bg-gray-800 text-white font-semibold'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
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
            className="px-2.5 py-1 text-xs border-t border-b border-r border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
          <button
            type="button"
            disabled={validPage >= totalPages}
            onClick={() => onPageChange && onPageChange(totalPages)}
            className="px-2.5 py-1 text-xs border-t border-b border-r border-gray-300 bg-white text-gray-600 rounded-r hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
