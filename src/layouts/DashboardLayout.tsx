import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Users,
  Settings,
} from "lucide-react";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "User", icon: Users, path: "/user" },
    { name: "Settings", icon: Settings, path: "/user/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-1 right-1 md:hidden"
        >
          <X className="w-6 h-6" />
        </button>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                location.pathname === item.path
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="flex items-center">
              <span className="mr-2">John Doe</span>
              <button className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
