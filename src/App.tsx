import { useEffect, useState } from "react";
import { Payment } from "./components/data-table/data-table";
import { dbServices } from "./modules/database/db-services";
import "./styles/globals.css";
import Dashboard from "./tabs/Dashboard";
import Payments from "./tabs/Payments";

export default function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [tab, setTab] = useState<"payments" | "dashboard">("payments");

  const changeTab = (_tab: "payments" | "dashboard") => {
    setTab(_tab);
  };

  const getPayments = async () => {
    setIsLoading(true);
    const payments = await dbServices.getAllSettings();
    setIsLoading(false);
    if (!payments) return;
    setPayments(payments);
  };

  useEffect(() => {
    dbServices.initDb();
    // dbServices.deleteAllSettings()
    // dbServices.testDb();
    getPayments();
  }, []);

  return (
    <>
      {tab === "payments" ? (
        <Payments
          payments={payments}
          isLoading={isLoading}
          getPayments={getPayments}
          changeTab={changeTab}
          tab={tab}
        />
      ) : (
        <Dashboard
          payments={payments}
          isLoading={isLoading}
          getPayments={getPayments}
          changeTab={changeTab}
          tab={tab}
        />
      )}
    </>
  );
}
