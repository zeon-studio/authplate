"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
export default function SuccessPage() {
  const { data: session } = useSession();

  return (
    <div className={"relative h-screen overflow-hidden"}>
      <div className={"absolute inset-0 flex items-center justify-center px-6"}>
        <div className={"flex flex-col items-center text-center text-white"}>
          <div>
            <div className="inline-block border-2 p-2 border-green-400 rounded-full">
              <Check className="size-14 text-green-600 mx-auto" />
            </div>
          </div>
          <h1
            className={
              "pb-6 text-4xl font-medium leading-9 md:text-[80px] md:leading-[80px]"
            }
          >
            Payment successful
          </h1>
          <p className={"pb-16 text-lg"}>
            Success! Your payment is complete, and you’re all set.
          </p>
          <Button variant={"secondary"} asChild={true}>
            {session?.user ? (
              <Link href={"/dashboard/subscriptions"}>Go to Dashboard</Link>
            ) : (
              <Link href={"/"}>Go to Home</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
