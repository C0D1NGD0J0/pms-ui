import React from "react";
import { render, screen } from "@tests/utils/test-utils";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import StaffPage from "@app/(protectedRoutes)/users/[cuid]/staff/page";
import { useGetEmployees } from "@app/(protectedRoutes)/users/[cuid]/staff/hooks";

jest.mock("@app/(protectedRoutes)/users/[cuid]/staff/hooks");
jest.mock("@app/(protectedRoutes)/users/shared-hooks");
jest.mock("@hooks/useUnifiedPermissions");
jest.mock("@services/invite");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the permission HOC to bypass the use() call
jest.mock("@hooks/permissionHOCs", () => ({
  withManagerAccess: (Component: any) => Component,
  withOwnerAccess: (Component: any) => Component,
  withAdminAccess: (Component: any) => Component,
  withClientAccess: (Component: any) => Component,
}));

const mockUseGetEmployees = useGetEmployees as jest.MockedFunction<
  typeof useGetEmployees
>;
const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<
  typeof useUnifiedPermissions
>;

describe("StaffPage", () => {
  const mockEmployees = [
    {
      uid: "emp-1",
      displayName: "John Doe",
      email: "john@example.com",
      role: "staff",
      employeeInfo: { department: "IT", position: "Developer" },
    },
    {
      uid: "emp-2",
      displayName: "Jane Smith",
      email: "jane@example.com",
      role: "manager",
      employeeInfo: { department: "HR", position: "HR Manager" },
    },
  ];

  beforeEach(() => {
    mockUseGetEmployees.mockReturnValue({
      employees: mockEmployees,
      sortOptions: [{ label: "All", value: "all" }],
      pagination: { page: 1, limit: 10, sort: "asc" },
      totalCount: 2,
      handleSortChange: jest.fn(),
      handlePageChange: jest.fn(),
      handleSortByChange: jest.fn(),
      isLoading: false,
    } as any);

    mockUseUnifiedPermissions.mockReturnValue({
      isManagerOrAbove: true,
      isOwner: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render staff management page", async () => {
    render(<StaffPage params={Promise.resolve({ cuid: "client-123" })} />, {
      withSuspense: true,
    });

    expect(await screen.findByText("Employee Management")).toBeInTheDocument();
  });

  it("should display add new employee button", async () => {
    render(<StaffPage params={Promise.resolve({ cuid: "client-123" })} />, {
      withSuspense: true,
    });

    expect(await screen.findByText("Add new employee")).toBeInTheDocument();
  });

  it("should display employee list", async () => {
    render(<StaffPage params={Promise.resolve({ cuid: "client-123" })} />, {
      withSuspense: true,
    });

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
  });

  it("should display department distribution chart section", async () => {
    render(<StaffPage params={Promise.resolve({ cuid: "client-123" })} />, {
      withSuspense: true,
    });

    expect(
      await screen.findByText("Employee Department Distribution")
    ).toBeInTheDocument();
  });

  it("should handle empty employee list", async () => {
    mockUseGetEmployees.mockReturnValue({
      employees: [],
      sortOptions: [],
      pagination: { page: 1, limit: 10, sort: "asc" },
      totalCount: 0,
      handleSortChange: jest.fn(),
      handlePageChange: jest.fn(),
      handleSortByChange: jest.fn(),
      isLoading: false,
    } as any);

    render(<StaffPage params={Promise.resolve({ cuid: "client-123" })} />, {
      withSuspense: true,
    });

    expect(await screen.findByText("Employee Management")).toBeInTheDocument();
  });

  it("should call useGetEmployees with correct client ID", async () => {
    render(<StaffPage params={Promise.resolve({ cuid: "client-456" })} />, {
      withSuspense: true,
    });

    await screen.findByText("Employee Management");
    expect(mockUseGetEmployees).toHaveBeenCalledWith("client-456");
  });
});
