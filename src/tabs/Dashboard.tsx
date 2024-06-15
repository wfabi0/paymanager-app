import {
  ClipboardList,
  Frown,
  HeartPulse,
  Meh,
  PiggyBank,
  Smile,
} from "lucide-react";
import { Payment } from "~/components/data-table/data-table";
import Graphic from "~/components/graphic/graphic";
import NavBar from "~/components/navbar/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { formatMoney, formatThousands } from "~/utils/utils";

type Level = "good" | "satisfactory" | "bad";

const levelDetail = {
  good: {
    icon: <Smile />,
    color: "text-green-600",
    message: "Your status is good, keep it up!",
    border: "border-[1.5px] border-green-600",
  },
  satisfactory: {
    icon: <Meh />,
    color: "text-yellow-500",
    message: "Your status is ok, but you can do better.",
    border: "border-[1.5px] border-yellow-500",
  },
  bad: {
    icon: <Frown />,
    color: "text-red-700",
    message: "Your status is bad right now, you need to improve.",
    border: "border-[1.5px] border-red-700",
  },
} as const;

function calculateLevel(amountDue: number, amountPaid: number): Level {
  const percentagePaid = (amountPaid / amountDue) * 100;
  if (percentagePaid >= 100) {
    return "good";
  } else if (percentagePaid >= 75) {
    return "satisfactory";
  } else {
    return "bad";
  }
}

interface DashboardProps {
  payments: Payment[];
  isLoading: boolean;
  getPayments: () => Promise<void>;
  changeTab: (_tab: "payments" | "dashboard") => void;
  tab: "payments" | "dashboard";
}

export default function Dashboard({
  payments,
  // isLoading,
  // getPayments,
  changeTab,
  tab,
}: DashboardProps) {
  const status = calculateLevel(
    payments
      .filter((p) => p.status !== "paid")
      .reduce((acc, payment) => acc + payment.amount, 0),
    payments
      .filter((p) => p.status === "paid")
      .reduce((acc, payment) => acc + payment.amount, 0)
  );

  return (
    <div className={cn("flex min-h-screen w-full flex-col bg-muted")}>
      <div className="flex flex-col gap-4 py-4">
        <NavBar tab={tab} changeTab={changeTab} />
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 space-y-5">
          <div className="auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1">
              <Card x-chunk="dashboard-chunk-1" className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">
                    Total Due
                  </CardTitle>
                  <PiggyBank className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center">
                  <div className="text-2xl font-bold">
                    {formatMoney(
                      payments.reduce(
                        (acc, payment) => acc + payment.amount,
                        0
                      ) || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your total due amount.
                  </p>
                </CardContent>
              </Card>
              <Card
                x-chunk="dashboard-chunk-2"
                className={`shadow-md ${levelDetail[status].border}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">Status</CardTitle>
                  <HeartPulse className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center">
                  <div className="flex items-center gap-x-1 text-2xl font-bold">
                    <span className="capitalize">{status}</span>
                    <span className={levelDetail[status].color}>
                      {levelDetail[status].icon}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {levelDetail[status].message}
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-chunk-3" className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">
                    Total Payments
                  </CardTitle>
                  <ClipboardList className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center">
                  <div className="text-2xl font-bold">
                    {formatThousands(payments.length || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your total created payments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card x-chunk="dashboard-chunk-3" className="shadow-lg -space-y-24">
            <CardHeader className="px-7">
              <CardTitle>Graphic</CardTitle>
              <CardDescription>
                Your graphic will be displayed here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Graphic payments={payments} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
