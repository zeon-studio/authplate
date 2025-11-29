"use client";

import { icons } from "@/components/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import menu from "@/config/menu.json";
import { Session, signOut } from "@/lib/auth/auth-client";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Profile({ auth }: { auth: Session }) {
  const router = useRouter();
  const { user } = auth;

  const fallback = () => {
    const firstName = user.firstName;
    const lastName = user.lastName;

    const firstInitial = firstName?.split(" ")[0]?.[0] || "";
    const lastInitial = lastName?.split(" ")[0]?.[0] || "";

    return firstInitial + lastInitial;
  };

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="px-1" variant="outline">
          <Avatar className="size-7">
            <AvatarImage
              src={user?.image as string | undefined}
              alt={user?.firstName + " " + user?.lastName}
            />
            <AvatarFallback className="text-xs bg-light text-text-light">
              {fallback()}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm font-semibold flex-1">
            {user?.firstName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menu.dashboard.map((item, index) => {
            const Icon = icons[item.icon as keyof typeof icons];
            return (
              <DropdownMenuItem key={index} asChild>
                <Link href={item.url} className="cursor-pointer">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
