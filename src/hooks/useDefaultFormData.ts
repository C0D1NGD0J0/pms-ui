import { useEffect } from "react";
import { UseFormReturnType } from "@mantine/form";
import {
  shouldUseDefaultData,
  getRandomDefault,
  getDefaultData,
} from "@src/test-data/index";

interface UseDefaultFormDataOptions {
  /**
   * Path to the default data (e.g., 'auth.login', 'property.basic')
   */
  path: string;
  /**
   * Whether to use random data from array (useful for multiple datasets)
   */
  useRandom?: boolean;
  /**
   * Whether to auto-populate the form on mount
   */
  autoPopulate?: boolean;
  /**
   * Fields to exclude from auto-population
   */
  excludeFields?: string[];
  /**
   * Custom transform function for the data before setting
   */
  transform?: (data: any) => any;
}

export function useDefaultFormData<T = any>(
  form: UseFormReturnType<T>,
  options: UseDefaultFormDataOptions
) {
  const {
    path,
    useRandom = false,
    autoPopulate = true,
    excludeFields = [],
    transform,
  } = options;

  // Function to get default data
  const getDefaults = () => {
    if (!shouldUseDefaultData()) return null;

    const data = useRandom ? getRandomDefault(path) : getDefaultData(path);
    return transform ? transform(data) : data;
  };

  // Function to populate form with default data
  const populateForm = (customData?: any) => {
    if (!shouldUseDefaultData()) return;

    const defaultData = customData || getDefaults();
    if (!defaultData) return;

    // Filter out excluded fields
    const filteredData = { ...defaultData };
    excludeFields.forEach((field) => {
      if (field.includes(".")) {
        // Handle nested field exclusion
        const keys = field.split(".");
        let current = filteredData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (current[keys[i]]) {
            current = current[keys[i]];
          }
        }
        delete current[keys[keys.length - 1]];
      } else {
        delete filteredData[field];
      }
    });

    // Set form values
    form.setValues(filteredData);
  };

  // Auto-populate on mount if enabled
  useEffect(() => {
    if (autoPopulate && shouldUseDefaultData()) {
      populateForm();
    }
  }, [path, autoPopulate]);

  return {
    getDefaults,
    populateForm,
    isDevMode: shouldUseDefaultData(),
  };
}

// Specialized hooks for common use cases
export function useAuthFormDefaults<T = any>(
  form: UseFormReturnType<T>,
  authType:
    | "login"
    | "register"
    | "forgotPassword"
    | "resetPassword"
    | "accountActivation"
) {
  return useDefaultFormData(form, {
    path: `auth.${authType}`,
    autoPopulate: true,
  });
}

export function usePropertyFormDefaults<T = any>(
  form: UseFormReturnType<T>,
  propertyType: "basic" | "commercial" = "basic"
) {
  return useDefaultFormData(form, {
    path: `property.${propertyType}`,
    autoPopulate: true,
    excludeFields: ["documents", "propertyImages"], // Exclude file fields
  });
}

export function useUnitFormDefaults<T = any>(
  form: UseFormReturnType<T>,
  unitType: "residential" | "commercial" | "studio" = "residential"
) {
  return useDefaultFormData(form, {
    path: `unit.${unitType}`,
    autoPopulate: true,
  });
}

export function useInvitationFormDefaults<T = any>(
  form: UseFormReturnType<T>,
  role: "employee" | "vendor",
  useRandom = true
) {
  return useDefaultFormData(form, {
    path: `invitation.${role}s`, // Note: plural for array access
    useRandom,
    autoPopulate: true,
    transform: (data) => {
      // Convert Date objects to strings for form compatibility
      if (data && typeof data === "object") {
        const transformed = { ...data };
        if (transformed.metadata?.expectedStartDate instanceof Date) {
          transformed.metadata.expectedStartDate =
            transformed.metadata.expectedStartDate.toISOString().split("T")[0];
        }
        if (transformed.employeeInfo?.startDate instanceof Date) {
          transformed.employeeInfo.startDate =
            transformed.employeeInfo.startDate.toISOString().split("T")[0];
        }
        return transformed;
      }
      return data;
    },
  });
}

export function useClientFormDefaults<T = any>(
  form: UseFormReturnType<T>,
  clientType: "individual" | "corporate" = "individual"
) {
  return useDefaultFormData(form, {
    path: `client.${clientType}`,
    autoPopulate: true,
    excludeFields: ["identification.idimage"], // Exclude file fields
    transform: (data) => {
      // Convert date strings to Date objects if needed
      if (data?.identification) {
        const identification = { ...data.identification };
        if (
          identification.issueDate &&
          typeof identification.issueDate === "string"
        ) {
          identification.issueDate = new Date(identification.issueDate);
        }
        if (
          identification.expiryDate &&
          typeof identification.expiryDate === "string"
        ) {
          identification.expiryDate = new Date(identification.expiryDate);
        }
        return { ...data, identification };
      }
      return data;
    },
  });
}

// Helper function to get all available default data paths
export function getAvailableDefaultPaths(): string[] {
  return [
    "auth.login",
    "auth.register",
    "auth.forgotPassword",
    "auth.resetPassword",
    "auth.accountActivation",
    "property.basic",
    "property.commercial",
    "unit.residential",
    "unit.commercial",
    "unit.studio",
    "client.individual",
    "client.corporate",
    "invitation.employees",
    "invitation.vendors",
    "csvUpload.property",
  ];
}
