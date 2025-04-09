import { icons } from "@/components/Icons";
import menu from "@/config/menu.json";
import NavLink from "@/layouts/partials/NavLink";

const sidebarMenu = menu.dashboard;

export default function SidebarMenu() {
  return (
    <ul className="px-2 mt-10 space-y-0">
      {sidebarMenu.map((item) => {
        const Icon = icons[item.icon as keyof typeof icons];
        return (
          <li key={item.name}>
            <NavLink
              activeClass="bg-accent text-light"
              className="rounded-lg"
              href={item.url}
            >
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-current" />
                </div>
                <div className="flex-1 min-w-0 hidden lg:block">
                  {item.name}
                </div>
              </div>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
