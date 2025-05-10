import { ReactElement, ReactNode } from "react";
import { AuthProvider } from "@components/AuthProvider";
import { EventProvider } from "@components/EventProvider";
import { RenderOptions, render } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    route: "/",
    query: {},
  }),
  usePathname: () => "/",
  useParams: () => ({}),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    toString: jest.fn(),
    size: 0,
  }),
}));

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
  withAuth?: boolean;
  withEvents?: boolean;
}

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of the default render from @testing-library/react
 */
function customRender(
  ui: ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    withAuth = true,
    withEvents = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function AllTheProviders({ children }: { children: ReactNode }) {
    let wrappedChildren = children;

    // Wrap with providers based on options
    if (withEvents) {
      wrappedChildren = <EventProvider>{wrappedChildren}</EventProvider>;
    }

    if (withAuth) {
      wrappedChildren = <AuthProvider>{wrappedChildren}</AuthProvider>;
    }

    return (
      <QueryClientProvider client={queryClient}>
        {wrappedChildren}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override render method
export { customRender as render };
