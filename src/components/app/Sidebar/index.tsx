// Global Components
import { Separator } from "@/components/ui/separator";

// Local Components
import { NavigationItem } from "./NavigationItem";
import { Logo } from "./Logo";

export const navigation: NavigationItem[] = [
  { name: "Home", link: "/", icon: "DashboardIcon" },
  { name: "Users", link: "/users", icon: "DashboardIcon" },
  {
    name: "Settings",
    link: "/settings",
    icon: "DashboardIcon",
    nested: [
      { name: "Home", link: "/", icon: "DashboardIcon" },
      { name: "Users", link: "/users", icon: "DashboardIcon" },
      { name: "Settings", link: "/settings", icon: "DashboardIcon" },
    ],
  },
];

export const Sidebar = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  return (
    <aside
      className="w-16 h-full flex-col sm:flex overflow-visible relative group z-20"
      onMouseEnter={() => setIsAsideOpen(true)}
      onMouseLeave={() => setIsAsideOpen(false)}
    >
      <nav
        className={`flex flex-col gap-1 px-2.5 py-4 bg-background border-r h-full transition-all ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
          isAsideOpen ? "pl-2.5 w-[300px] shadow-lg" : "w-full "
        }`}
      >
        <Logo isAsideOpen={isAsideOpen} />
        <Separator className="mt-2 mb-1" />
        <NavigationItem navigation={navigation} isAsideOpen={isAsideOpen} />
      </nav>
    </aside>
  );
};
