# Testing Approach & Recommendations

## Current Setup (axios-mock-adapter)

### ✅ What We're Using
- **axios-mock-adapter** for HTTP-level mocking in Jest tests
- Mocks at the axios instance level (before requests leave the app)
- Works perfectly with Jest (no ESM issues)

### ✅ Benefits
1. **Zero Configuration Issues** - Works immediately with Jest
2. **HTTP-Level Mocking** - Better than mocking entire services
3. **Real Request Flow** - Tests actual axios interceptors, serialization, error handling
4. **Easy to Use** - Simple API, chainable methods
5. **Fast Tests** - No network overhead, synchronous mocking

### Example
```typescript
const mock = new MockAdapter(axiosService.getInstance());
mock.onPost("/api/v1/subscriptions/:cuid/seats").reply(200, {
  data: { success: true, data: {...} }
});
```

---

## MSW (Mock Service Worker)

### 📦 What We Have
- Comprehensive MSW handlers in `src/tests/mocks/handlers/subscription.ts` (290 lines)
- Stateful seat management, realistic validation, proper business logic
- Ready to use but currently disabled due to Jest ESM compatibility issues

### ⚠️ Current Issue
MSW v2 has ESM module resolution problems with Jest:
- Error: `Cannot find module '@mswjs/interceptors/ClientRequest'`
- Related to: https://github.com/mswjs/msw/issues/1267
- Affects Jest environments, not browser/Storybook

### 🔄 When to Use MSW (Future)
MSW is better for:
1. **Browser Testing** - Storybook, Playwright, Cypress
2. **E2E Tests** - Intercepts actual network requests in browser
3. **Shared Mocks** - Same handlers for Jest + browser tests
4. **Service Workers** - Real browser service worker interception

### 🎯 Recommendation

**Keep Both Libraries:**

```
tests/
├── mocks/
│   ├── handlers/          # MSW handlers (for future browser testing)
│   │   ├── subscription.ts
│   │   └── users.ts
│   └── axios/             # axios-mock-adapter (for Jest)
│       └── setupMocks.ts
```

**Use axios-mock-adapter for:**
- ✅ All Jest/unit tests
- ✅ Hook tests
- ✅ Component tests with API calls

**Use MSW for (when ESM issues resolved):**
- 🔮 Storybook stories
- 🔮 Playwright/Cypress E2E tests
- 🔮 Development mode API mocking (MSW browser worker)

**Or Remove MSW:**
If you only need Jest testing and don't plan to use Storybook/E2E:
```bash
npm uninstall msw
# Remove: src/tests/mocks/handlers/
# Remove: src/tests/mocks/server.ts
# Remove: src/tests/mocks/browser.ts
```

---

## Test Quality Improvements Achieved

### Before
```typescript
// ❌ Service completely mocked
jest.mock("@services/subscription", () => ({
  subscriptionService: {
    manageSeats: jest.fn().mockResolvedValue({ success: true })
  }
}));
// Test passes even if real service is broken!
```

### After
```typescript
// ✅ HTTP-level mocking
const mock = new MockAdapter(axiosService.getInstance());
mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
  data: { success: true, data: { additionalSeatsCount: 5 } }
});
// Tests real service logic, serialization, error handling
```

### What We Now Catch
1. ✅ Response structure changes
2. ✅ Serialization bugs
3. ✅ Error handling paths
4. ✅ Request formatting issues
5. ✅ Real React Query behavior (caching, invalidation)

---

## Migration Guide for Other Tests

### Step 1: Install axios-mock-adapter
Already installed ✅

### Step 2: Update Test Structure
```typescript
import MockAdapter from "axios-mock-adapter";
import axiosService from "@configs/axios";

describe("YourHook", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosService.getInstance());
  });

  afterEach(() => {
    mock.restore();
  });

  it("should do something", async () => {
    // Setup mock response
    mock.onGet("/api/v1/endpoint").reply(200, {
      data: { success: true, data: {...} }
    });

    // Test...
  });
});
```

### Step 3: Remove Service Mocks
```typescript
// ❌ Remove these
jest.mock("@services/users");
jest.mock("@services/properties");

// ✅ Keep only UI mocks
jest.mock("@hooks/useNotification");
```

---

## Package Recommendations

### Keep
- ✅ **axios-mock-adapter** - Primary mocking for Jest tests
- ✅ **@testing-library/react** - Component testing
- ✅ **@testing-library/user-event** - User interactions

### Optional (Keep or Remove)
- 🤔 **msw** - Keep if planning Storybook/E2E, remove if Jest-only
  - Pros: Comprehensive handlers already written
  - Cons: Not currently usable with Jest, 2MB package size

### Decision Matrix

| Scenario | Recommendation |
|----------|---------------|
| Jest tests only | Remove MSW, use axios-mock-adapter |
| Jest + Storybook | Keep both, use MSW for Storybook |
| Jest + E2E (Playwright) | Keep both, use MSW for E2E |
| Full testing strategy | Keep both, migrate when MSW v2 Jest support improves |

---

## Current Status

✅ **14/14 tests passing** in useManageSeats.test.tsx
✅ **0 service mocks** - All HTTP-level mocking
✅ **Real React Query** - Actual cache invalidation tested
✅ **Better bug detection** - Will catch real-world issues

## Next Steps

1. **Migrate other hook tests** to axios-mock-adapter pattern
2. **Keep MSW handlers** as reference for future browser testing
3. **Document this pattern** for team consistency
4. **Consider MSW for Storybook** when setting up component library
