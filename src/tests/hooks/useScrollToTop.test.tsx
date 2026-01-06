import { RefObject } from "react";
import { useScrollToTop } from "@hooks/useScrollToTop";
import { renderHook, act } from "@testing-library/react";

describe("useScrollToTop", () => {
  let mockScrollTo: jest.Mock;
  let mockElementScrollTo: jest.Mock;

  beforeEach(() => {
    mockScrollTo = jest.fn();
    mockElementScrollTo = jest.fn();
    Object.defineProperty(window, "scrollTo", {
      value: mockScrollTo,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return scrollToTop function", () => {
    const { result } = renderHook(() => useScrollToTop());
    expect(typeof result.current.scrollToTop).toBe("function");
  });

  it("should scroll window to top with default options when ref is null", () => {
    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      result.current.scrollToTop(null);
    });

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should scroll window to top with custom options when ref is null", () => {
    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      result.current.scrollToTop(null, { behavior: "auto", offset: 100 });
    });

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 100,
      behavior: "auto",
    });
  });

  it("should scroll element to top when ref is provided", () => {
    const mockElement = {
      scrollTo: mockElementScrollTo,
    } as any;
    const mockRef: RefObject<HTMLDivElement> = { current: mockElement };

    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      result.current.scrollToTop(mockRef);
    });

    expect(mockElementScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should scroll element with custom options when ref is provided", () => {
    const mockElement = {
      scrollTo: mockElementScrollTo,
    } as any;
    const mockRef: RefObject<HTMLDivElement> = { current: mockElement };

    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      result.current.scrollToTop(mockRef, { behavior: "auto", offset: 50 });
    });

    expect(mockElementScrollTo).toHaveBeenCalledWith({
      top: 50,
      behavior: "auto",
    });
  });

  it("should fallback to window scroll when ref.current is null", () => {
    const mockRef: RefObject<HTMLDivElement> = { current: null };

    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      result.current.scrollToTop(mockRef);
    });

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should handle different scroll behaviors", () => {
    const { result } = renderHook(() => useScrollToTop());

    const behaviors: ScrollBehavior[] = ["auto", "smooth", "instant"];

    behaviors.forEach((behavior) => {
      act(() => {
        result.current.scrollToTop(null, { behavior });
      });

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior,
      });
    });
  });

  it("should handle different offset values", () => {
    const { result } = renderHook(() => useScrollToTop());

    const offsets = [0, 10, 100, -50];

    offsets.forEach((offset) => {
      act(() => {
        result.current.scrollToTop(null, { offset });
      });

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: offset,
        behavior: "smooth",
      });
    });
  });

  it("should maintain stable reference for scrollToTop function", () => {
    const { result, rerender } = renderHook(() => useScrollToTop());
    const firstReference = result.current.scrollToTop;

    rerender();
    const secondReference = result.current.scrollToTop;

    expect(firstReference).toBe(secondReference);
  });

  it("should work with different element types", () => {
    const mockDiv = { scrollTo: jest.fn() } as any;
    const mockSection = { scrollTo: jest.fn() } as any;

    const divRef: RefObject<HTMLDivElement> = { current: mockDiv };
    const sectionRef: RefObject<HTMLElement> = { current: mockSection };

    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      result.current.scrollToTop(divRef);
      result.current.scrollToTop(sectionRef);
    });

    expect(mockDiv.scrollTo).toHaveBeenCalled();
    expect(mockSection.scrollTo).toHaveBeenCalled();
  });
});
