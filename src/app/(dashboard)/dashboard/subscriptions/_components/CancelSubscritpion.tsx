"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/useDialog";
import { cancelSubscription } from "@/lib/paddle/cancelSubscritpion";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CancelSubscriptionDialogProps {
  subscriptionId: string;
}

export function CancelSubscriptionDialog({
  subscriptionId,
}: CancelSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpenChange } = useDialog();

  async function handleCancelSubscription() {
    onOpenChange(false);
    setLoading(true);
    try {
      await cancelSubscription(subscriptionId);
      toast.success("Subscription cancelled successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={loading}
          variant="destructive"
          className="w-full bg-destructive/80"
        >
          Cancel Subscription
          {loading && <Loader2 className="ml-2 size-4 animate-spin" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your subscription will be cancelled at
            the end of the current billing period.
            <div className="mt-4 rounded-md border border-warning/20 bg-warning/10 p-4">
              <h4 className="mb-2 text-sm font-medium text-warning">
                What happens when you cancel?
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-destructive">
                <li>Access continues until the end of your billing period</li>
                <li>No additional charges will be made</li>
                <li>All your data will be preserved</li>
                <li>You can reactivate your subscription at any time</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
              {loading && <Loader2 className="ml-2 size-4 animate-spin" />}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
