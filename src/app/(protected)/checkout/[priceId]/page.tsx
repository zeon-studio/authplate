import { CheckoutContents } from "@/layouts/components/payment/paddle/CheckoutContents";
import { getServerAuth } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ priceId: string }>;
}) {
  const auth = await getServerAuth();
  const { priceId } = await params;

  if (!auth) {
    redirect(`/signin?from=${encodeURIComponent("/checkout/" + priceId)}`);
  }

  return (
    <div className={"w-full min-h-screen relative overflow-hidden"}>
      <div
        className={
          "mx-auto max-w-6xl relative px-[16px] md:px-[32px] py-[24px] flex flex-col gap-6 justify-between"
        }
      >
        <CheckoutContents auth={auth} />
      </div>
    </div>
  );
}
