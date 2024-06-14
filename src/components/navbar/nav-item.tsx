import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "../ui/breadcrumb";

interface NavItemProps {
  name: string;
  changeTab: (_tab: "payments" | "dashboard") => void;
  clickable?: boolean;
}

export default function NavItem({ name, changeTab, clickable }: NavItemProps) {
  clickable == undefined && (clickable = true);
  return clickable ? (
    <BreadcrumbItem>
      <BreadcrumbLink
        className="cursor-pointer"
        onClick={() =>
          changeTab(name.toString().toLowerCase() as "payments" | "dashboard")
        }
      >
        {name.toString()}
      </BreadcrumbLink>
    </BreadcrumbItem>
  ) : (
    <BreadcrumbItem>
      <BreadcrumbPage className="font-semibold">{name}</BreadcrumbPage>
    </BreadcrumbItem>
  );
}
