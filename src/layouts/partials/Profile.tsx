"use client";

import { icons } from "@/components/Icons";
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Profile() {
  const { data: session } = useSession();
  const { user } = session || {};

  const fallback = () => {
    let firstName = user?.firstName;
    let lastName = user?.lastName;

    let firstInitial = firstName?.split(" ")[0]?.[0] || "";
    let lastInitial = lastName?.split(" ")[0]?.[0] || "";

    return firstInitial + lastInitial;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Avatar className="size-7">
            <AvatarImage
              src={user?.image}
              alt={user?.firstName + " " + user?.lastName}
            />
            <AvatarFallback className="text-xs bg-light text-text-light">
              {fallback()}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm font-semibold">{user?.firstName}</span>
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
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
