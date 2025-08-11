import { InsightCardData } from "@app/(protectedRoutes)/dashboard/interfaces";

// Re-export properties data
export * from "./properties";

// Re-export default form data
export {
  defaultFormData,
  getDefaultData,
  getRandomDefault,
  shouldUseDefaultData,
} from "./staticData";

export interface ServiceRequest {
  id: string;
  type: string;
  property: string;
  priority: string;
  status: string;
}
export interface Payment {
  id: string;
  property: string;
  tenant: string;
  dueDate: string;
  amount: number;
}
export interface LeaseStatus {
  id: string;
  property: string;
  tenant: string;
  endDate: string;
  daysRemaining: number;
  status: string;
}
export const priorityData = [
  { name: "High", value: 25 },
  { name: "Medium", value: 35 },
  { name: "Low", value: 40 },
];
export const serviceTypeData = [
  { name: "Plumbing", value: 35 },
  { name: "Electrical", value: 24 },
  { name: "HVAC", value: 18 },
  { name: "Appliance", value: 15 },
  { name: "Other", value: 8 },
];
export const statusFilterOptions = [
  { label: "All", value: "all" },
  { label: "Vacant", value: "vacant" },
  { label: "Rented", value: "rented" },
];

export const insightCardsData: InsightCardData[] = [
  {
    id: "properties",
    title: "Properties",
    value: 12,
    icon: <i className="bx bx-building-house"></i>,
    trend: {
      value: "8%",
      direction: "up",
      period: "vs last month",
    },
  },
  {
    id: "tenants",
    title: "Tenants",
    value: 32,
    icon: <i className="bx bx-building-house"></i>,
    trend: {
      value: "12%",
      direction: "up",
      period: "vs last month",
    },
  },
  {
    id: "service-requests",
    title: "Service Requests",
    value: 12,
    icon: <i className="bx bx-help-circle"></i>,
    description: (
      <>
        <i className="bx bx-time"></i> 2 mins ago
      </>
    ),
  },
  {
    id: "recent-payment",
    title: "Recent Payment",
    value: "$2,800.00",
    icon: <i className="bx bx-money"></i>,
    description: (
      <>
        <i className="bx bx-time"></i> 45mins ago
      </>
    ),
  },
];

export const serviceRequestColumns = [
  { title: "Service Type", dataIndex: "type" },
  { title: "Property", dataIndex: "property" },
  { title: "Priority", dataIndex: "priority", isStatus: true },
  { title: "Status", dataIndex: "status", isStatus: true },
  {
    title: "Action",
    dataIndex: "id",
    render: () => (
      <div className="status primary">
        <i className="bx bx-glasses"></i>
      </div>
    ),
  },
];
export const paymentColumns = [
  { title: "Property", dataIndex: "property" },
  { title: "Tenant", dataIndex: "tenant" },
  { title: "Due Date", dataIndex: "dueDate" },
  {
    title: "Amount Due",
    dataIndex: "amount",
    render: (amount: number) => `${amount.toFixed(2)}`,
  },
  {
    title: "Action",
    dataIndex: "id",
    render: () => (
      <div className="status primary">
        <i className="bx bx-glasses"></i>
      </div>
    ),
  },
];
export const leaseStatusColumns = [
  { title: "Property", dataIndex: "property" },
  { title: "Tenant", dataIndex: "tenant" },
  { title: "Lease End Date", dataIndex: "endDate" },
  { title: "Days Remaining", dataIndex: "daysRemaining" },
  { title: "Renewal Status", dataIndex: "status", isStatus: true },
  {
    title: "Action",
    dataIndex: "id",
    render: () => (
      <div className="status primary">
        <i className="bx bx-glasses"></i>
        <i className="bx bx-envelope"></i>
      </div>
    ),
  },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "1",
    type: "Plumbing",
    property: "26 Wellington Ave, New York.",
    priority: "low",
    status: "closed",
  },
  {
    id: "2",
    type: "Plumbing",
    property: "26 Wellington Ave, New York.",
    priority: "urgent",
    status: "closed",
  },
  {
    id: "3",
    type: "Plumbing",
    property: "26 Wellington Ave, New York.",
    priority: "low",
    status: "resolved",
  },
  {
    id: "4",
    type: "Plumbing",
    property: "26 Wellington Ave, New York.",
    priority: "urgent",
    status: "open",
  },
];
export const payments: Payment[] = [
  {
    id: "1",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    dueDate: "12/09/2023",
    amount: 1900.0,
  },
  {
    id: "2",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    dueDate: "12/09/2023",
    amount: 1900.0,
  },
  {
    id: "3",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    dueDate: "12/09/2023",
    amount: 1900.0,
  },
  {
    id: "4",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    dueDate: "12/09/2023",
    amount: 1900.0,
  },
];
export const leaseStatuses: LeaseStatus[] = [
  {
    id: "1",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    endDate: "12/09/2023",
    daysRemaining: 14,
    status: "Pending",
  },
  {
    id: "2",
    property: "45 Central Park, New York.",
    tenant: "Sarah Williams",
    endDate: "15/09/2023",
    daysRemaining: 17,
    status: "Confirmed",
  },
  {
    id: "3",
    property: "112 Broadway St, New York.",
    tenant: "Michael Chen",
    endDate: "30/09/2023",
    daysRemaining: 32,
    status: "Not Renewing",
  },
  {
    id: "4",
    property: "8 Madison Ave, New York.",
    tenant: "Emily Johnson",
    endDate: "05/10/2023",
    daysRemaining: 37,
    status: "Not Started",
  },
];
export const occupancyColumns = [
  { title: "Property", dataIndex: "property" },
  { title: "Units", dataIndex: "maxAllowedUnits" },
  { title: "Occupied", dataIndex: "occupiedUnits" },
  {
    title: "Occupancy Rate",
    dataIndex: "occupancyRate",
    render: (rate: number) => (
      <div className="progress-bar">
        <div
          className={`progress ${rate < 85 ? "warning" : ""}`}
          style={{ width: `${rate}%` }}
        ></div>
        <span>{rate}%</span>
      </div>
    ),
  },
  {
    title: "Change",
    dataIndex: "change",
    render: (change: any) => (
      <span
        className={
          change.direction === "up"
            ? "success"
            : change.direction === "down"
            ? "danger"
            : ""
        }
      >
        {change.text}
      </span>
    ),
  },
];

export const filterOptions = [
  { label: "All", value: "all" },
  { label: ">90%", value: "high" },
  { label: "80-90%", value: "medium" },
  { label: "<80%", value: "low" },
];

export interface OccupancyData {
  id: string;
  property: string;
  maxAllowedUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  change: {
    value: number;
    direction: "up" | "down" | "none";
    text: string;
  };
}

export const occupancyData: OccupancyData[] = [
  {
    id: "1",
    property: "Wellington Apartments",
    maxAllowedUnits: 24,
    occupiedUnits: 22,
    occupancyRate: 92,
    change: {
      value: 4,
      direction: "up",
      text: "↑ 4%",
    },
  },
  {
    id: "2",
    property: "Brookside Residences",
    maxAllowedUnits: 36,
    occupiedUnits: 34,
    occupancyRate: 94,
    change: {
      value: 2,
      direction: "up",
      text: "↑ 2%",
    },
  },
  {
    id: "3",
    property: "Highland Towers",
    maxAllowedUnits: 18,
    occupiedUnits: 15,
    occupancyRate: 83,
    change: {
      value: 5,
      direction: "down",
      text: "↓ 5%",
    },
  },
  {
    id: "4",
    property: "Cedar Park Homes",
    maxAllowedUnits: 12,
    occupiedUnits: 11,
    occupancyRate: 92,
    change: {
      value: 0,
      direction: "none",
      text: "No change",
    },
  },
  {
    id: "5",
    property: "Riverview Condos",
    maxAllowedUnits: 20,
    occupiedUnits: 19,
    occupancyRate: 95,
    change: {
      value: 5,
      direction: "up",
      text: "↑ 5%",
    },
  },
  {
    id: "6",
    property: "Parkside Apartments",
    maxAllowedUnits: 40,
    occupiedUnits: 35,
    occupancyRate: 88,
    change: {
      value: 3,
      direction: "up",
      text: "↑ 3%",
    },
  },
  {
    id: "7",
    property: "Maple Grove Residences",
    maxAllowedUnits: 16,
    occupiedUnits: 13,
    occupancyRate: 81,
    change: {
      value: 6,
      direction: "down",
      text: "↓ 6%",
    },
  },
  {
    id: "8",
    property: "Oakwood Estates",
    maxAllowedUnits: 28,
    occupiedUnits: 26,
    occupancyRate: 93,
    change: {
      value: 1,
      direction: "up",
      text: "↑ 1%",
    },
  },
];
