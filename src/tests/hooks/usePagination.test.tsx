import { renderHook, act } from "@testing-library/react";
import { useTablePagination } from "@hooks/usePagination";

describe("useTablePagination", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useTablePagination());

    expect(result.current.pagination).toEqual({
      order: "asc",
      page: 1,
      limit: 10,
      sortBy: "",
    });
  });

  it("should initialize with custom config", () => {
    const config = {
      initialPage: 2,
      initialLimit: 20,
      initialSortBy: "name",
      initialOrder: "asc" as const,
    };

    const { result } = renderHook(() => useTablePagination(config));

    expect(result.current.pagination).toEqual({
      order: "asc",
      page: 2,
      limit: 20,
      sortBy: "name",
    });
  });

  it("should handle page changes", () => {
    const { result } = renderHook(() => useTablePagination());

    act(() => {
      result.current.handlePageChange(3);
    });

    expect(result.current.pagination.page).toBe(3);
  });

  it("should handle limit changes and calculate skip", () => {
    const { result } = renderHook(() => useTablePagination({ initialPage: 3 }));

    act(() => {
      result.current.handleLimitChange(25);
    });

    expect(result.current.pagination.limit).toBe(25);
    expect(result.current.pagination.skip).toBe(50); // (3-1) * 25
  });

  it("should handle sort direction changes when sortBy is set", () => {
    const { result } = renderHook(() =>
      useTablePagination({ initialSortBy: "name", initialOrder: "asc" })
    );

    act(() => {
      result.current.handleSortDirectionChange();
    });

    expect(result.current.pagination.order).toBe("desc");
  });

  it("should toggle sort direction", () => {
    const { result } = renderHook(() => useTablePagination());

    act(() => {
      result.current.handleSortDirectionChange();
    });

    expect(result.current.pagination.order).toBe("desc");
  });

  it("should handle sortBy changes and keep existing order", () => {
    const { result } = renderHook(() => useTablePagination());

    act(() => {
      result.current.handleSortByChange("name");
    });

    expect(result.current.pagination.sortBy).toBe("name");
    // Preserves the initial order ("asc")
    expect(result.current.pagination.order).toBe("asc");
  });

  it("should preserve existing order when changing sortBy", () => {
    const { result } = renderHook(() =>
      useTablePagination({ initialOrder: "asc" })
    );

    act(() => {
      result.current.handleSortByChange("name");
    });

    expect(result.current.pagination.sortBy).toBe("name");
    expect(result.current.pagination.order).toBe("asc");
  });

  it("should reset to asc order when sortBy is set to empty", () => {
    const { result } = renderHook(() =>
      useTablePagination({ initialSortBy: "name", initialOrder: "desc" })
    );

    act(() => {
      result.current.handleSortByChange("");
    });

    expect(result.current.pagination.sortBy).toBe("");
    expect(result.current.pagination.order).toBe("asc");
  });

  it("should maintain stable function references", () => {
    const { result, rerender } = renderHook(() => useTablePagination());

    const firstHandlers = {
      handlePageChange: result.current.handlePageChange,
      handleLimitChange: result.current.handleLimitChange,
      handleSortDirectionChange: result.current.handleSortDirectionChange,
      handleSortByChange: result.current.handleSortByChange,
      handleFilterChange: result.current.handleFilterChange,
    };

    rerender();

    const secondHandlers = {
      handlePageChange: result.current.handlePageChange,
      handleLimitChange: result.current.handleLimitChange,
      handleSortDirectionChange: result.current.handleSortDirectionChange,
      handleSortByChange: result.current.handleSortByChange,
      handleFilterChange: result.current.handleFilterChange,
    };

    expect(firstHandlers.handlePageChange).toBe(
      secondHandlers.handlePageChange
    );
    expect(firstHandlers.handleLimitChange).toBe(
      secondHandlers.handleLimitChange
    );
    expect(firstHandlers.handleSortByChange).toBe(
      secondHandlers.handleSortByChange
    );
    expect(firstHandlers.handleSortDirectionChange).toBe(
      secondHandlers.handleSortDirectionChange
    );
    expect(firstHandlers.handleFilterChange).toBe(
      secondHandlers.handleFilterChange
    );
  });

  it("should handle multiple consecutive changes", () => {
    const { result } = renderHook(() => useTablePagination());

    act(() => {
      result.current.handlePageChange(2);
      result.current.handleLimitChange(20);
      result.current.handleSortByChange("name");
    });

    expect(result.current.pagination).toEqual({
      page: 2,
      limit: 20,
      sortBy: "name",
      order: "asc", // Preserves initial order
      skip: 20,
    });
  });

  it("should calculate skip correctly for different page and limit combinations", () => {
    const { result } = renderHook(() => useTablePagination());

    const testCases = [
      { page: 1, limit: 10, expectedSkip: 0 },
      { page: 2, limit: 10, expectedSkip: 10 },
      { page: 3, limit: 25, expectedSkip: 50 },
      { page: 5, limit: 5, expectedSkip: 20 },
    ];

    testCases.forEach(({ page, limit, expectedSkip }) => {
      act(() => {
        result.current.handlePageChange(page);
        result.current.handleLimitChange(limit);
      });

      expect(result.current.pagination.skip).toBe(expectedSkip);
    });
  });

  it("should handle edge cases for page values", () => {
    const { result } = renderHook(() => useTablePagination());

    act(() => {
      result.current.handlePageChange(0);
    });
    expect(result.current.pagination.page).toBe(0);

    act(() => {
      result.current.handlePageChange(-1);
    });
    expect(result.current.pagination.page).toBe(-1);
  });
});
