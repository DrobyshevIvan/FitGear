import {MoveLeft, MoveRight} from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getNumber = () => {
    const delta = 2;
    const range = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    const pages = [];
    let lastPage = 0;
    for (let page of range) {
      if (page - lastPage > 1) {
        pages.push("ellipsis-" + page);
      }
      pages.push(page);
      lastPage = page;
    }

    return pages;
  }

  const pages = getNumber();

    return (
    <div className="flex justify-between items-center gap-3 mt-4 mx-36">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex px-4 py-2 mr-12 gap-2 disabled:opacity-50 border-t-2 border-transparent hover:border-gray-600 cursor-pointer items-center"
      >
        <MoveLeft />
        <span className='text-lg'>Prev</span>
      </button>
      <div className='flex gap-2'>
        {
            pages.map((page, index) => typeof page === 'string' && page.startsWith("ellipsis-") ? (
                <span key={page}>...</span>
            ) : (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={classNames(
                        page === currentPage
                        ? 'z-10 text-indigo-700 font-bold border-t-2 border-indigo-700'
                        : 'text-gray-800 hover:bg-gray-50',
                        'relative inline-flex items-center px-2 py-1 text-lg ring-gray-300 font-medium cursor-pointer'
                    )}>
                    {page}
                </button>
            ))
        }
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex px-4 py-2 ml-12 gap-2 disabled:opacity-50 border-t-2 border-transparent hover:border-gray-600 cursor-pointer items-center"
      >
        <span>Next</span>
        <MoveRight />
      </button>
    </div>
  );
}