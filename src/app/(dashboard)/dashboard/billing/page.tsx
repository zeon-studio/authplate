import { getUserPaymentHistory } from "@/app/actions/subscriptions";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseMoney } from "@/lib/paddle/parse-money";

export default async function Billing() {
  const { user } = (await auth()) || {};

  const paymentHistories = await getUserPaymentHistory(user?.id!);
  if (!paymentHistories?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold mb-2">
          Error loading payment history
        </h1>
        <p className="text-muted-foreground">
          There was an error loading your payment history. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Billing & Payments</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your payment history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction Id</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Plan name</TableHead>
                <TableHead>Billing Cycle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistories.data.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{payment.transactionId}</TableCell>
                  <TableCell>
                    {parseMoney(
                      payment.totalAmount.toString(),
                      payment.currency,
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={"success"} className="capitalize">
                      {payment.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    {payment.paymentMethod}
                  </TableCell>
                  <TableCell>{payment.subscription?.planName}</TableCell>
                  <TableCell>{payment.subscription?.billingCycle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
