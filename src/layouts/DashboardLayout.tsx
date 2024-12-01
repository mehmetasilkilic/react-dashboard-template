import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/app/Sidebar";
import { Icon } from "@/components/ui/icon";
import { DraggableTabs } from "@/components/app/Tab/Tab";
import { useTabNavigation } from "@/components/app/Tab/tabHook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DashboardLayout = () => {
  useTabNavigation();

  const handleSignOut = () => {
    sessionStorage.removeItem("authToken");

    window.location.href = "/auth/sign-in";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between px-4 py-1">
            <DraggableTabs />

            <div className="flex items-center ml-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
                      alt="User avatar"
                    />
                    <Icon name="ChevronDownIcon" className="ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
