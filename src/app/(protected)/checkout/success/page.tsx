import { Button } from "@/components/ui/button";
import { getServerAuth } from "@/lib/auth/auth-server";
import { Check } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SuccessPage() {
  const auth = await getServerAuth();

  if (!auth) {
    redirect(`/signin?from=${encodeURIComponent("/checkout/success")}`);
  }

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
          <Button size={"lg"} asChild={true}>
            <Link href={"/dashboard/subscriptions"}>Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
