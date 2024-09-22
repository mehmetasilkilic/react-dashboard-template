// Global Components
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface Props {
  isAsideOpen: boolean;
}

export const Logo = ({ isAsideOpen }: Props) => {
  return (
    <div className="mx-auto gap-2 relative z-20 w-full flex items-center text-lg font-medium">
      <Button variant="ghost" size="icon" className="flex-shrink-0 ml-1">
        <Icon name={"DashboardIcon"} />
      </Button>

      <div
        className={`transition-all -z-10 ${
          isAsideOpen
            ? "opacity-100 scale-100 translate-x-0 w-full"
            : "opacity-0 scale-0 w-0 translate-x-[-100%]"
        }`}
      >
        Dashboard
      </div>
    </div>
  );
};
