import { useTableData } from "@components/Table/hook";
import { IPaginationQuery } from "@interfaces/utils.interface";
import { IEmployeeFilterParams, employeeService } from "@services/employee";

export interface FilterOption {
  label: string;
  value: string;
}

export const useGetEmployees = (cuid: string) => {
  const sortOptions: FilterOption[] = [
    { label: "All", value: "" },
    { label: "Name", value: "name" },
    { label: "Department", value: "department" },
    { label: "Role", value: "role" },
    { label: "Start Date", value: "startDate" },
  ];

  const departmentOptions: FilterOption[] = [
    { label: "All Departments", value: "" },
    { label: "Management", value: "management" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Leasing", value: "leasing" },
    { label: "Accounting", value: "accounting" },
    { label: "Marketing", value: "marketing" },
    { label: "Security", value: "security" },
    { label: "Other", value: "other" },
  ];

  const roleOptions: FilterOption[] = [
    { label: "All Roles", value: "" },
    { label: "Property Manager", value: "manager" },
    { label: "Administrative Staff", value: "staff" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Leasing Agent", value: "leasing" },
  ];

  const statusOptions: FilterOption[] = [
    { label: "All Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
  ];

  const fetchEmployees = (
    pagination: IPaginationQuery & {
      department?: string;
      role?: string;
      status?: "active" | "inactive" | "pending";
      search?: string;
    }
  ) => {
    const employeeQuery: IEmployeeFilterParams = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy as "name" | "department" | "role" | "startDate",
      sortOrder: pagination.sort as "asc" | "desc",
      ...(pagination?.search && { search: pagination.search }),
      ...(pagination?.department && { department: pagination.department }),
      ...(pagination?.role && { role: pagination.role }),
      ...(pagination?.status && { status: pagination.status }),
    };

    return employeeService.getEmployees(cuid, employeeQuery);
  };

  const tableData = useTableData({
    queryKeys: [`/employees/${cuid}`, cuid],
    fetchFn: fetchEmployees,
    paginationConfig: {
      initialLimit: 10,
    },
  });

  return {
    sortOptions,
    departmentOptions,
    roleOptions,
    statusOptions,
    pagination: tableData?.pagination || {},
    employees: tableData.data?.data?.users || [],
    handleSortChange: tableData.handleSortChange,
    handlePageChange: tableData.handlePageChange,
    handleSortByChange: tableData.handleSortByChange,
    totalCount: tableData.data?.data?.pagination?.total || 0,
    isLoading: tableData.isLoading,
    error: tableData.error,
    refetch: tableData.refetch,
  };
};