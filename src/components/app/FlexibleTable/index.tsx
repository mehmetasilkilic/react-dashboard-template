import { useState, useEffect, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";

export interface TableState<T> {
  data: T[];
  totalItems: number;
  isLoading: boolean;
}

export interface TableActions {
  sorting: SortingState;
  pagination: PaginationState;
  columnFilters: { id: string; value: string }[];
}

interface TableProps<T extends object> {
  columns: (ColumnDef<T> & { showOptionsButton?: boolean })[];
  state: TableState<T>;
  onStateChange: (actions: TableActions) => void;
  pageSize: number;
  pageIndex: number;
}

export function FlexibleTable<T extends object>({
  columns,
  state,
  onStateChange,
  pageSize,
  pageIndex,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: string }[]
  >([]);

  const table = useReactTable({
    data: state.data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(state.totalItems / pageSize),
  });

  useEffect(() => {
    onStateChange({ sorting, pagination, columnFilters });
  }, [onStateChange, sorting, pagination, columnFilters]);

  useEffect(() => {
    setPagination({ pageIndex, pageSize });
  }, [pageIndex, pageSize]);

  const handleSearch = useCallback((columnId: string, value: string) => {
    setColumnFilters((prev) => {
      const newFilters = prev.filter((filter) => filter.id !== columnId);
      if (value) {
        newFilters.push({ id: columnId, value });
      }
      return newFilters;
    });
  }, []);

  const clearSort = useCallback((columnId: string) => {
    setSorting((prev) => prev.filter((sort) => sort.id !== columnId));
  }, []);

  const renderSkeletonRow = () => (
    <tr>
      {columns.map((column, index) => (
        <td key={index} className="px-6 h-10 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );

  const renderSkeletonBody = () => (
    <>{[...Array(pageSize)].map((_, index) => renderSkeletonRow())}</>
  );

  const renderPageButtons = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pageNumbers = [];

    // Always show first and last page
    pageNumbers.push(1);
    if (totalPages > 1) pageNumbers.push(totalPages);

    // Show 2 pages before and after current page
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      }
    }

    // Sort and remove duplicates
    const uniquePageNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b);

    return uniquePageNumbers.map((pageNum, index) => {
      const isCurrentPage = pageNum === currentPage;
      const isEllipsis =
        index > 0 && pageNum - uniquePageNumbers[index - 1] > 1;

      return (
        <div key={pageNum}>
          {isEllipsis && <span className="px-3 py-2">...</span>}
          <Button
            onClick={() => table.setPageIndex(pageNum - 1)}
            disabled={isCurrentPage}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
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
    <div className="w-full overflow-hidden shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center cursor-pointer ${
                          header.column.getCanSort()
                            ? "hover:text-gray-700"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="mr-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        <div className="w-4 h-4 ml-1">
                          {header.column.getIsSorted() === "asc" && (
                            <Icon name="ArrowUpIcon" className="h-4 w-4" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <Icon name="ArrowDownIcon" className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                      {(header.column.columnDef as any).showOptionsButton && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Icon
                                name="DotsHorizontalIcon"
                                className="h-4 w-4"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {header.column.getIsSorted() !== "asc" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  header.column.toggleSorting(false)
                                }
                              >
                                Sort A to Z
                              </DropdownMenuItem>
                            )}
                            {header.column.getIsSorted() !== "desc" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  header.column.toggleSorting(true)
                                }
                              >
                                Sort Z to A
                              </DropdownMenuItem>
                            )}
                            {header.column.getIsSorted() && (
                              <DropdownMenuItem
                                onClick={() => clearSort(header.column.id)}
                              >
                                Clear Sort
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <div className="px-2 py-1.5">
                              <div className="relative">
                                <Icon
                                  name="MagnifyingGlassIcon"
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                                />
                                <Input
                                  placeholder="Search..."
                                  className="h-8 w-full pl-8"
                                  onChange={(e) =>
                                    handleSearch(
                                      header.column.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.isLoading
              ? renderSkeletonBody()
              : table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 h-10 whitespace-nowrap text-sm text-gray-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
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
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <Icon name="ChevronLeftIcon" className="h-5 w-5" />
              </Button>
              {renderPageButtons()}
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <Icon name="ChevronRightIcon" className="h-5 w-5" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
