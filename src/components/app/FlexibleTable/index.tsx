// Types
import { TableProps } from "@/types";

// Hooks
import { useTableLogic } from "./hooks/useTable";

// Local Components
import { TableHeader, TableBody, TablePagination } from "./components";

export function FlexibleTable<T extends object>({
  columns,
  state,
  onStateChange,
  pageSize,
  pageIndex,
}: TableProps<T>) {
  const { table, pagination, handleSearch, clearSort } = useTableLogic<T>({
    columns,
    state,
    onStateChange,
    pageSize,
    pageIndex,
  });

  return (
    <div className="w-full overflow-hidden shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <TableHeader
            headerGroups={table.getHeaderGroups()}
            onSearch={handleSearch}
            onClearSort={clearSort}
          />
          <TableBody
            rows={table.getRowModel().rows}
            isLoading={state.isLoading}
            pageSize={pageSize}
            columns={columns}
          />
        </table>
      </div>
      <TablePagination table={table} state={state} pagination={pagination} />
    </div>
  );
}
