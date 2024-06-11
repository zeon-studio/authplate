"use client";
import SignOutButton from "@/components/SignoutButton";
import menu from "@/config/menu.json";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const { sidebar } = menu;
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="sidebar ">
      {children}
      <ul className="mb-4">
        {sidebar.map((item) => (
          <li key={item.name}>
            <Link
              href={item.url}
              className={`block px-2 py-1 hover:active
              ${item.url === pathname ? "active" : null}`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <SignOutButton />
    </aside>
  );
};

export default Sidebar;
