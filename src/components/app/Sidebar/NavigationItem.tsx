import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/ui/icon";

export interface NavigationItem {
  name: string;
  link: string;
  icon: IconName;
  nested?: NavigationItem[];
}

interface Props {
  navigation: NavigationItem[];
  isAsideOpen: boolean;
}

export const NavigationItem = ({ navigation, isAsideOpen }: Props) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (item: NavigationItem) => {
    return (
      location.pathname === item.link ||
      (item.nested &&
        item.nested.some((nestedItem) =>
          location.pathname.startsWith(nestedItem.link)
        ))
    );
  };

  const getNestedHeight = (item: NavigationItem) => {
    return item.nested ? item.nested.length * 44 : 0;
  };

  const handleMouseEnter = (link: string) => {
    setHoveredItem(link);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      {navigation.map((item) => (
        <div
          key={item.link}
          onMouseEnter={() => handleMouseEnter(item.link)}
          onMouseLeave={handleMouseLeave}
        >
          <Link to={item.link}>
            <Button
              variant="ghost"
              className={`w-full h-10 justify-start rounded-md ${
                isActive(item)
                  ? "bg-muted text-slate-900"
                  : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} />
              <span
                className={`transition-all text-sm w-full truncate ${
                  isAsideOpen
                    ? "opacity-100 scale-100 ml-2 translate-x-0"
                    : "w-0 -z-10 opacity-0 scale-0 translate-x-[-100%]"
                }`}
              >
                {item.name}
              </span>
              {isAsideOpen && item.nested && (
                <Icon
                  name={
                    hoveredItem === item.link
                      ? "ChevronDownIcon"
                      : "ChevronRightIcon"
                  }
                />
              )}
            </Button>
          </Link>

          {item.nested && (
            <div
              className={`mt-1 pl-5 space-y-1 w-full transition-all duration-200 ease-in-out overflow-hidden ${
                hoveredItem === item.link && isAsideOpen
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              style={{
                height:
                  hoveredItem === item.link && isAsideOpen
                    ? `${getNestedHeight(item)}px`
                    : "0",
              }}
            >
              <NavigationItem
                navigation={item.nested}
                isAsideOpen={isAsideOpen}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
};
