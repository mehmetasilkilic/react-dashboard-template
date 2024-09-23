import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/app/Sidebar";
import { Icon } from "@/components/ui/icon";
import { DraggableTabs } from "@/components/app/Tab/Tab";
import { useTabNavigation } from "@/components/app/Tab/tabHook";

export const DashboardLayout = () => {
  useTabNavigation();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between px-4 py-1">
            <DraggableTabs />

            <div className="flex items-center ml-3">
              <button className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />

                <Icon name={"ChevronDownIcon"} className="ml-1" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
