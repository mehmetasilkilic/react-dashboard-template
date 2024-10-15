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
  {
    id: 6,
    name: "Eva Wilson",
    email: "eva@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 7,
    name: "Frank Miller",
    email: "frank@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 8,
    name: "Grace Lee",
    email: "grace@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 9,
    name: "Henry Taylor",
    email: "henry@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 10,
    name: "Ivy Chen",
    email: "ivy@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 11,
    name: "Jack Robinson",
    email: "jack@example.com",
    role: "Manager",
    status: "inactive",
  },
  {
    id: 12,
    name: "Karen White",
    email: "karen@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 13,
    name: "Liam Harris",
    email: "liam@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 14,
    name: "Mia Garcia",
    email: "mia@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 15,
    name: "Nathan Lopez",
    email: "nathan@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 16,
    name: "Olivia Martin",
    email: "olivia@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 17,
    name: "Peter Wang",
    email: "peter@example.com",
    role: "Admin",
    status: "inactive",
  },
  {
    id: 18,
    name: "Quinn Taylor",
    email: "quinn@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 19,
    name: "Rachel Kim",
    email: "rachel@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 20,
    name: "Samuel Brown",
    email: "samuel@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 21,
    name: "Tina Chen",
    email: "tina@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 22,
    name: "Ulysses Davis",
    email: "ulysses@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 23,
    name: "Victoria Wilson",
    email: "victoria@example.com",
    role: "Manager",
    status: "inactive",
  },
  {
    id: 24,
    name: "William Lee",
    email: "william@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 25,
    name: "Xena Johnson",
    email: "xena@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 26,
    name: "Yves Martin",
    email: "yves@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 27,
    name: "Zoe Thompson",
    email: "zoe@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 28,
    name: "Adam Garcia",
    email: "adam@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 29,
    name: "Bella Rodriguez",
    email: "bella@example.com",
    role: "Admin",
    status: "inactive",
  },
  {
    id: 30,
    name: "Chris Evans",
    email: "chris@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 31,
    name: "Diana Foster",
    email: "diana@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 32,
    name: "Ethan Hunt",
    email: "ethan@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 33,
    name: "Fiona Green",
    email: "fiona@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 34,
    name: "George Baker",
    email: "george@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 35,
    name: "Hannah Moore",
    email: "hannah@example.com",
    role: "Manager",
    status: "inactive",
  },
  {
    id: 36,
    name: "Ian Clark",
    email: "ian@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 37,
    name: "Julia Scott",
    email: "julia@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 38,
    name: "Kevin Young",
    email: "kevin@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 39,
    name: "Laura Hall",
    email: "laura@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 40,
    name: "Michael King",
    email: "michael@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 41,
    name: "Nora Wright",
    email: "nora@example.com",
    role: "Admin",
    status: "inactive",
  },
  {
    id: 42,
    name: "Oscar Lopez",
    email: "oscar@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 43,
    name: "Pamela Adams",
    email: "pamela@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: 44,
    name: "Quentin Morris",
    email: "quentin@example.com",
    role: "User",
    status: "inactive",
  },
  {
    id: 45,
    name: "Rita Nelson",
    email: "rita@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 46,
    name: "Steve Carter",
    email: "steve@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 47,
    name: "Tara Mitchell",
    email: "tara@example.com",
    role: "Manager",
    status: "inactive",
  },
  {
    id: 48,
    name: "Uma Patel",
    email: "uma@example.com",
    role: "User",
    status: "active",
  },
  {
    id: 49,
    name: "Victor Reed",
    email: "victor@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 50,
    name: "Wendy Cooper",
    email: "wendy@example.com",
    role: "User",
    status: "inactive",
  },
];

// Custom hook for managing data
const useUserData = () => {
  const [tableState, setTableState] = useState<TableState<User>>({
    data: [],
    totalItems: dummyUsers.length,
    isLoading: false,
  });
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

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
        totalItems: filteredData.length,
        isLoading: false,
      });
      setPageSize(pagination.pageSize);
      setPageIndex(pagination.pageIndex);
    }, 300); // Simulate network delay
  }, []);

  return { tableState, fetchData, pageSize, pageIndex };
};

export const UserTable: React.FC = () => {
  const { tableState, fetchData, pageSize, pageIndex } = useUserData();

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
      pageSize={pageSize}
      pageIndex={pageIndex}
    />
  );
};
