// Types
import { TablePaginationProps } from "@/types";

// Global Components
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function TablePagination<T extends object>({
  table,
  state,
  pagination,
}: TablePaginationProps<T>) {
  const renderPageButtons = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pageNumbers = [];

    pageNumbers.push(1);
    if (totalPages > 1) pageNumbers.push(totalPages);

    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      }
    }

    const uniquePageNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b);

    return uniquePageNumbers.map((pageNum, index) => {
      const isCurrentPage = pageNum === currentPage;
      const isEllipsis =
        index > 0 && pageNum - uniquePageNumbers[index - 1] > 1;

      return (
        <div key={pageNum}>
          {isEllipsis && <span className="px-3 py-2 mx-1">...</span>}
          <Button
            onClick={() => table.setPageIndex(pageNum - 1)}
            disabled={isCurrentPage}
            className={`relative inline-flex mx-1 items-center px-4 py-2 border text-sm font-medium rounded-md ${
              isCurrentPage
                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </Button>
        </div>
      );
    });
  };

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {pagination.pageIndex * pagination.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                state.totalItems
              )}
            </span>{" "}
            of <span className="font-medium">{state.totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex " aria-label="Pagination">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center p-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 mr-2"
            >
              <span className="sr-only">Previous</span>
              <Icon name="ChevronLeftIcon" className="h-5 w-5" />
            </Button>
            {renderPageButtons()}
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative inline-flex items-center p-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ml-2"
            >
              <span className="sr-only">Next</span>
              <Icon name="ChevronRightIcon" className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
