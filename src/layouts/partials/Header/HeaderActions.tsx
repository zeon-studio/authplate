import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";
import { Search } from "lucide-react";
import Link from "next/link";
import Profile from "../UserProfileMenu";

interface HeaderActionsProps {
  settings: {
    search: boolean;
    sticky_header: boolean;
    theme_switcher: boolean;
    default_theme: string;
    pagination: number;
    summary_length: number;
    blog_folder: string;
    payment: string;
  };
}

export function HeaderActions({ settings }: HeaderActionsProps) {
  const { data: auth, isPending } = useSession();

  return (
    <div className="order-1 ml-auto flex items-center md:order-2 lg:ml-0">
      {settings.search && (
        <Link
          className="mr-5 inline-block border-r border-border pr-5 text-xl text-text-dark hover:text-primary  "
          href="/search"
          aria-label="search"
        >
          <Search />
        </Link>
      )}
      <ThemeSwitcher />
      {!isPending &&
        (auth ? (
          <Profile auth={auth} />
        ) : (
          <Button asChild className="h-auto">
            <Link href="/signin">Sign In</Link>
          </Button>
        ))}
    </div>
  );
}
