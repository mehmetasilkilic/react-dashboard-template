import { useState, useEffect, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  PaginationState,
  ColumnDef,
} from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// UI Components
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
import {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TablePaginationProps,
  TableLogicProps,
  TableLogicReturn,
} from "@/types";

type ExtendedColumnDef<T> = ColumnDef<T> & {
  truncate?: boolean;
};

// Size configuration
const sizeConfig = {
  sm: {
    headerText: "text-xs",
    cellText: "text-xs",
    padding: "py-2",
    buttonPadding: "py-1",
    paginationText: "text-xs",
    iconSize: "h-4 w-4",
    dropdownPadding: "py-1",
    inputHeight: "h-7",
  },
  md: {
    headerText: "text-sm",
    cellText: "text-sm",
    padding: "py-3",
    buttonPadding: "py-2",
    paginationText: "text-sm",
    iconSize: "h-5 w-5",
    dropdownPadding: "py-1.5",
    inputHeight: "h-8",
  },
  lg: {
    headerText: "text-base",
    cellText: "text-base",
    padding: "py-4",
    buttonPadding: "py-2.5",
    paginationText: "text-base",
    iconSize: "h-6 w-6",
    dropdownPadding: "py-2",
    inputHeight: "h-9",
  },
};

// Table Logic Hook
function useTableLogic<T extends object>({
  columns,
  state,
  onStateChange,
  pageSize,
  pageIndex,
  onExport,
}: TableLogicProps<T>): TableLogicReturn<T> {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: string }[]
  >([]);

  const table = useReactTable({
    data: state.data || [],
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
  }, [sorting, pagination, columnFilters]);

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

  const handleExport = useCallback(() => {
    if (onExport) {
      onExport({ sorting, columnFilters });
    }
  }, [sorting, columnFilters, onExport]);

  return {
    table,
    sorting,
    pagination,
    columnFilters,
    handleSearch,
    clearSort,
    setSorting,
    setPagination,
    setColumnFilters,
    handleExport,
  };
}

// Table Header Component
function TableHeader<T extends object>({
  headerGroups,
  onSearch,
  onClearSort,
  onExport,
  size = "md",
}: TableHeaderProps<T>) {
  const sizeStyles = sizeConfig[size];

  return (
    <thead className="bg-gray-50">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header: any, index: number) => (
            <th
              key={header.id}
              className={`${index === 0 ? "pl-6" : "pl-2"} pr-4 ${sizeStyles.padding} text-left ${sizeStyles.headerText} font-medium text-gray-500 uppercase tracking-wider`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center cursor-pointer ${
                    header.column.getCanSort() ? "hover:text-gray-700" : ""
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span className="mr-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </span>
                  <div className={sizeStyles.iconSize}>
                    {header.column.getIsSorted() === "asc" && (
                      <Icon
                        name="ArrowUpIcon"
                        className={sizeStyles.iconSize}
                      />
                    )}
                    {header.column.getIsSorted() === "desc" && (
                      <Icon
                        name="ArrowDownIcon"
                        className={sizeStyles.iconSize}
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {(header.column.columnDef as any).showOptionsButton && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`${sizeStyles.buttonPadding} w-8 p-0`}
                        >
                          <Icon
                            name="DotsHorizontalIcon"
                            className={sizeStyles.iconSize}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {header.column.getIsSorted() !== "asc" && (
                          <DropdownMenuItem
                            onClick={() => header.column.toggleSorting(false)}
                            className={sizeStyles.dropdownPadding}
                          >
                            Sort A to Z
                          </DropdownMenuItem>
                        )}
                        {header.column.getIsSorted() !== "desc" && (
                          <DropdownMenuItem
                            onClick={() => header.column.toggleSorting(true)}
                            className={sizeStyles.dropdownPadding}
                          >
                            Sort Z to A
                          </DropdownMenuItem>
                        )}
                        {header.column.getIsSorted() && (
                          <DropdownMenuItem
                            onClick={() => onClearSort(header.column.id)}
                            className={sizeStyles.dropdownPadding}
                          >
                            Clear Sort
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5">
                          <div className="relative">
                            <Icon
                              name="MagnifyingGlassIcon"
                              className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 ${sizeStyles.iconSize}`}
                            />
                            <Input
                              placeholder="Search..."
                              className={`${sizeStyles.inputHeight} w-full pl-8`}
                              onChange={(e) =>
                                onSearch(header.column.id, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {index === headerGroups[0].headers.length - 1 && onExport && (
                    <Button
                      onClick={onExport}
                      className={`flex items-center ml-2 bg-green-600 hover:bg-green-500 ${sizeStyles.buttonPadding}`}
                    >
                      <Icon
                        name="DownloadIcon"
                        className={sizeStyles.iconSize}
                      />
                    </Button>
                  )}
                </div>
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

// Table Body Component
function TableBody<T extends object>({
  rows,
  isLoading,
  pageSize,
  columns,
  size = "md",
}: TableBodyProps<T>) {
  const sizeStyles = sizeConfig[size];

  const TruncatedCell = ({
    value,
    truncate,
  }: {
    value: string;
    truncate?: boolean;
  }) => {
    if (!truncate || value.length <= 16) {
      return <span>{value}</span>;
    }
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{value.slice(0, 14)}...</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{value}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderSkeletonRow = (index: number) => (
    <tr key={index} className="hover:bg-gray-50">
      {columns.map((column, columnIndex) => (
        <td
          key={columnIndex}
          className={`${columnIndex === 0 ? "pl-6" : "pl-2"} pr-4 ${sizeStyles.padding} whitespace-nowrap ${sizeStyles.cellText} text-gray-500`}
        >
          <Skeleton height={20} width={(column as any).width || "100%"} />
        </td>
      ))}
    </tr>
  );

  if (isLoading) {
    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: pageSize }).map((_, index) =>
          renderSkeletonRow(index)
        )}
      </tbody>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length}>
            <div className="flex justify-center">
              <Alert variant="default">
                <Icon
                  name="ExclamationTriangleIcon"
                  className={sizeStyles.iconSize}
                />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>No data found.</AlertDescription>
              </Alert>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {rows.map((row) => (
        <tr key={row.id} className="hover:bg-gray-50">
          {row.getVisibleCells().map((cell: any, cellIndex: number) => {
            const column = cell.column.columnDef as ExtendedColumnDef<T>;
            return (
              <td
                key={cell.id}
                className={`${cellIndex === 0 ? "pl-6" : "pl-2"} pr-4 ${sizeStyles.padding} whitespace-nowrap ${sizeStyles.cellText} text-gray-500`}
              >
                {typeof cell.getValue() === "string" ? (
                  <TruncatedCell
                    value={cell.getValue() as string}
                    truncate={column.truncate}
                  />
                ) : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}

// Table Pagination Component
function TablePagination<T extends object>({
  table,
  state,
  pagination,
  size = "md",
}: TablePaginationProps<T>) {
  const sizeStyles = sizeConfig[size];

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
          {isEllipsis && (
            <span
              className={`px-3 ${sizeStyles.buttonPadding} mx-1 ${sizeStyles.paginationText}`}
            >
              ...
            </span>
          )}
          <Button
            onClick={() => table.setPageIndex(pageNum - 1)}
            disabled={isCurrentPage}
            className={`relative inline-flex mx-1 items-center px-4 ${sizeStyles.buttonPadding} border ${sizeStyles.paginationText} font-medium rounded-md ${
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

  const renderSkeletonPagination = () => (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <Skeleton width={200} height={20} />
        </div>
        <div>
          <nav className="relative z-0 inline-flex" aria-label="Pagination">
            <Skeleton width={40} height={40} className="mr-2" />
            <Skeleton width={200} height={40} />
            <Skeleton width={40} height={40} className="ml-2" />
          </nav>
        </div>
      </div>
    </div>
  );

  if (state.isLoading) {
    return renderSkeletonPagination();
  }

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className={`${sizeStyles.paginationText} text-gray-700`}>
            Toplam <span className="font-medium">{state.totalItems}</span>{" "}
            kayıttan{" "}
            <span className="font-medium">
              {pagination.pageIndex * pagination.pageSize + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium">
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                state.totalItems
              )}
            </span>{" "}
            arası gösteriliyor
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex" aria-label="Pagination">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`relative inline-flex items-center p-2 rounded-l-md border border-gray-300 bg-white ${sizeStyles.paginationText} font-medium text-gray-500 hover:bg-gray-50 mr-2`}
            >
              <span className="sr-only">Previous</span>
              <Icon name="ChevronLeftIcon" className={sizeStyles.iconSize} />
            </Button>
            {renderPageButtons()}
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`relative inline-flex items-center p-2 rounded-r-md border border-gray-300 bg-white ${sizeStyles.paginationText} font-medium text-gray-500 hover:bg-gray-50 ml-2`}
            >
              <span className="sr-only">Next</span>
              <Icon name="ChevronRightIcon" className={sizeStyles.iconSize} />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}

// Main FlexibleTable Component
export function FlexibleTable<T extends object>({
  columns,
  state,
  onStateChange,
  pageSize,
  pageIndex,
  onExport,
  size = "md",
}: TableProps<T>) {
  const { table, pagination, handleSearch, clearSort, handleExport } =
    useTableLogic<T>({
      columns,
      state,
      onStateChange,
      pageSize,
      pageIndex,
      onExport,
    });

  return (
    <div className="w-full overflow-hidden shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <TableHeader
            headerGroups={table.getHeaderGroups()}
            onSearch={handleSearch}
            onClearSort={clearSort}
            onExport={onExport ? handleExport : undefined}
            size={size}
          />
          <TableBody
            rows={table.getRowModel().rows}
            isLoading={state.isLoading}
            pageSize={pageSize}
            columns={columns}
            size={size}
          />
        </table>
      </div>
      <TablePagination
        table={table}
        state={state}
        pagination={pagination}
        size={size}
      />
    </div>
  );
}
