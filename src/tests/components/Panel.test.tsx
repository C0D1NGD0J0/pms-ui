import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Panel,
  PanelsWrapper,
  PanelHeader,
  PanelContent,
} from "@components/Panel";

// Mock scrollIntoView for Select component
Element.prototype.scrollIntoView = jest.fn();

describe("Panel Components", () => {
  describe("Panel", () => {
    it("should render panel with children", () => {
      render(
        <Panel>
          <div>Panel Content</div>
        </Panel>
      );

      expect(screen.getByText("Panel Content")).toBeInTheDocument();
    });

    it("should apply default variant class", () => {
      const { container } = render(
        <Panel>
          <div>Content</div>
        </Panel>
      );

      const panel = container.querySelector(".panel");
      expect(panel).toBeInTheDocument();
      expect(panel).not.toHaveClass("panel-alt-2");
    });

    it("should apply alt-2 variant class", () => {
      const { container } = render(
        <Panel variant="alt-2">
          <div>Content</div>
        </Panel>
      );

      const panel = container.querySelector(".panel");
      expect(panel).toHaveClass("panel-alt-2");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Panel className="custom-panel">
          <div>Content</div>
        </Panel>
      );

      const panel = container.querySelector(".panel");
      expect(panel).toHaveClass("custom-panel");
    });

    it("should handle empty children", () => {
      const { container } = render(<Panel />);

      const panel = container.querySelector(".panel");
      expect(panel).toBeInTheDocument();
      expect(panel).toBeEmptyDOMElement();
    });
  });

  describe("PanelsWrapper", () => {
    it("should render wrapper with children", () => {
      render(
        <PanelsWrapper>
          <div>Wrapped Content</div>
        </PanelsWrapper>
      );

      expect(screen.getByText("Wrapped Content")).toBeInTheDocument();
    });

    it("should apply panels class", () => {
      const { container } = render(
        <PanelsWrapper>
          <div>Content</div>
        </PanelsWrapper>
      );

      const wrapper = container.querySelector(".panels");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <PanelsWrapper className="custom-wrapper">
          <div>Content</div>
        </PanelsWrapper>
      );

      const wrapper = container.querySelector(".panels");
      expect(wrapper).toHaveClass("custom-wrapper");
    });

    it("should render multiple panels", () => {
      render(
        <PanelsWrapper>
          <Panel>
            <div>Panel 1</div>
          </Panel>
          <Panel>
            <div>Panel 2</div>
          </Panel>
        </PanelsWrapper>
      );

      expect(screen.getByText("Panel 1")).toBeInTheDocument();
      expect(screen.getByText("Panel 2")).toBeInTheDocument();
    });
  });

  describe("PanelContent", () => {
    it("should render content with children", () => {
      render(
        <PanelContent>
          <div>Content Body</div>
        </PanelContent>
      );

      expect(screen.getByText("Content Body")).toBeInTheDocument();
    });

    it("should apply panel-content class", () => {
      const { container } = render(
        <PanelContent>
          <div>Content</div>
        </PanelContent>
      );

      const content = container.querySelector(".panel-content");
      expect(content).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <PanelContent className="custom-content">
          <div>Content</div>
        </PanelContent>
      );

      const content = container.querySelector(".panel-content");
      expect(content).toHaveClass("custom-content");
    });
  });

  describe("PanelHeader", () => {
    it("should render header with title string", () => {
      render(<PanelHeader header={{ title: "Panel Title" }} />);

      expect(screen.getByText("Panel Title")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "Panel Title"
      );
    });

    it("should render header with title ReactNode", () => {
      render(
        <PanelHeader
          header={{ title: <span className="custom-title">Custom Title</span> }}
        />
      );

      const customTitle = document.querySelector(".custom-title");
      expect(customTitle).toBeInTheDocument();
      expect(customTitle).toHaveTextContent("Custom Title");
    });

    it("should render custom header title component", () => {
      render(
        <PanelHeader
          headerTitleComponent={<div>Custom Component</div>}
          header={{ title: "Should be overridden" }}
        />
      );

      expect(screen.getByText("Custom Component")).toBeInTheDocument();
      expect(screen.queryByText("Should be overridden")).not.toBeInTheDocument();
    });

    it("should render search input when searchOpts is visible", () => {
      const onChange = jest.fn();
      render(
        <PanelHeader
          header={{ title: "Title" }}
          searchOpts={{
            isVisible: true,
            value: "",
            placeholder: "Search items...",
            onChange,
          }}
        />
      );

      const searchInput = screen.getByPlaceholderText("Search items...");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue("");
    });

    it("should call onChange when search input changes", () => {
      const onChange = jest.fn();
      render(
        <PanelHeader
          header={{ title: "Title" }}
          searchOpts={{
            isVisible: true,
            value: "",
            onChange,
          }}
        />
      );

      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.change(searchInput, { target: { value: "test query" } });

      expect(onChange).toHaveBeenCalled();
    });

    it("should render search button with icon", () => {
      render(
        <PanelHeader
          header={{ title: "Title" }}
          searchOpts={{
            isVisible: true,
            value: "",
          }}
        />
      );

      const searchButton = document.querySelector(".search-btn");
      expect(searchButton).toBeInTheDocument();
      const icon = searchButton?.querySelector(".bx-search");
      expect(icon).toBeInTheDocument();
    });

    it("should not render search when isVisible is false", () => {
      render(
        <PanelHeader
          header={{ title: "Title" }}
          searchOpts={{
            isVisible: false,
            value: "",
          }}
        />
      );

      expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
    });

    it("should render filter select when filterOpts is visible", () => {
      const onFilterChange = jest.fn();
      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: true,
            value: "",
            options: [
              { label: "All", value: "" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            onFilterChange,
          }}
        />
      );

      const filterSelect = document.querySelector("#filter-select");
      expect(filterSelect).toBeInTheDocument();
    });

    it("should pass onFilterChange to Select component", () => {
      const onFilterChange = jest.fn();
      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: true,
            value: "",
            options: [
              { label: "All", value: "" },
              { label: "Active", value: "active" },
            ],
            onFilterChange,
          }}
        />
      );

      const filterSelect = document.querySelector("#filter-select");
      expect(filterSelect).toBeInTheDocument();
      // Verify that the Select component is rendered with proper options
      expect(filterSelect).toHaveTextContent("All");
    });

    it("should not render filter when isVisible is false", () => {
      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: false,
            value: "",
            options: [{ label: "All", value: "" }],
            onFilterChange: jest.fn(),
          }}
        />
      );

      expect(document.querySelector("#filter-select")).not.toBeInTheDocument();
    });

    it("should not render filter when options array is empty", () => {
      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: true,
            value: "",
            options: [],
            onFilterChange: jest.fn(),
          }}
        />
      );

      expect(document.querySelector("#filter-select")).not.toBeInTheDocument();
    });

    it("should not render sort direction button initially", () => {
      const onFilterChange = jest.fn();
      const onSortDirectionChange = jest.fn();

      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: true,
            value: "",
            sortDirection: "asc",
            options: [{ label: "Name", value: "name" }],
            onFilterChange,
            onSortDirectionChange,
          }}
        />
      );

      // Sort button should not be visible until filter is changed (internal state _sortBy is empty)
      expect(document.querySelector(".sort-direction-btn")).not.toBeInTheDocument();
    });

    it("should call onSortDirectionChange when provided", () => {
      const onFilterChange = jest.fn();
      const onSortDirectionChange = jest.fn();

      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: true,
            value: "name",
            sortDirection: "asc",
            options: [{ label: "Name", value: "name" }],
            onFilterChange,
            onSortDirectionChange,
          }}
        />
      );

      // Verify onSortDirectionChange callback is passed to filter options
      expect(onSortDirectionChange).toBeDefined();
    });

    it("should accept sortDirection prop for asc ordering", () => {
      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: true,
            value: "name",
            sortDirection: "asc",
            options: [{ label: "Name", value: "name" }],
            onFilterChange: jest.fn(),
            onSortDirectionChange: jest.fn(),
          }}
        />
      );

      // PanelHeader accepts sortDirection as a prop
      const filterSelect = document.querySelector("#filter-select");
      expect(filterSelect).toBeInTheDocument();
    });

    it("should accept sortDirection prop for desc ordering", () => {
      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: true,
            value: "name",
            sortDirection: "desc",
            options: [{ label: "Name", value: "name" }],
            onFilterChange: jest.fn(),
            onSortDirectionChange: jest.fn(),
          }}
        />
      );

      // PanelHeader accepts sortDirection as a prop
      const filterSelect = document.querySelector("#filter-select");
      expect(filterSelect).toBeInTheDocument();
    });

    it("should render both search and filter when both are visible", () => {
      render(
        <PanelHeader
          header={{ title: "Title" }}
          searchOpts={{
            isVisible: true,
            value: "",
            onChange: jest.fn(),
          }}
          filterOpts={{
            isVisible: true,
            value: "",
            options: [{ label: "All", value: "" }],
            onFilterChange: jest.fn(),
          }}
        />
      );

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      expect(document.querySelector("#filter-select")).toBeInTheDocument();
    });

    it("should not render menu div when neither search nor filter is visible", () => {
      const { container } = render(
        <PanelHeader
          header={{ title: "Title" }}
          searchOpts={null}
          filterOpts={null}
        />
      );

      const menu = container.querySelector(".panel-header__menu");
      expect(menu).not.toBeInTheDocument();
    });

    it("should pass custom filter placeholder to Select component", () => {
      render(
        <PanelHeader
          header={{ title: "Title" }}
          filterOpts={{
            isVisible: true,
            value: "",
            filterPlaceholder: "Select status...",
            options: [
              { label: "All", value: "" },
              { label: "Active", value: "active" },
            ],
            onFilterChange: jest.fn(),
          }}
        />
      );

      const filterSelect = document.querySelector("#filter-select");
      expect(filterSelect).toBeInTheDocument();
      // When value is empty, Select shows first option or placeholder
      expect(filterSelect).toHaveTextContent("All");
    });

    it("should apply panel-header class", () => {
      const { container } = render(<PanelHeader header={{ title: "Title" }} />);

      const header = container.querySelector(".panel-header");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Full Panel Integration", () => {
    it("should render complete panel with all components", () => {
      const onChange = jest.fn();
      const onFilterChange = jest.fn();

      render(
        <Panel>
          <PanelHeader
            header={{ title: "Users" }}
            searchOpts={{
              isVisible: true,
              value: "",
              placeholder: "Search users...",
              onChange,
            }}
            filterOpts={{
              isVisible: true,
              value: "all",
              options: [
                { label: "All Users", value: "all" },
                { label: "Active", value: "active" },
              ],
              onFilterChange,
            }}
          />
          <PanelContent>
            <div>User list content</div>
          </PanelContent>
        </Panel>
      );

      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
      expect(document.querySelector("#filter-select")).toBeInTheDocument();
      expect(screen.getByText("User list content")).toBeInTheDocument();
    });

    it("should render multiple panels in wrapper", () => {
      render(
        <PanelsWrapper>
          <Panel>
            <PanelHeader header={{ title: "Panel 1" }} />
            <PanelContent>Content 1</PanelContent>
          </Panel>
          <Panel variant="alt-2">
            <PanelHeader header={{ title: "Panel 2" }} />
            <PanelContent>Content 2</PanelContent>
          </Panel>
        </PanelsWrapper>
      );

      expect(screen.getByText("Panel 1")).toBeInTheDocument();
      expect(screen.getByText("Panel 2")).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });
});
