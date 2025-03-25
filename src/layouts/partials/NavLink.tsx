import { cn } from "@/lib/utils/shadcn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
  activeClass?: string;
  className?: string;
}

export default function NavLink({
  children,
  href,
  activeClass = "active",
  className,
}: NavLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        "nav-link block",
        className,
        (pathname === `${href}/` || pathname === href) && activeClass,
      )}
    >
      {children}
    </Link>
  );
}
