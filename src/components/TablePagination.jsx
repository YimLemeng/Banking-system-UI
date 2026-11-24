import React from 'react';

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
        <div className="flex items-center gap-1.5">
          <span>Page Size</span>
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
            className="border border-gray-300 rounded px-2 py-0.5 bg-white text-gray-700 focus:outline-none focus:border-blue-500 text-xs cursor-pointer shadow-2xs"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
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
