import { useState, useEffect, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

// Types
import { TableLogicProps, TableLogicReturn } from "@/types";

export function useTableLogic<T extends object>({
  columns,
  state,
  onStateChange,
  pageSize,
  pageIndex,
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
  };
}
