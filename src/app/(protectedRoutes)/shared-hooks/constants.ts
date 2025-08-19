export interface FilterOption {
  label: string;
  value: string;
}

export const COMMON_SORT_OPTIONS: FilterOption[] = [
  { label: "All", value: "" },
  { label: "Name", value: "fullName" },
  { label: "Email", value: "email" },
  { label: "Department", value: "department" },
  { label: "Role", value: "role" },
  { label: "Created Date", value: "createdAt" },
];

export const COMMON_DEPARTMENT_OPTIONS: FilterOption[] = [
  { label: "All Departments", value: "" },
  { label: "Management", value: "management" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Operations", value: "operations" },
  { label: "Accounting", value: "accounting" },
  { label: "Leasing", value: "leasing" },
  { label: "Marketing", value: "marketing" },
  { label: "Security", value: "security" },
  { label: "Other", value: "other" },
];

export const COMMON_STATUS_OPTIONS: FilterOption[] = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const ALL_ROLE_OPTIONS: FilterOption[] = [
  { label: "All Roles", value: "" },
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Staff", value: "staff" },
  { label: "Tenant", value: "tenant" },
  { label: "Vendor", value: "vendor" },
];

export const EMPLOYEE_ROLE_OPTIONS: FilterOption[] = [
  { label: "All Employee Roles", value: "" },
  { label: "Manager", value: "manager" },
  { label: "Staff", value: "staff" },
];

export const TYPE_OPTIONS: FilterOption[] = [
  { label: "All Types", value: "" },
  { label: "Employee", value: "employee" },
  { label: "Tenant", value: "tenant" },
  { label: "Vendor", value: "vendor" },
];
