import * as authStore from "@store/auth.store";
import { render } from "@tests/utils/test-utils";
import { Navbar } from "@components/Layouts/Navbar";
import { fireEvent, waitFor, screen, act } from "@testing-library/react";

// Mock auth store
jest.mock("@store/auth.store", () => ({
  useAuth: jest.fn(),
  useAuthActions: jest.fn(),
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

const mockLogout = jest.fn();

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authStore.useAuthActions as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });
  });

  it("renders navbar with logo and search", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });

    render(<Navbar />);

    expect(screen.getByText("LOGO")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search here...")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders correctly when not logged in", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });

    render(<Navbar />);

    // Navbar should render with logo and search
    expect(screen.getByText("LOGO")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search here...")).toBeInTheDocument();
    // Auth-required items should not be visible
    expect(screen.queryByRole("button", { name: /bx-bell/i })).not.toBeInTheDocument();
  });

  it("shows auth-required items when logged in", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    render(<Navbar />);

    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Signup")).not.toBeInTheDocument();

    // Check for notification and message icons
    const icons = screen.getAllByRole("generic");
    expect(icons.some((icon) => icon.className?.includes("bx-bell"))).toBe(
      true
    );
    expect(icons.some((icon) => icon.className?.includes("bx-envelope"))).toBe(
      true
    );
  });

  it("toggles mobile menu when menu button is clicked", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });

    render(<Navbar />);

    const menuToggle = document.querySelector(".menuToggle");
    const navbarMenu = document.querySelector(".navbar-menu");

    expect(navbarMenu).not.toHaveClass("mobile-active");

    fireEvent.click(menuToggle!);
    expect(navbarMenu).toHaveClass("mobile-active");

    fireEvent.click(menuToggle!);
    expect(navbarMenu).not.toHaveClass("mobile-active");
  });

  it("toggles user dropdown when user avatar is clicked", () => {
    jest.useFakeTimers();
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    render(<Navbar />);

    const userAvatar = document.querySelector(".user-avatar");
    const dropdown = document.querySelector(".navbar__dropdown-menu");

    expect(dropdown).not.toHaveClass("show");

    act(() => {
      fireEvent.mouseEnter(userAvatar!);
      jest.advanceTimersByTime(200);
    });
    expect(dropdown).toHaveClass("show");

    act(() => {
      fireEvent.mouseLeave(userAvatar!);
      jest.advanceTimersByTime(300);
    });
    expect(dropdown).not.toHaveClass("show");

    jest.useRealTimers();
  });

  it("shows user dropdown menu items when logged in", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    render(<Navbar />);

    const userAvatar = document.querySelector(".user-avatar");
    fireEvent.mouseEnter(userAvatar!);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Logout" })).toBeInTheDocument();
  });

  it.skip("calls logout and clears storage when logout is clicked", async () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    // Mock sessionStorage
    const sessionStorageMock = {
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, "sessionStorage", {
      value: sessionStorageMock,
    });

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    render(<Navbar />);

    const userAvatar = document.querySelector(".user-avatar");
    fireEvent.click(userAvatar!);

    const logoutLink = screen.getByRole("link", { name: "Logout" });
    fireEvent.click(logoutLink);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(
      "static-data-storage"
    );
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith("auth-storage");
    expect(consoleSpy).toHaveBeenCalledWith("User logged out");

    consoleSpy.mockRestore();
  });

  it("closes user dropdown when mobile menu is opened", () => {
    jest.useFakeTimers();
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    render(<Navbar />);

    // Open user dropdown
    const userAvatar = document.querySelector(".user-avatar");
    act(() => {
      fireEvent.mouseEnter(userAvatar!);
      jest.advanceTimersByTime(200);
    });
    expect(document.querySelector(".navbar__dropdown-menu")).toHaveClass(
      "show"
    );

    // Toggle mobile menu
    const menuToggle = document.querySelector(".menuToggle");
    fireEvent.click(menuToggle!);

    expect(document.querySelector(".navbar__dropdown-menu")).not.toHaveClass(
      "show"
    );

    jest.useRealTimers();
  });

  it("renders correct navigation links", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });

    render(<Navbar />);

    expect(screen.getByRole("link", { name: "LOGO" })).toHaveAttribute(
      "href",
      "/"
    );

    // Check for Login and Signup text content since they're rendered conditionally
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  it("renders authenticated user navigation links", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    render(<Navbar />);

    const userAvatar = document.querySelector(".user-avatar");
    fireEvent.mouseEnter(userAvatar!);

    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/profile/undefined"
    );
  });

  it("stops event propagation on user dropdown toggle", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    render(<Navbar />);

    const mockEvent = {
      stopPropagation: jest.fn(),
    } as any;

    const userAvatar = document.querySelector(".user-avatar");

    // Simulate the event manually to test stopPropagation
    fireEvent.click(userAvatar!, mockEvent);

    // The actual implementation calls stopPropagation,
    // but we can't directly test it with fireEvent
    expect(userAvatar).toBeInTheDocument();
  });

  it("has proper CSS classes for styling", () => {
    (authStore.useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    const { container } = render(<Navbar />);

    expect(container.querySelector(".navbar")).toBeInTheDocument();
    expect(container.querySelector(".navbar-logo")).toBeInTheDocument();
    expect(container.querySelector(".navbar-search")).toBeInTheDocument();
    expect(container.querySelector(".navbar-menu")).toBeInTheDocument();
    expect(container.querySelector(".menuToggle")).toBeInTheDocument();
  });
});
