import { create } from "zustand";

interface Tab {
  id: string;
  title: string;
  path: string;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
  reorderTabs: (activeId: string, overId: string) => void;
  setActiveTab: (id: string) => void;
}

export const useTabStore = create<TabState>((set) => ({
  tabs: [],
  activeTabId: null,
  addTab: (tab) =>
    set((state) => {
      const existingTab = state.tabs.find((t) => t.path === tab.path);
      if (existingTab) {
        return { activeTabId: existingTab.id };
      }
      return {
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      };
    }),
  removeTab: (id) =>
    set((state) => {
      const newTabs = state.tabs.filter((tab) => tab.id !== id);
      return {
        tabs: newTabs,
        activeTabId:
          state.activeTabId === id
            ? newTabs.length > 0
              ? newTabs[0].id
              : null
            : state.activeTabId,
      };
    }),
  reorderTabs: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.tabs.findIndex((tab) => tab.id === activeId);
      const newIndex = state.tabs.findIndex((tab) => tab.id === overId);

      const newTabs = [...state.tabs];
      const [movedItem] = newTabs.splice(oldIndex, 1);
      newTabs.splice(newIndex, 0, movedItem);

      return { tabs: newTabs };
    }),
  setActiveTab: (id) =>
    set(() => ({
      activeTabId: id,
    })),
}));
