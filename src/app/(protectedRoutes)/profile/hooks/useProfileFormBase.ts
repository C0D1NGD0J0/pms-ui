import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { ProfileFormValues } from "@validations/profile.validations";
import { useCallback, ChangeEvent, useEffect, useState } from "react";
import {
  defaultProfileValues,
  profileTabFields,
  profileSchema,
} from "@validations/profile.validations";
import {
  PROFILE_DATA_RETENTION_OPTIONS,
  PROFILE_DOCUMENT_TYPE_OPTIONS,
  PROFILE_LOGIN_TYPE_OPTIONS,
  PROFILE_LANGUAGE_OPTIONS,
  PROFILE_TIMEZONE_OPTIONS,
  PROFILE_ID_TYPE_OPTIONS,
  PROFILE_THEME_OPTIONS,
} from "@utils/constants";

export type ProfileFormBaseProps = {
  initialValues?: ProfileFormValues;
};

export function useProfileFormBase({
  initialValues = defaultProfileValues,
}: ProfileFormBaseProps = {}) {
  const [activeTab, setActiveTab] = useState("personal");

  const profileForm = useForm<ProfileFormValues>({
    initialValues,
    validate: zodResolver(profileSchema),
  });

  useEffect(() => {
    profileForm.validate();
  }, [profileForm.values]);

  // Check if tab has validation errors using direct field access
  const hasTabErrors = useCallback(
    (tabId: string): boolean => {
      const relevantFields =
        profileTabFields[tabId as keyof typeof profileTabFields] || [];

      return relevantFields.some((field) => {
        // Use direct field access pattern like "personalInfo.firstName"
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
          const fieldValue = type === "checkbox" ? checked : value;
          // For ProfileFormValues, most top-level fields are objects, so this should be rare
          if (name in profileForm.values) {
            const currentValue =
              profileForm.values[name as keyof ProfileFormValues];

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

  const handleNestedChange = useCallback(
    (section: string, field: string, value: any) => {
      const sectionValue =
        profileForm.values[section as keyof ProfileFormValues];

      if (section.includes(".")) {
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

  const handleProfilePhotoChange = useCallback(
    (file: File | null) => {
      if (file) {
        const currentAvatar = profileForm.values.personalInfo.avatar || {
          url: "",
          filename: "",
          key: "",
        };

        const updatedAvatar = {
          ...currentAvatar,
          filename: file.name,
          file: file,
        };

        profileForm.setFieldValue("personalInfo.avatar", updatedAvatar);
      } else {
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

    themeOptions: PROFILE_THEME_OPTIONS,
    loginTypeOptions: PROFILE_LOGIN_TYPE_OPTIONS,
    idTypeOptions: PROFILE_ID_TYPE_OPTIONS,
    dataRetentionOptions: PROFILE_DATA_RETENTION_OPTIONS,
    languageOptions: PROFILE_LANGUAGE_OPTIONS,
    timezoneOptions: PROFILE_TIMEZONE_OPTIONS,
    documentTypeOptions: PROFILE_DOCUMENT_TYPE_OPTIONS,
  };
}
