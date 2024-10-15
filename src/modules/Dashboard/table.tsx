import React, { useState, useCallback, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  FlexibleTable,
  TableState,
  TableActions,
} from "@/components/app/FlexibleTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

// Dummy data
const dummyUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Manager",
    status: "inactive",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "Admin",
    status: "inactive",
  },
  // Add more dummy users as needed
];

// Custom hook for managing data
const useUserData = () => {
  const [tableState, setTableState] = useState<TableState<User>>({
    data: [],
    pageCount: 1,
    isLoading: false,
  });

  const fetchData = useCallback((actions: TableActions) => {
    const { sorting, pagination, columnFilters } = actions;
    setTableState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    setTimeout(() => {
      let filteredData = [...dummyUsers];

      // Apply filters
      columnFilters.forEach((filter) => {
        filteredData = filteredData.filter((user) =>
          String(user[filter.id as keyof User])
            .toLowerCase()
            .includes(filter.value.toLowerCase())
        );
      });

      // Apply sorting
      if (sorting.length > 0) {
        const { id, desc } = sorting[0];
        filteredData.sort((a, b) => {
          if (a[id as keyof User] < b[id as keyof User]) return desc ? 1 : -1;
          if (a[id as keyof User] > b[id as keyof User]) return desc ? -1 : 1;
          return 0;
        });
      }

      // Apply pagination
      const start = pagination.pageIndex * pagination.pageSize;
      const paginatedData = filteredData.slice(
        start,
        start + pagination.pageSize
      );

      setTableState({
        data: paginatedData,
        pageCount: Math.ceil(filteredData.length / pagination.pageSize),
        isLoading: false,
      });
    }, 300); // Simulate network delay
  }, []);

  return { tableState, fetchData };
};

export const UserTable: React.FC = () => {
  const { tableState, fetchData } = useUserData();

  const columns: (ColumnDef<User> & { showOptionsButton?: boolean })[] = [
    {
      header: "ID",
      accessorKey: "id",
      showOptionsButton: true,
    },
    {
      header: "Name",
      accessorKey: "name",
      showOptionsButton: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      showOptionsButton: true,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => (
        <select
          value={row.original.role}
          onChange={(e) => handleRoleChange(row.original.id, e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Manager">Manager</option>
        </select>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.original.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleEdit(row.original.id)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
      ),
    },
  ];

  const handleRoleChange = (userId: number, newRole: string) => {
    console.log(`Updating role for user ${userId} to ${newRole}`);
    // In a real application, you would update the data here
  };

  const handleEdit = (userId: number) => {
    console.log(`Editing user ${userId}`);
    // Implement edit functionality
  };

  useEffect(() => {
    fetchData({
      sorting: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnFilters: [],
    });
  }, [fetchData]);

  return (
    <FlexibleTable
      columns={columns}
      state={tableState}
      onStateChange={fetchData}
    />
  );
};
