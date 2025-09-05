import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { ProfileFormValues } from "@validations/profile.validations";
import { useCallback, ChangeEvent, useEffect, useState, useMemo } from "react";
import {
  defaultProfileValues,
  profileTabFields,
  profileSchema,
} from "@validations/profile.validations";

export type ProfileFormBaseProps = {
  initialValues?: ProfileFormValues;
};

export function useProfileFormBase({
  initialValues = defaultProfileValues,
}: ProfileFormBaseProps = {}) {
  const [activeTab, setActiveTab] = useState("personal");

  const profileForm = useForm<ProfileFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(profileSchema),
  });

  useEffect(() => {
    // validate form whenever values change
    profileForm.validate();
  }, [profileForm.values]);

  // Theme options
  const getThemeOptions = useCallback(() => {
    return [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ];
  }, []);

  // Login type options
  const getLoginTypeOptions = useCallback(() => {
    return [
      { value: "password", label: "Password" },
      { value: "otp", label: "One-Time Password" },
    ];
  }, []);

  // ID type options
  const getIdTypeOptions = useCallback(() => {
    return [
      { value: "passport", label: "Passport" },
      { value: "drivers-license", label: "Driver's License" },
      { value: "national-id", label: "National ID" },
      { value: "corporation-license", label: "Corporation License" },
    ];
  }, []);

  // Data retention policy options
  const getDataRetentionOptions = useCallback(() => {
    return [
      { value: "minimal", label: "Minimal (6 months)" },
      { value: "standard", label: "Standard (2 years)" },
      { value: "extended", label: "Extended (5 years)" },
    ];
  }, []);

  // Language options
  const getLanguageOptions = useCallback(() => {
    return [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
    ];
  }, []);

  // Document type options
  const getDocumentTypeOptions = useCallback(() => {
    return [
      { value: "passport", label: "Passport" },
      { value: "id_card", label: "ID Card" },
      { value: "drivers_license", label: "Driver's License" },
      { value: "birth_certificate", label: "Birth Certificate" },
      { value: "social_security", label: "Social Security Card" },
      { value: "tax_document", label: "Tax Document" },
      { value: "employment_verification", label: "Employment Verification" },
      { value: "other", label: "Other" },
    ];
  }, []);

  const getTimezoneOptions = useCallback(() => {
    return [
      { value: "UTC", label: "UTC" },
      { value: "America/New_York", label: "Eastern Time (ET)" },
      { value: "America/Chicago", label: "Central Time (CT)" },
      { value: "America/Denver", label: "Mountain Time (MT)" },
      { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
      { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
      { value: "Europe/Paris", label: "Central European Time (CET)" },
      { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    ];
  }, []);

  // Memoized options
  const themeOptions = useMemo(() => getThemeOptions(), [getThemeOptions]);
  const loginTypeOptions = useMemo(
    () => getLoginTypeOptions(),
    [getLoginTypeOptions]
  );
  const idTypeOptions = useMemo(() => getIdTypeOptions(), [getIdTypeOptions]);
  const dataRetentionOptions = useMemo(
    () => getDataRetentionOptions(),
    [getDataRetentionOptions]
  );
  const languageOptions = useMemo(
    () => getLanguageOptions(),
    [getLanguageOptions]
  );
  const timezoneOptions = useMemo(
    () => getTimezoneOptions(),
    [getTimezoneOptions]
  );
  const documentTypeOptions = useMemo(
    () => getDocumentTypeOptions(),
    [getDocumentTypeOptions]
  );

  // Check if tab has validation errors
  const hasTabErrors = useCallback(
    (tabId: string): boolean => {
      const relevantFields =
        profileTabFields[tabId as keyof typeof profileTabFields] || [];
      return relevantFields.some((field) => {
        if (field.includes(".")) {
          // Handle nested fields
          const fieldParts = field.split(".");
          let currentErrors = profileForm.errors;

          for (const part of fieldParts) {
            if (
              currentErrors &&
              typeof currentErrors === "object" &&
              part in currentErrors
            ) {
              currentErrors = (currentErrors as any)[part];
            } else {
              return false;
            }
          }

          return !!currentErrors;
        }

        return !!profileForm.errors[field as keyof typeof profileForm.errors];
      });
    },
    [profileForm.errors]
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Validate all form fields
  const validateAll = useCallback(() => {
    const result = profileForm.validate();
    return result.hasErrors === false;
  }, [profileForm]);

  // Handle field changes
  const handleOnChange = useCallback(
    (
      e:
        | ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | string,
      field?: string
    ) => {
      if (typeof e === "string" && field) {
        // Handle programmatic value changes
        if (field.includes(".")) {
          const fieldParts = field.split(".");
          const parentValue =
            profileForm.values[fieldParts[0] as keyof ProfileFormValues];
          if (
            parentValue &&
            typeof parentValue === "object" &&
            !Array.isArray(parentValue)
          ) {
            profileForm.setFieldValue(fieldParts[0] as any, {
              ...parentValue,
              [fieldParts[1]]: e,
            });
          }
        } else {
          profileForm.setFieldValue(field as any, e);
        }
        return;
      } else if (typeof e !== "string") {
        // Handle event-based changes
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.includes(".")) {
          const [parent, child] = name.split(".");
          const parentValue =
            profileForm.values[parent as keyof ProfileFormValues];

          if (
            parentValue &&
            typeof parentValue === "object" &&
            !Array.isArray(parentValue)
          ) {
            profileForm.setFieldValue(parent as any, {
              ...parentValue,
              [child]: type === "checkbox" ? checked : value,
            });
          }
        } else {
          // Handle direct field assignment with proper type checking
          const fieldValue = type === "checkbox" ? checked : value;

          // Only set field value if it's a valid top-level field that accepts primitives
          // For ProfileFormValues, most top-level fields are objects, so this should be rare
          if (name in profileForm.values) {
            const currentValue =
              profileForm.values[name as keyof ProfileFormValues];

            // Only assign if the current field expects a primitive value
            if (
              typeof currentValue === "string" ||
              typeof currentValue === "boolean" ||
              typeof currentValue === "number"
            ) {
              profileForm.setFieldValue(
                name as keyof ProfileFormValues,
                fieldValue as any
              );
            }
          }
        }
      }
    },
    [profileForm]
  );

  // Handle nested field changes (for complex objects)
  const handleNestedChange = useCallback(
    (section: string, field: string, value: any) => {
      const sectionValue =
        profileForm.values[section as keyof ProfileFormValues];

      if (section.includes(".")) {
        // Handle deeply nested objects like 'settings.notifications'
        const [mainSection, subSection] = section.split(".");
        const mainSectionValue =
          profileForm.values[mainSection as keyof ProfileFormValues];

        if (
          mainSectionValue &&
          typeof mainSectionValue === "object" &&
          !Array.isArray(mainSectionValue)
        ) {
          const subSectionValue = (mainSectionValue as any)[subSection];

          profileForm.setFieldValue(mainSection as any, {
            ...mainSectionValue,
            [subSection]: {
              ...subSectionValue,
              [field]: value,
            },
          });
        }
      } else if (
        sectionValue &&
        typeof sectionValue === "object" &&
        !Array.isArray(sectionValue)
      ) {
        profileForm.setFieldValue(section as any, {
          ...sectionValue,
          [field]: value,
        });
      }
    },
    [profileForm]
  );

  // Handle profile photo changes (simple file storage)
  const handleProfilePhotoChange = useCallback(
    (file: File | null) => {
      if (file) {
        const currentAvatar = profileForm.values.personalInfo.avatar || {
          url: "",
          filename: "",
          key: "",
        };
        
        // Store file in form for submission
        const updatedAvatar = {
          ...currentAvatar,
          filename: file.name,
          file: file,
        };
        
        profileForm.setFieldValue("personalInfo.avatar", updatedAvatar);
      } else {
        // Clear avatar
        profileForm.setFieldValue("personalInfo.avatar", {
          url: "",
          filename: "",
          key: "",
          file: undefined,
        });
      }
    },
    [profileForm]
  );

  return {
    activeTab,
    profileForm,
    validateAll,
    hasTabErrors,
    handleOnChange,
    handleNestedChange,
    handleProfilePhotoChange,
    setActiveTab: handleTabChange,

    // Options for dropdowns
    themeOptions,
    loginTypeOptions,
    idTypeOptions,
    dataRetentionOptions,
    languageOptions,
    timezoneOptions,
    documentTypeOptions,
  };
}
