import * as themeHook from "@theme/index";
import * as authStore from "@store/auth.store";
import * as menuHook from "@hooks/useMenuItems";
import { render } from "@tests/utils/test-utils";
import { Sidebar } from "@components/Layouts/Sidebar";
import { fireEvent, waitFor, screen } from "@testing-library/react";

// Mock dependencies
jest.mock("@store/auth.store");
jest.mock("@theme/index");
jest.mock("@hooks/useMenuItems");
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

const mockLogout = jest.fn();
const mockToggleTheme = jest.fn();

const mockMenuSections = [
  {
    type: "main",
    items: [
      { path: "/dashboard", icon: "bx bx-home", label: "Dashboard" },
      { path: "/properties", icon: "bx bx-building", label: "Properties" },
    ],
  },
  {
    type: "dropdown",
    title: "Users",
    icon: "bx bx-user",
    items: [
      { path: "/users/staff", icon: "bx bx-user", label: "Staff" },
      { path: "/users/tenants", icon: "bx bx-group", label: "Tenants" },
    ],
  },
  {
    type: "bottom",
    items: [{ path: "/settings", icon: "bx bx-cog", label: "Settings" }],
  },
];

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
    });

    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });
    (authStore.useAuthActions as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });
    (themeHook.useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    });
    (menuHook.useMenuItems as jest.Mock).mockReturnValue({
      menuSections: mockMenuSections,
      getResolvedPath: jest.fn((path) => path),
    });

    mockUsePathname.mockReturnValue("/dashboard");
  });

  it("renders sidebar with main menu items", () => {
    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
  });

  it("renders dropdown section", () => {
    render(<Sidebar />);

    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    render(<Sidebar />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("toggles sidebar collapse state", () => {
    const { container } = render(<Sidebar />);

    const sidebar = container.querySelector(".sidebar");
    const toggleButton = container.querySelector(".sidebar-toggle");

    expect(sidebar).not.toHaveClass("close");

    fireEvent.click(toggleButton!);
    expect(sidebar).toHaveClass("close");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "sidebarCollapsed",
      "true"
    );
  });

  it("loads collapsed state from localStorage", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue("true");

    const { container } = render(<Sidebar />);

    const sidebar = container.querySelector(".sidebar");
    expect(sidebar).toHaveClass("close");
  });

  it("toggles users dropdown", async () => {
    const { container } = render(<Sidebar />);

    const dropdownToggle = screen.getByText("Users");
    const dropdownContainer = container.querySelector(".sidebar__dropdown");

    expect(dropdownContainer).not.toHaveClass("open-dd");

    fireEvent.click(dropdownToggle);
    expect(dropdownContainer).toHaveClass("open-dd");

    // Should show dropdown items
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Tenants")).toBeInTheDocument();
  });

  it("expands sidebar when dropdown is toggled while collapsed", async () => {
    // Start with collapsed sidebar
    (localStorage.getItem as jest.Mock).mockReturnValue("true");

    const { container } = render(<Sidebar />);

    const dropdownToggle = screen.getByText("Users");
    fireEvent.click(dropdownToggle);

    // Should expand sidebar and open dropdown after timeout
    await waitFor(
      () => {
        const sidebar = container.querySelector(".sidebar");
        expect(sidebar).not.toHaveClass("close");
      },
      { timeout: 200 }
    );
  });

  it("renders navigation menu items", () => {
    const { container } = render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", () => {
    render(<Sidebar />);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("toggles theme when theme toggle is clicked", () => {
    render(<Sidebar />);

    const themeToggle = screen.getByRole("checkbox");
    fireEvent.click(themeToggle);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("shows correct theme icons based on current theme", () => {
    const { rerender, container } = render(<Sidebar />);

    // Light theme - moon visible, sun hidden
    let moonIcon = container.querySelector(".bx-moon");
    let sunIcon = container.querySelector(".bx-sun");
    expect(moonIcon).not.toHaveClass("hidden");
    expect(sunIcon).toHaveClass("hidden");

    // Switch to dark theme
    (themeHook.useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      toggleTheme: mockToggleTheme,
    });

    rerender(<Sidebar />);

    moonIcon = container.querySelector(".bx-moon");
    sunIcon = container.querySelector(".bx-sun");
    expect(moonIcon).toHaveClass("hidden");
    expect(sunIcon).not.toHaveClass("hidden");
  });

  it("toggles users dropdown", () => {
    const { container } = render(<Sidebar />);

    // Open dropdown
    const dropdownToggle = screen.getByText("Users");
    fireEvent.click(dropdownToggle);
    expect(container.querySelector(".sidebar__dropdown")).toHaveClass(
      "open-dd"
    );

    // Close dropdown
    fireEvent.click(dropdownToggle);
    expect(container.querySelector(".sidebar__dropdown")).not.toHaveClass(
      "open-dd"
    );
  });

  it("handles logout link click", () => {
    render(<Sidebar />);

    const logoutLink = screen.getByText("Logout").closest("a");
    
    expect(logoutLink).toHaveAttribute("href", "#");
    fireEvent.click(logoutLink!);
    // Just verify the link is clickable and rendered correctly
  });

  it("renders bottom menu items", () => {
    render(<Sidebar />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("shows correct chevron icon in toggle button", () => {
    const { container } = render(<Sidebar />);

    let chevronIcon = container.querySelector(".sidebar-toggle i");
    expect(chevronIcon).toHaveClass("bx-chevron-left");

    // Collapse sidebar
    fireEvent.click(container.querySelector(".sidebar-toggle")!);

    chevronIcon = container.querySelector(".sidebar-toggle i");
    expect(chevronIcon).toHaveClass("bx-chevron-right");
  });

  it("has correct accessibility attributes", () => {
    render(<Sidebar />);

    const themeToggle = screen.getByRole("checkbox");
    expect(themeToggle).toHaveAttribute("id", "theme-toggle");
    expect(themeToggle).toHaveClass("toggle-checkbox");
  });
});
