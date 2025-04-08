import menu from "@/config/menu.json";
import { icons } from "@/layouts/components/Icons";
import { Separator } from "@/layouts/components/ui/separator";
import NavLink from "@/layouts/partials/NavLink";

const sidebarMenu = menu.dashboard;
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Separator className="bg-border/50" />

      {/* Sidebar */}
      <div className="flex">
        <aside className="max-w-64 w-full border-r border-r-border/50">
          <ul className="px-2 space-y-0">
            {sidebarMenu.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons];
              return (
                <li key={item.name}>
                  <NavLink href={item.url}>
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">{item.name}</div>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </aside>
        <main className="flex-1 px-4 py-2">{children}</main>
      </div>
    </>
  );
}
