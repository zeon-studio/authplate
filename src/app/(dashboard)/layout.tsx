import menu from "@/config/menu.json";
import { Separator } from "@/layouts/components/ui/separator";
import NavLink from "@/layouts/partials/NavLink";

const sidebarMenu = menu.sidebar;
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
            {sidebarMenu.map((item) => (
              <li key={item.name}>
                <NavLink href={item.url}>{item.name}</NavLink>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 px-4 py-2">{children}</main>
      </div>
    </>
  );
}
