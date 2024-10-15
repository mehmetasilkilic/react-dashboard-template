import { flexRender } from "@tanstack/react-table";

// Types
import { TableBodyProps } from "@/types";

export function TableBody<T extends object>({
  rows,
  isLoading,
  pageSize,
  columns,
}: TableBodyProps<T>) {
  const renderSkeletonRow = () => (
    <tr>
      {columns.map((_, index) => (
        <td key={index} className="px-6 h-10 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );

  const renderSkeletonBody = () => (
    <>{[...Array(pageSize)].map((_, index) => renderSkeletonRow())}</>
  );

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {isLoading
        ? renderSkeletonBody()
        : rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 h-10 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
    </tbody>
  );
}
