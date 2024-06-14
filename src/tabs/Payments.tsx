import NavBar from "~/components/navbar/navbar";
import { formatMoney, timeModules } from "~/utils/utils";
import CreatePaymentButton from "../components/create-payment-button";
import { DataTable, Payment } from "../components/data-table/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { cn } from "../lib/utils";

interface PaymentsProps {
  payments: Payment[];
  isLoading: boolean;
  getPayments: () => Promise<void>;
  changeTab: (_tab: "payments" | "dashboard") => void;
  tab: "payments" | "dashboard";
}

export default function Payments({
  payments,
  isLoading,
  getPayments,
  changeTab,
  tab,
}: PaymentsProps) {
  const filterNotPaid = (payment: Payment) => {
    return payment.status !== "paid";
  };

  const filterWeek = (payment: Payment) => {
    return timeModules.isPaymentCreatedThisWeek(payment.dueAt.toString());
  };

  const filterMouth = (payment: Payment) => {
    return timeModules.isPaymentCreatedThisMonth(payment.dueAt.toString());
  };

  const totalPaymentsNotPaid =
    payments
      .filter(filterNotPaid)
      .reduce((acc, payment) => acc + payment.amount, 0) || 0;

  const totalPaymentsBePayedWeek =
    payments
      .filter(filterNotPaid)
      .filter(filterWeek)
      .reduce((acc, payment) => acc + payment.amount, 0) || 0;

  const totalPaymentsBePayedMouth =
    payments
      .filter(filterNotPaid)
      .filter(filterMouth)
      .reduce((acc, payment) => acc + payment.amount, 0) || 0;

  return (
    <div className={cn("flex min-h-screen w-full flex-col bg-muted")}>
      <div className="flex flex-col gap-4 py-4">
        <NavBar tab={tab} changeTab={changeTab} />
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 space-y-5">
          <div className="auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1">
              <Card
                x-chunk="dashboard-chunk-0"
                className="flex flex-col justify-between shadow-md"
              >
                <CardHeader>
                  <CardTitle>Your Payments</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    <span>
                      You have{" "}
                      {payments.filter(
                        (payment) =>
                          !["paid", "future"].includes(payment.status)
                      ).length || 0}{" "}
                      pending payments and{" "}
                      {payments.filter((payment) => payment.status === "paid")
                        .length || 0}{" "}
                      paid.
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <CreatePaymentButton getPayments={getPayments} />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-chunk-1" className="shadow-md">
                <CardHeader className="pb-2">
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className="text-4xl">
                    {formatMoney(totalPaymentsBePayedWeek)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Week:{" "}
                    <span>
                      {timeModules.getStartOfWeek().toLocaleDateString()} -{" "}
                      {timeModules.getEndOfWeek().toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={
                      100 -
                      ((totalPaymentsNotPaid - totalPaymentsBePayedWeek) /
                        totalPaymentsNotPaid) *
                        100
                    }
                    aria-label="25% increase"
                  />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-chunk-2" className="shadow-md">
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">
                    {formatMoney(totalPaymentsBePayedMouth)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Mouth:{" "}
                    <span className="capitalize">
                      {new Date().toLocaleString("en-US", { month: "long" })}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={
                      100 -
                      ((totalPaymentsNotPaid - totalPaymentsBePayedMouth) /
                        totalPaymentsNotPaid) *
                        100
                    }
                  />
                </CardFooter>
              </Card>
            </div>
          </div>
          <Card x-chunk="dashboard-chunk-3" className="shadow-lg">
            <CardHeader className="px-7">
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                Your pending payments are listed below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable isLoading={isLoading} payments={payments} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
