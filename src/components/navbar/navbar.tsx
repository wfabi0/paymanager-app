import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import NavItem from "./nav-item";

interface NavBarProps {
  changeTab: (_tab: "payments" | "dashboard") => void;
  tab: "payments" | "dashboard";
}

export default function NavBar({ changeTab, tab }: NavBarProps) {
  return (
    <header className="flex px-7 justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <NavItem
            name="Dashboard"
            changeTab={changeTab}
            clickable={tab !== "dashboard"}
          />
          <BreadcrumbSeparator />
          <NavItem
            name="Payments"
            changeTab={changeTab}
            clickable={tab !== "payments"}
          />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex">
        {tab === "payments" && (
          <button
            className="hover:text-zinc-600 transition duration-300"
            onClick={() => changeTab("dashboard")}
          >
            <ChevronLeft />
          </button>
        )}
        {tab === "dashboard" && (
          <button
            className="hover:text-zinc-600 transition duration-300"
            onClick={() => changeTab("payments")}
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </header>
  );
}
