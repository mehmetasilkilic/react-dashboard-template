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
import { useNavigate } from "react-router-dom";

// Store
import { useTabStore } from "@/stores/useTabStore";

// Global Components
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const titleSeparator = (title: string) => {
  const parts = title.split("/");
  const p = parts[parts.length - 1]
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return p || "Dashboard";
};

const SortableTab = ({ id }: { id: string }) => {
  const { tabs, removeTab, activeTabId, setActiveTab } = useTabStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const navigate = useNavigate();

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
        <span>{titleSeparator(tab.title)}</span>
        <Icon
          name={"Cross1Icon"}
          className="h-3 w-3"
          onClick={(e) => {
            e.stopPropagation();
            removeTab(id);
          }}
        />
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
