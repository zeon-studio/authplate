"use client";

import { CheckoutContents } from "@/layouts/components/payment/paddle/checkout-contents";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data } = useSession();
  return (
    <div className={"w-full min-h-screen relative overflow-hidden"}>
      <div
        className={
          "mx-auto max-w-6xl relative px-[16px] md:px-[32px] py-[24px] flex flex-col gap-6 justify-between"
        }
      >
        <CheckoutContents userEmail={data?.user?.email} />
      </div>
    </div>
  );
}
