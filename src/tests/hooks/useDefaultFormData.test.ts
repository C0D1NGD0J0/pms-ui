import { renderHook } from "@testing-library/react";
import { 
  getAvailableDefaultPaths, 
  usePropertyFormDefaults, 
  useAuthFormDefaults,
  useDefaultFormData 
} from "@hooks/useDefaultFormData";

// Mock the test data utilities
jest.mock("@src/test-data/properties", () => ({
  shouldUseDefaultData: jest.fn(),
  getDefaultData: jest.fn(),
  getRandomDefault: jest.fn(),
}));

import { shouldUseDefaultData, getRandomDefault, getDefaultData } from "@src/test-data/properties";

const mockShouldUseDefaultData = shouldUseDefaultData as jest.MockedFunction<typeof shouldUseDefaultData>;
const mockGetDefaultData = getDefaultData as jest.MockedFunction<typeof getDefaultData>;
const mockGetRandomDefault = getRandomDefault as jest.MockedFunction<typeof getRandomDefault>;

describe("useDefaultFormData", () => {
  const mockSetValues = jest.fn();
  let mockForm: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockForm = {
      setValues: mockSetValues,
      values: {},
    };
  });

  it("should not populate form when not in dev mode", () => {
    mockShouldUseDefaultData.mockReturnValue(false);

    const { result } = renderHook(() =>
      useDefaultFormData(mockForm, { path: "auth.login" })
    );

    expect(result.current.isDevMode).toBe(false);
    expect(mockSetValues).not.toHaveBeenCalled();
  });

  it("should populate form with default data on mount", () => {
    mockShouldUseDefaultData.mockReturnValue(true);
    mockGetDefaultData.mockReturnValue({ email: "test@test.com", password: "password123" });

    renderHook(() =>
      useDefaultFormData(mockForm, { path: "auth.login" })
    );

    expect(mockGetDefaultData).toHaveBeenCalledWith("auth.login");
    expect(mockSetValues).toHaveBeenCalledWith({ email: "test@test.com", password: "password123" });
  });

  it("should use random data when useRandom is true", () => {
    mockShouldUseDefaultData.mockReturnValue(true);
    mockGetRandomDefault.mockReturnValue({ email: "random@test.com", password: "random123" });

    renderHook(() =>
      useDefaultFormData(mockForm, { path: "auth.login", useRandom: true })
    );

    expect(mockGetRandomDefault).toHaveBeenCalledWith("auth.login");
    expect(mockSetValues).toHaveBeenCalledWith({ email: "random@test.com", password: "random123" });
  });

  it("should not auto-populate when autoPopulate is false", () => {
    mockShouldUseDefaultData.mockReturnValue(true);

    renderHook(() =>
      useDefaultFormData(mockForm, { path: "auth.login", autoPopulate: false })
    );

    expect(mockSetValues).not.toHaveBeenCalled();
  });

  it("should exclude specified fields", () => {
    mockShouldUseDefaultData.mockReturnValue(true);
    mockGetDefaultData.mockReturnValue({ 
      email: "test@test.com", 
      password: "password123", 
      rememberMe: false 
    });

    renderHook(() =>
      useDefaultFormData(mockForm, { 
        path: "auth.login", 
        excludeFields: ["rememberMe"] 
      })
    );

    expect(mockSetValues).toHaveBeenCalledWith({ 
      email: "test@test.com", 
      password: "password123" 
    });
  });

  it("should exclude nested fields", () => {
    mockShouldUseDefaultData.mockReturnValue(true);
    mockGetDefaultData.mockReturnValue({ 
      user: { 
        profile: { name: "John", age: 30 },
        email: "john@test.com" 
      },
      settings: { theme: "dark" }
    });

    renderHook(() =>
      useDefaultFormData(mockForm, { 
        path: "user.profile", 
        excludeFields: ["user.profile.age"] 
      })
    );

    expect(mockSetValues).toHaveBeenCalledWith({ 
      user: { 
        profile: { name: "John" },
        email: "john@test.com" 
      },
      settings: { theme: "dark" }
    });
  });

  it("should apply transform function", () => {
    mockShouldUseDefaultData.mockReturnValue(true);
    mockGetDefaultData.mockReturnValue({ name: "john", email: "john@test.com" });

    const transform = (data: any) => ({ ...data, name: data.name.toUpperCase() });

    renderHook(() =>
      useDefaultFormData(mockForm, { 
        path: "user.profile", 
        transform 
      })
    );

    expect(mockSetValues).toHaveBeenCalledWith({ 
      name: "JOHN", 
      email: "john@test.com" 
    });
  });

  it("should provide getDefaults function", () => {
    mockShouldUseDefaultData.mockReturnValue(true);
    mockGetDefaultData.mockReturnValue({ email: "test@test.com" });

    const { result } = renderHook(() =>
      useDefaultFormData(mockForm, { path: "auth.login", autoPopulate: false })
    );

    const defaults = result.current.getDefaults();
    expect(defaults).toEqual({ email: "test@test.com" });
  });

  it("should provide populateForm function", () => {
    mockShouldUseDefaultData.mockReturnValue(true);

    const { result } = renderHook(() =>
      useDefaultFormData(mockForm, { path: "auth.login", autoPopulate: false })
    );

    const customData = { email: "custom@test.com", password: "custom123" };
    result.current.populateForm(customData);

    expect(mockSetValues).toHaveBeenCalledWith(customData);
  });

  it("should return null from getDefaults when not in dev mode", () => {
    mockShouldUseDefaultData.mockReturnValue(false);

    const { result } = renderHook(() =>
      useDefaultFormData(mockForm, { path: "auth.login" })
    );

    expect(result.current.getDefaults()).toBeNull();
  });
});

describe("useAuthFormDefaults", () => {
  const mockSetValues = jest.fn();
  let mockForm: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockForm = { setValues: mockSetValues, values: {} };
    mockShouldUseDefaultData.mockReturnValue(true);
  });

  it("should use correct path for login", () => {
    renderHook(() => useAuthFormDefaults(mockForm, "login"));
    expect(mockGetDefaultData).toHaveBeenCalledWith("auth.login");
  });

  it("should use correct path for register", () => {
    renderHook(() => useAuthFormDefaults(mockForm, "register"));
    expect(mockGetDefaultData).toHaveBeenCalledWith("auth.register");
  });
});

describe("usePropertyFormDefaults", () => {
  const mockSetValues = jest.fn();
  let mockForm: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockForm = { setValues: mockSetValues, values: {} };
    mockShouldUseDefaultData.mockReturnValue(true);
    mockGetDefaultData.mockReturnValue({ 
      name: "Test Property", 
      documents: ["doc1"], 
      propertyImages: ["img1"] 
    });
  });

  it("should exclude document fields by default", () => {
    renderHook(() => usePropertyFormDefaults(mockForm));

    expect(mockSetValues).toHaveBeenCalledWith({ name: "Test Property" });
  });
});

describe("getAvailableDefaultPaths", () => {
  it("should return array of available paths", () => {
    const paths = getAvailableDefaultPaths();
    
    expect(Array.isArray(paths)).toBe(true);
    expect(paths.length).toBeGreaterThan(0);
    expect(paths).toContain("auth.login");
    expect(paths).toContain("property.basic");
  });
});