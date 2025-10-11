import { useState, useMemo } from "react";
import { IPaginationQuery } from "@interfaces/utils.interface";
import { FilteredUserTableData } from "@interfaces/user.interface";
import {
  COMMON_STATUS_OPTIONS,
  COMMON_SORT_OPTIONS,
} from "@app/(protectedRoutes)/shared-hooks/constants";

export interface TenantQueryParams {
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

// Mock tenant data
const generateMockTenants = (): FilteredUserTableData[] => {
  const firstNames = [
    "James",
    "Sarah",
    "Michael",
    "Emily",
    "Robert",
    "Jennifer",
    "David",
    "Lisa",
    "William",
    "Jessica",
    "Richard",
    "Ashley",
    "Thomas",
    "Amanda",
    "Charles",
    "Melissa",
    "Daniel",
    "Nicole",
    "Matthew",
    "Kimberly",
    "Christopher",
    "Elizabeth",
    "Andrew",
    "Michelle",
    "Joshua",
    "Stephanie",
    "Kevin",
    "Laura",
    "Brian",
    "Rebecca",
    "Steven",
    "Rachel",
  ];

  const lastNames = [
    "Wilson",
    "Williams",
    "Chen",
    "Johnson",
    "Davis",
    "Lopez",
    "Kim",
    "Martinez",
    "Garcia",
    "Rodriguez",
    "Brown",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Moore",
    "Lee",
    "Walker",
    "Hall",
    "Allen",
    "Young",
    "King",
    "Wright",
    "Scott",
    "Green",
    "Baker",
    "Adams",
    "Nelson",
  ];

  const properties = [
    "Wellington Ave",
    "Central Park",
    "Broadway St",
    "Madison Ave",
    "Hudson St",
    "Thompson St",
    "Greene St",
    "Park Place",
    "Riverside Dr",
    "Fifth Ave",
  ];

  const leaseStatuses: Array<"active" | "pending_renewal" | "inactive"> = [
    "active",
    "active",
    "active",
    "active",
    "active",
    "active",
    "pending_renewal",
    "pending_renewal",
    "inactive",
    "active",
  ];

  const rentStatuses: Array<"current" | "overdue" | "pending"> = [
    "current",
    "current",
    "current",
    "current",
    "overdue",
    "current",
    "pending",
    "current",
    "current",
    "current",
  ];

  const tenants: FilteredUserTableData[] = [];

  for (let i = 0; i < 32; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const fullName = `${firstName} ${lastName}`;
    const leaseStart = new Date(2023, Math.floor(i / 4), 1 + (i % 28));
    const leaseDurationMonths = [6, 12, 12, 12, 18, 24][i % 6];
    const leaseEnd = new Date(leaseStart);
    leaseEnd.setMonth(leaseEnd.getMonth() + leaseDurationMonths);

    const isActive = leaseStatuses[i % leaseStatuses.length] !== "inactive";

    tenants.push({
      uid: `TEN-2023-${String(i + 1).padStart(4, "0")}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      displayName: fullName,
      fullName: fullName,
      phoneNumber: `(212) 555-${String(1000 + i).padStart(4, "0")}`,
      isActive: isActive,
      isConnected: isActive,
      tenantInfo: {
        unitNumber: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
        leaseStatus: leaseStatuses[i % leaseStatuses.length],
        rentStatus: rentStatuses[i % rentStatuses.length],
        propertyName: `${properties[i % properties.length]}, New York`,
        leaseStartDate: leaseStart.toISOString(),
        leaseEndDate: leaseEnd.toISOString(),
        monthlyRent: 1500 + Math.floor(i / 2) * 250,
      },
    });
  }

  return tenants;
};

export const useGetTenants = (
  cuid: string,
  initialParams?: TenantQueryParams
) => {
  const [queryParams, setQueryParams] = useState<TenantQueryParams>({
    status: initialParams?.status || "active",
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    sortBy: initialParams?.sortBy || "",
    sort: initialParams?.sort || "desc",
    search: initialParams?.search || "",
  });

  // Generate mock data
  const allTenants = useMemo(() => generateMockTenants(), []);

  // Filter and paginate data
  const { tenants, totalCount } = useMemo(() => {
    let filtered = [...allTenants];

    // Filter by status
    if (queryParams.status) {
      filtered = filtered.filter((tenant) => {
        if (queryParams.status === "active") {
          return tenant.isActive;
        } else if (queryParams.status === "inactive") {
          return !tenant.isActive;
        }
        return true;
      });
    }

    // Filter by search
    if (queryParams.search) {
      const searchLower = queryParams.search.toLowerCase();
      filtered = filtered.filter(
        (tenant) =>
          tenant.fullName?.toLowerCase().includes(searchLower) ||
          tenant.email.toLowerCase().includes(searchLower) ||
          tenant.tenantInfo?.unitNumber?.toLowerCase().includes(searchLower) ||
          tenant.tenantInfo?.propertyName?.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (queryParams.sortBy) {
      filtered.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (queryParams.sortBy) {
          case "fullName":
            aVal = a.fullName || "";
            bVal = b.fullName || "";
            break;
          case "email":
            aVal = a.email;
            bVal = b.email;
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return queryParams.sort === "asc" ? -1 : 1;
        if (aVal > bVal) return queryParams.sort === "asc" ? 1 : -1;
        return 0;
      });
    }

    const total = filtered.length;

    // Paginate
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return { tenants: paginated, totalCount: total };
  }, [allTenants, queryParams]);

  const updateQueryParams = (newParams: Partial<TenantQueryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const handleSortChange = (sort: "asc" | "desc") => {
    updateQueryParams({ sort });
  };

  const handleSortByChange = (sortBy: string) => {
    updateQueryParams({ sortBy });
  };

  const handleSearch = (search: string) => {
    updateQueryParams({ search, page: 1 });
  };

  const handleStatusFilter = (status: "active" | "inactive" | "") => {
    updateQueryParams({ status: status || undefined, page: 1 });
  };

  return {
    tenants,
    totalCount,

    // Loading states (mocked)
    isLoading: false,
    isError: false,
    error: null,

    // Backward compatibility pagination object
    pagination: {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy,
      sort: queryParams.sort,
    } as IPaginationQuery,

    // Handlers
    handlePageChange,
    handleSortChange,
    handleSortByChange,
    handleSearch,
    handleStatusFilter,

    // Filter options
    sortOptions: COMMON_SORT_OPTIONS,
    statusOptions: COMMON_STATUS_OPTIONS,

    // Query params
    queryParams,
  };
};
