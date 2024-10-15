import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

// Global Components
import { FlexibleTable } from "@/components/app/FlexibleTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const fetchUsers = async ({
  pageIndex,
  pageSize,
  sorting,
  filters,
}: {
  pageIndex: number;
  pageSize: number;
  sorting: { id: string; desc: boolean }[];
  filters: { id: string; value: string }[];
}) => {
  const response = await axios.get("/api/users", {
    params: {
      page: pageIndex,
      pageSize,
      sortBy: sorting.length > 0 ? sorting[0].id : undefined,
      sortOrder:
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
      filters: JSON.stringify(filters),
    },
  });
  return response.data;
};

export const UserTable = () => {
  const [queryParams, setQueryParams] = useState({
    pageIndex: 0,
    pageSize: 10,
    sorting: [],
    filters: [],
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => fetchUsers(queryParams),
    keepPreviousData: true,
  });

  // Define columns
  const columns: (ColumnDef<User> & { showOptionsButton?: boolean })[] = [
    {
      accessorKey: "name",
      header: "Name",
      showOptionsButton: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      showOptionsButton: true,
    },
    {
      accessorKey: "role",
      header: "Role",
      showOptionsButton: true,
    },
  ];

  const handleStateChange = ({ sorting, pagination, columnFilters }) => {
    setQueryParams({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      filters: columnFilters,
    });
  };

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <FlexibleTable<User>
        columns={columns}
        state={{
          data: data?.users || [],
          totalItems: data?.totalItems || 0,
          isLoading,
        }}
        onStateChange={handleStateChange}
        pageSize={queryParams.pageSize}
        pageIndex={queryParams.pageIndex}
      />
    </div>
  );
};
