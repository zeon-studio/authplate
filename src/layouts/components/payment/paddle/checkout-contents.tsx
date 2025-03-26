"use client";

import { PADDLE_CLIENT_TOKEN, PADDLE_ENV } from "@/config/paddle";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PriceSection } from "./price-section";

interface Props {
  userEmail?: string;
}

type BillingPeriod = "month" | "year" | "lifetime";

export function CheckoutContents({ userEmail }: Props) {
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(
    null,
  );

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event);
  };

  const { priceId } = useParams<{ priceId: string }>();

  useEffect(() => {
    if (
      !paddle?.Initialized &&
      PADDLE_CLIENT_TOKEN &&
      status === "authenticated"
    ) {
      initializePaddle({
        token: PADDLE_CLIENT_TOKEN,
        environment: PADDLE_ENV,
        eventCallback: (event) => {
          if (event.data && event.name) {
            handleCheckoutEvents(event.data);
          }
        },
        checkout: {
          settings: {
            displayMode: "inline",
            showAddDiscounts: true,
            variant: "one-page",
            theme: "light",
            allowLogout: !userEmail,
            frameTarget: "paddle-checkout-frame",
            frameInitialHeight: 450,
            frameStyle:
              "width: 100%; background-color: transparent; border: none",
            successUrl: "/checkout/success",
          },
        },
      }).then(async (paddle) => {
        if (paddle && priceId) {
          setPaddle(paddle);
          paddle.Checkout.open({
            ...(userEmail && {
              customer: {
                email: userEmail,
              },
            }),
            items: [{ priceId: priceId, quantity: 1 }],
            customData: {
              email: session?.user?.email,
              name: session.user.firstName + " " + session.user.lastName,
              billingFrequency: params.get("billing") as BillingPeriod,
              package: params.get("plan") as string,
            },
          });
        }
      });
    }
  }, [
    paddle?.Initialized,
    params,
    priceId,
    session?.user?.email,
    session?.user.firstName,
    session?.user.lastName,
    status,
    userEmail,
  ]);

  useEffect(() => {
    if (paddle && priceId && paddle.Initialized) {
      paddle.Checkout.updateItems([{ priceId: priceId!, quantity: 1 }]);
    }
  }, [paddle, priceId]);

  return (
    <div
      className={
        "relative flex flex-col justify-between rounded-lg bg-light md:min-h-[400px] md:p-10 md:pl-16 md:pt-16 md:backdrop-blur-[24px]"
      }
    >
      <div className={"flex flex-col gap-8 md:flex-row md:gap-16"}>
        <div className={"w-full md:w-[400px]"}>
          <PriceSection checkoutData={checkoutData} quantity={1} />
        </div>
        <div className={"min-w-[375px] lg:min-w-[535px]"}>
          <div className={"mb-8 text-base font-semibold leading-[20px]"}>
            Payment details
          </div>
          <div className={"paddle-checkout-frame"} />
        </div>
      </div>
    </div>
  );
}
