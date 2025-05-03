import { useCallback, RefObject } from "react";

interface ScrollOptions {
  behavior?: ScrollBehavior;
  offset?: number;
}

export function useScrollToTop<T extends HTMLElement = HTMLDivElement>() {
  const scrollToTop = useCallback(
    (ref: RefObject<T | null> | null, options: ScrollOptions = {}) => {
      const { behavior = "smooth", offset = 0 } = options;

      if (ref && ref.current) {
        ref.current.scrollTo({
          top: offset,
          behavior,
        });
      } else {
        window.scrollTo({
          top: offset,
          behavior,
        });
      }
    },
    []
  );

  return { scrollToTop };
}
