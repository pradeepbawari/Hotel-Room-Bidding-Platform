import React, { useState } from 'react';

const CustomPagination = ({ api, totalRecords, pageSize, click }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(totalRecords / pageSize);

  const goToPage = (page) => {
    api.current.paginationGoToPage(page);
    setCurrentPage(page);
    click(api.current, page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            i === currentPage
              ? 'bg-indigo-600 text-white'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          } focus:z-20 focus:outline-offset-0`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{currentPage + 1}</span> to{' '}
            <span className="font-medium">{totalPages}</span> of{' '}
            <span className="font-medium">{totalRecords}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <button
              disabled={currentPage === 0}
              onClick={() => goToPage(currentPage - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
            >
              Previous
            </button>
            {renderPageNumbers()}
            <button
              disabled={currentPage === totalPages - 1}
              onClick={() => goToPage(currentPage + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;
