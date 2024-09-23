import { useNavigate, useLocation } from "react-router-dom";
import { useTabStore } from "@/stores/useTabStore";
import { useEffect } from "react";

export const useTabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTab, setActiveTab, tabs } = useTabStore();

  useEffect(() => {
    const existingTab = tabs.find((tab) => tab.path === location.pathname);
    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      const newTab = {
        id: Date.now().toString(),
        title: location.pathname, // You might want to create a mapping of paths to titles
        path: location.pathname,
      };
      addTab(newTab);
    }
  }, [location.pathname, addTab, setActiveTab, tabs]);

  return navigate;
};
