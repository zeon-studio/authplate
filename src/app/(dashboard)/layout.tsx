import SidebarMenu from "./_components/sidebarMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-16 transition-[width] flex-none lg:w-[220px] lg:h-[calc(100vh_-_99px)] h-[calc(100vh_-_85px)] border-r border-r-border/50 bg-background sticky top-[85px] lg:top-[99px] left-0">
          <SidebarMenu />
        </aside>
        <main className="w-full px-4 py-2">{children}</main>
      </div>
    </>
  );
}
