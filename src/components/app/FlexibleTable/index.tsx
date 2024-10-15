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
  pageCount: number;
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
}

export function FlexibleTable<T extends object>({
  columns,
  state,
  onStateChange,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
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
    pageCount: state.pageCount,
  });

  useEffect(() => {
    onStateChange({ sorting, pagination, columnFilters });
  }, [onStateChange, sorting, pagination, columnFilters]);

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

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border-collapse">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      <div className="w-4 h-4 ml-1">
                        {header.column.getIsSorted() && (
                          <Icon
                            name={
                              header.column.getIsSorted() === "desc"
                                ? "ArrowDownIcon"
                                : "ArrowUpIcon"
                            }
                            className="h-4 w-4"
                          />
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
                              onClick={() => header.column.toggleSorting(false)}
                            >
                              Sort A to Z
                            </DropdownMenuItem>
                          )}
                          {header.column.getIsSorted() !== "desc" && (
                            <DropdownMenuItem
                              onClick={() => header.column.toggleSorting(true)}
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
                            <Input
                              placeholder="Search..."
                              className="h-8 w-full"
                              onChange={(e) =>
                                handleSearch(header.column.id, e.target.value)
                              }
                            />
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
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={cell.id}
                  className={`px-6 py-4 whitespace-nowrap ${
                    cellIndex !== 0 ? "border-l border-gray-200" : ""
                  } ${rowIndex === 0 ? "pt-6" : ""} ${
                    rowIndex === table.getRowModel().rows.length - 1
                      ? "pb-6"
                      : ""
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of <span className="font-medium">{table.getPageCount()}</span>
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
                Previous
              </Button>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
