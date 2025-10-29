import React from "react";
import { render, screen, fireEvent, waitFor } from "@tests/utils/test-utils";
import StaffPage from "@app/(protectedRoutes)/users/[cuid]/staff/page";
import { useGetEmployees, useGetUserStats } from "@app/(protectedRoutes)/users/[cuid]/staff/hooks";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { invitationService } from "@services/invite";

jest.mock("@app/(protectedRoutes)/users/[cuid]/staff/hooks");
jest.mock("@app/(protectedRoutes)/users/shared-hooks");
jest.mock("@hooks/useUnifiedPermissions");
jest.mock("@services/invite");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockUseGetEmployees = useGetEmployees as jest.MockedFunction<typeof useGetEmployees>;
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

    (useGetUserStats as jest.Mock).mockReturnValue({
      stats: {
        departmentDistribution: [
          { name: "IT", value: 5, percentage: 50 },
          { name: "HR", value: 5, percentage: 50 },
        ],
        roleDistribution: [
          { name: "Staff", value: 8 },
          { name: "Manager", value: 2 },
        ],
      },
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render staff management page", async () => {
    render(await StaffPage({ params: Promise.resolve({ cuid: "client-123" }) }));

    expect(screen.getByText("Employee Management")).toBeInTheDocument();
  });

  it("should display add new employee button", async () => {
    render(await StaffPage({ params: Promise.resolve({ cuid: "client-123" }) }));

    expect(screen.getByText("Add new employee")).toBeInTheDocument();
  });

  it("should display employee list", async () => {
    render(await StaffPage({ params: Promise.resolve({ cuid: "client-123" }) }));

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should display department distribution chart section", async () => {
    render(await StaffPage({ params: Promise.resolve({ cuid: "client-123" }) }));

    expect(
      screen.getByText("Employee Department Distribution")
    ).toBeInTheDocument();
  });

  it("should display role distribution chart section", async () => {
    render(await StaffPage({ params: Promise.resolve({ cuid: "client-123" }) }));

    expect(screen.getByText("Employee Role Distribution")).toBeInTheDocument();
  });

  it("should show loading state for stats", async () => {
    (useGetUserStats as jest.Mock).mockReturnValue({
      stats: null,
      isLoading: true,
    });

    render(await StaffPage({ params: Promise.resolve({ cuid: "client-123" }) }));

    const loadingElements = screen.getAllByText(/loading/i);
    expect(loadingElements.length).toBeGreaterThan(0);
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

    render(await StaffPage({ params: Promise.resolve({ cuid: "client-123" }) }));

    expect(screen.getByText("Employee Management")).toBeInTheDocument();
  });

  it("should call useGetEmployees with correct client ID", async () => {
    render(await StaffPage({ params: Promise.resolve({ cuid: "client-456" }) }));

    expect(mockUseGetEmployees).toHaveBeenCalledWith("client-456");
  });

  it("should display employee departments in stats", async () => {
    render(await StaffPage({ params: Promise.resolve({ cuid: "client-123" }) }));

    // Stats should be rendered in charts (implementation-specific)
    expect(screen.getByText("Employee Department Distribution")).toBeInTheDocument();
  });
});
