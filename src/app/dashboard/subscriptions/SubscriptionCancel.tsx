"use client";

import { subscriptionCancel } from "@/app/action";
import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";

const SubscriptionCancel = ({ id }: { id: string }) => {
  const subscriptionCancelAction = subscriptionCancel.bind(null, id);
  const [state, dispatch] = useFormState(subscriptionCancelAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.status === 200) {
      router.refresh();
    }
  }, [state]);
  return (
    <form action={dispatch}>
      <SubmitButton
        label="Cancel Subscription"
        pending_label="Cancelling..."
        className="bg-red-800"
      />
    </form>
  );
};

export default SubscriptionCancel;
