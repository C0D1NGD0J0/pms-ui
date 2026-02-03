import React from "react";
import "@testing-library/jest-dom";
import { useSearchParams } from "next/navigation";
import { useScrollToTop } from "@hooks/useScrollToTop";
import { TabContainer, TabList } from "@components/Tab";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@hooks/useScrollToTop", () => ({
  useScrollToTop: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockUseScrollToTop = useScrollToTop as jest.MockedFunction<
  typeof useScrollToTop
>;

describe("Tab Components", () => {
  const mockScrollToTop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn(() => null),
    } as any);
    mockUseScrollToTop.mockReturnValue({
      scrollToTop: mockScrollToTop,
    } as any);
  });

  describe("TabContainer", () => {
    it("should render tab container with tab items", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 2")).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("should set first tab as active by default", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      const tab1 = screen.getByRole("tab", { name: /tab 1/i });
      expect(tab1).toHaveAttribute("aria-selected", "true");
      expect(tab1).toHaveClass("active");
    });

    it("should set default tab as active when provided", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} defaultTab="tab2" />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      expect(tab2).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should switch tabs when tab is clicked", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      // Initially tab1 is active
      expect(screen.getByText("Content 1")).toBeInTheDocument();

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      fireEvent.click(tab2);

      expect(tab2).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content 2")).toBeInTheDocument();
      // Content 1 should not be in the document when tab2 is active
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

    it("should call onChange when tab changes", () => {
      const onChange = jest.fn();
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} onChange={onChange} />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      fireEvent.click(tab2);

      expect(onChange).toHaveBeenCalledWith("tab2");
    });

    it("should save active tab to localStorage", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} onChange={jest.fn()} />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      fireEvent.click(tab2);

      const storedValue = localStorage.getItem("pms:activeTab");
      expect(storedValue).toBeTruthy();
      const parsed = JSON.parse(storedValue!);
      expect(parsed.value).toBe("tab2");
    });

    it("should scroll to top when tab changes by default", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      fireEvent.click(tab2);

      expect(mockScrollToTop).toHaveBeenCalled();
    });

    it("should not scroll to top when scrollOnChange is false", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} scrollOnChange={false} />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      fireEvent.click(tab2);

      expect(mockScrollToTop).not.toHaveBeenCalled();
    });

    it("should filter out hidden tabs", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        {
          id: "tab2",
          label: "Tab 2",
          content: <div>Content 2</div>,
          isHidden: true,
        },
        { id: "tab3", label: "Tab 3", content: <div>Content 3</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.queryByText("Tab 2")).not.toBeInTheDocument();
      expect(screen.getByText("Tab 3")).toBeInTheDocument();
    });

    it("should handle disabled tabs", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        {
          id: "tab2",
          label: "Tab 2",
          content: <div>Content 2</div>,
          disabled: true,
        },
      ];

      render(<TabContainer tabItems={tabItems} />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      expect(tab2).toHaveAttribute("aria-disabled", "true");
      expect(tab2).toHaveClass("disabled");

      fireEvent.click(tab2);
      expect(tab2).toHaveAttribute("aria-selected", "false");
    });

    it("should show error indicator on tabs with errors", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        {
          id: "tab2",
          label: "Tab 2",
          content: <div>Content 2</div>,
          hasError: true,
        },
      ];

      render(<TabContainer tabItems={tabItems} />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      expect(tab2).toHaveClass("has-error");
      expect(screen.getByLabelText("This tab has errors")).toBeInTheDocument();
    });

    it("should render tab icons when provided", () => {
      const tabItems = [
        {
          id: "tab1",
          label: "Tab 1",
          content: <div>Content 1</div>,
          icon: <i className="bx bx-home" />,
        },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      const iconElement = document.querySelector(".bx-home");
      expect(iconElement).toBeInTheDocument();
    });

    it("should restore active tab from localStorage in edit mode", () => {
      localStorage.setItem("activeTab", "tab2");

      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} mode="edit" />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      expect(tab2).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should restore active tab from URL params in edit mode", () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((param) => (param === "activeTab" ? "tab2" : null)),
      } as any);

      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} mode="edit" />);

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      expect(tab2).toHaveAttribute("aria-selected", "true");
    });

    it("should apply custom className", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
      ];

      render(<TabContainer tabItems={tabItems} className="custom-tabs" />);

      const container = screen.getByRole("tablist");
      expect(container).toHaveClass("custom-tabs");
    });

    it("should apply variant class", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
      ];

      render(<TabContainer tabItems={tabItems} variant="profile" />);

      const container = screen.getByRole("tablist");
      expect(container).toHaveClass("tabs-container-profile");
    });

    it("should set aria-label on tablist", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
      ];

      render(<TabContainer tabItems={tabItems} ariaLabel="Custom Tab Label" />);

      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveAttribute("aria-label", "Custom Tab Label");
    });

    it("should handle legacy children pattern", () => {
      render(
        <TabContainer>
          <div>Legacy Content</div>
        </TabContainer>
      );

      expect(screen.getByText("Legacy Content")).toBeInTheDocument();
    });
  });

  describe("TabList", () => {
    it("should render tab list with settings variant by default", () => {
      render(
        <TabList>
          <li>Tab 1</li>
          <li>Tab 2</li>
        </TabList>
      );

      const list = screen.getByRole("list");
      expect(list).toHaveClass("settings-tabs");
    });

    it("should render tab list with profile variant", () => {
      render(
        <TabList variant="profile">
          <li>Tab 1</li>
          <li>Tab 2</li>
        </TabList>
      );

      const list = screen.getByRole("list");
      expect(list).toHaveClass("profile-tabs");
    });

    it("should apply custom className", () => {
      render(
        <TabList className="custom-list">
          <li>Tab 1</li>
        </TabList>
      );

      const list = screen.getByRole("list");
      expect(list).toHaveClass("custom-list");
    });
  });

  describe("TabPanelContent", () => {
    it("should render active panel content", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      const panel = screen.getByRole("tabpanel");
      expect(panel).toHaveAttribute("id", "tab1-tab");
      expect(panel).toHaveAttribute("aria-labelledby", "tab-tab1");
      expect(panel).not.toHaveAttribute("hidden");
    });

    it("should hide inactive panel content", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      // Tab1 is active by default, so Content 2 should not be rendered
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });
  });

  describe("TabListItem", () => {
    it("should handle keyboard navigation", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
        { id: "tab2", label: "Tab 2", content: <div>Content 2</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      const tab1 = screen.getByRole("tab", { name: /tab 1/i });
      const tab2 = screen.getByRole("tab", { name: /tab 2/i });

      expect(tab1).toHaveAttribute("tabIndex", "0");
      expect(tab2).toHaveAttribute("tabIndex", "-1");

      fireEvent.click(tab2);

      expect(tab2).toHaveAttribute("tabIndex", "0");
      expect(tab1).toHaveAttribute("tabIndex", "-1");
    });

    it("should have correct ARIA attributes", () => {
      const tabItems = [
        { id: "tab1", label: "Tab 1", content: <div>Content 1</div> },
      ];

      render(<TabContainer tabItems={tabItems} />);

      const tab = screen.getByRole("tab", { name: /tab 1/i });
      expect(tab).toHaveAttribute("id", "tab-tab1");
      expect(tab).toHaveAttribute("aria-controls", "tab1-tab");
      expect(tab).toHaveAttribute("data-tab", "tab1");
    });
  });
});
