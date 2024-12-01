import { useNavigate, useLocation, useMatches } from "react-router-dom";
import { useTabStore } from "@/stores/useTabStore";
import { useEffect, useRef } from "react";

export const useTabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches();
  const { addTab, setActiveTab, tabs, removeTab } = useTabStore();
  const isRemovingTab = useRef(false);

  useEffect(() => {
    if (isRemovingTab.current) {
      isRemovingTab.current = false;
      return;
    }

    const existingTab = tabs.find((tab) => tab.path === location.pathname);
    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      const matchingRoute = matches.find(
        (match) => match.pathname === location.pathname
      );
      //@ts-ignore
      const metadata = matchingRoute?.data?.meta || {};

      const newTab = {
        id: Date.now().toString(),
        title: metadata.title,
        path: location.pathname,
        description: metadata.description,
      };
      addTab(newTab);
      setActiveTab(newTab.id);
    }
  }, [location.pathname]);

  const wrappedRemoveTab = (id: string) => {
    isRemovingTab.current = true;
    removeTab(id);
  };

  return { navigate, wrappedRemoveTab };
};
