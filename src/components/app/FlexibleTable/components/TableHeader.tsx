import { flexRender } from "@tanstack/react-table";

// Types
import { TableHeaderProps } from "@/types";

// Global Components
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

export function TableHeader<T extends object>({
  headerGroups,
  onSearch,
  onClearSort,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-gray-50">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                        <Icon name="DotsHorizontalIcon" className="h-4 w-4" />
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
                          onClick={() => onClearSort(header.column.id)}
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
                              onSearch(header.column.id, e.target.value)
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
  );
}
