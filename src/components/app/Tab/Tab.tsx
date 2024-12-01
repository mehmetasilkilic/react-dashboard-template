import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Store
import { useTabStore } from "@/stores/useTabStore";

// Global Components
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useTabNavigation } from "./tabHook";

const SortableTab = ({ id }: { id: string }) => {
  const { tabs, activeTabId, setActiveTab } = useTabStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { navigate, wrappedRemoveTab } = useTabNavigation();

  const tab = tabs.find((tab) => tab.id === id);
  if (!tab) return null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTabClick = () => {
    setActiveTab(id);
    navigate(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isActive = activeTabId === id;
    const currentIndex = tabs.findIndex((t) => t.id === id);
    const newIndex = currentIndex === 0 ? 1 : currentIndex - 1;

    if (isActive && tabs.length > 1) {
      const newActiveTab = tabs[newIndex];
      setActiveTab(newActiveTab.id);
      navigate(newActiveTab.path);
    }

    wrappedRemoveTab(id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="pl-2 h-full flex items-center"
    >
      <Button
        variant={activeTabId === id ? "default" : "secondary"}
        size="sm"
        className="h-full gap-2 pl-1.5 pr-3 text-xs py-2"
        onClick={handleTabClick}
      >
        <span>{tab.title}</span>
        {tabs.length > 1 && (
          <Icon
            name="Cross1Icon"
            className="h-3 w-3"
            onClick={handleCloseTab}
          />
        )}
      </Button>
    </div>
  );
};

export const DraggableTabs = () => {
  const { tabs, reorderTabs } = useTabStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderTabs(active.id as string, over.id as string);
    }
  };

  return (
    <div className="w-full rounded-md bg-muted/50 h-full p-1 flex gap-2 items-center">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tabs.map((tab) => tab.id)}
          strategy={horizontalListSortingStrategy}
        >
          {tabs.map((tab) => (
            <SortableTab key={tab.id} id={tab.id} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
