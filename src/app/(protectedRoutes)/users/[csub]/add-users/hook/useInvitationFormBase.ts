import { useAuth } from "@store/index";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { IUserRole } from "@interfaces/invitation.interface";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  shouldUseDefaultData,
  getRandomDefault,
} from "@hooks/useDefaultFormData";
import {
  InvitationFormValues,
  invitationSchema,
} from "@validations/invitation.validations";

const defaultInvitationValues: InvitationFormValues = {
  personalInfo: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  },
  inviteeEmail: "",
  role: "EMPLOYEE",
  metadata: {
    inviteMessage: "",
    expectedStartDate: undefined,
  },
  employeeInfo: {
    jobTitle: "",
    department: "",
    permissions: [],
    employeeId: "",
    reportsTo: "",
    startDate: undefined,
  },
  vendorInfo: {
    companyName: "",
    businessType: "",
    taxId: "",
    registrationNumber: "",
    yearsInBusiness: undefined,
    servicesOffered: {},
    serviceArea: {
      maxDistance: 10,
    },
    insuranceInfo: {
      hasInsurance: false,
      provider: "",
      policyNumber: "",
      coverageAmount: undefined,
      expirationDate: undefined,
      documentUrl: "",
      documentName: "",
    },
    contactPerson: {
      name: "",
      jobTitle: "",
      email: "",
      phone: "",
      department: "",
    },
  },
};

export type InvitationFormBaseProps = {
  initialValues?: InvitationFormValues;
};

export function useInvitationFormBase({
  initialValues = defaultInvitationValues,
}: InvitationFormBaseProps = {}) {
  const { client } = useAuth();
  const [activeTab, setActiveTab] = useState("role");
  const [selectedRole, setSelectedRole] = useState<IUserRole | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [showInviteMessage, setShowInviteMessage] = useState(false);

  const invitationForm = useForm<InvitationFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(invitationSchema),
  });

  useEffect(() => {
    invitationForm.validate();
  }, [invitationForm.values]);

  const getTabFields = useCallback(() => {
    return {
      role: ["role", "metadata.inviteMessage"],
      details:
        selectedRole === "EMPLOYEE"
          ? [
              "personalInfo.firstName",
              "personalInfo.lastName",
              "personalInfo.phoneNumber",
              "inviteeEmail",
              "employeeInfo.jobTitle",
              "employeeInfo.department",
              "employeeInfo.employeeId",
              "employeeInfo.reportsTo",
              "employeeInfo.startDate",
            ]
          : selectedRole === "VENDOR"
          ? [
              "personalInfo.firstName",
              "personalInfo.lastName",
              "personalInfo.phoneNumber",
              "inviteeEmail",
              "vendorInfo.companyName",
              "vendorInfo.businessType",
              "vendorInfo.taxId",
              "vendorInfo.registrationNumber",
              "vendorInfo.yearsInBusiness",
              "vendorInfo.serviceArea.maxDistance",
              "vendorInfo.insuranceInfo.hasInsurance",
              "vendorInfo.insuranceInfo.provider",
              "vendorInfo.insuranceInfo.policyNumber",
              "vendorInfo.insuranceInfo.coverageAmount",
              "vendorInfo.insuranceInfo.expirationDate",
              "vendorInfo.contactPerson.name",
              "vendorInfo.contactPerson.jobTitle",
              "vendorInfo.contactPerson.email",
              "vendorInfo.contactPerson.phone",
              "vendorInfo.contactPerson.department",
            ]
          : [
              "personalInfo.firstName",
              "personalInfo.lastName",
              "personalInfo.phoneNumber",
              "inviteeEmail",
            ],
      review: [
        "personalInfo.firstName",
        "personalInfo.lastName",
        "inviteeEmail",
        "role",
      ],
    };
  }, [selectedRole]);

  const tabFields = useMemo(() => getTabFields(), [getTabFields]);

  const hasTabErrors = useCallback(
    (tabId: string): boolean => {
      const relevantFields = tabFields[tabId as keyof typeof tabFields] || [];
      return relevantFields.some((field) => {
        if (field.includes(".")) {
          const parts = field.split(".");
          let current: any = invitationForm.errors;
          for (const part of parts) {
            if (current && typeof current === "object" && part in current) {
              current = current[part];
            } else {
              return false;
            }
          }
          return !!current;
        }
        return !!(invitationForm.errors as any)[field];
      });
    },
    [invitationForm.errors, tabFields]
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const populateWithDefaultData = useCallback(
    (role: IUserRole) => {
      if (!shouldUseDefaultData()) return;

      try {
        const defaultData = getRandomDefault(
          `invitation.${role.toLowerCase()}s`
        );
        if (defaultData) {
          // Transform dates for form compatibility
          const transformedData = { ...defaultData };

          // Convert Date objects to strings for form inputs
          if (transformedData.metadata?.expectedStartDate instanceof Date) {
            transformedData.metadata.expectedStartDate =
              transformedData.metadata.expectedStartDate
                .toISOString()
                .split("T")[0];
          }
          if (transformedData.employeeInfo?.startDate instanceof Date) {
            transformedData.employeeInfo.startDate =
              transformedData.employeeInfo.startDate
                .toISOString()
                .split("T")[0];
          }

          // Set the form values with the transformed data
          invitationForm.setValues(transformedData);

          // Update message count if there's an invite message
          if (transformedData.metadata?.inviteMessage) {
            setMessageCount(transformedData.metadata.inviteMessage.length);
          }
        }
      } catch (error) {
        console.warn("Failed to populate default data:", error);
      }
    },
    [invitationForm]
  );

  const handleRoleSelect = useCallback(
    (role: IUserRole) => {
      setSelectedRole(role);
      invitationForm.setFieldValue("role", role);

      // Clear role-specific data when changing roles
      if (role !== "EMPLOYEE") {
        invitationForm.setFieldValue(
          "employeeInfo",
          defaultInvitationValues.employeeInfo
        );
      }
      if (role !== "VENDOR") {
        invitationForm.setFieldValue(
          "vendorInfo",
          defaultInvitationValues.vendorInfo
        );
      }

      // Auto-populate with default data for development
      if (role === "EMPLOYEE" || role === "VENDOR") {
        setTimeout(() => {
          populateWithDefaultData(role);
        }, 100); // Small delay to ensure role is set first
      }
    },
    [invitationForm, populateWithDefaultData]
  );

  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      const keys = field.split(".");
      if (keys.length === 1) {
        invitationForm.setFieldValue(field as any, value);
      } else {
        // Handle nested field updates
        const currentValue = invitationForm.values;
        const newValue = { ...currentValue };
        let current: any = newValue;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        invitationForm.setValues(newValue);
      }

      // Update message count if it's the invite message field
      if (field === "metadata.inviteMessage") {
        setMessageCount(value?.length || 0);
      }
    },
    [invitationForm]
  );

  const handleMessageCountChange = useCallback((count: number) => {
    setMessageCount(count);
  }, []);

  const handleShowInviteMessageToggle = useCallback(
    (show: boolean) => {
      setShowInviteMessage(show);
      if (!show) {
        handleFieldChange("metadata.inviteMessage", "");
        setMessageCount(0);
      }
    },
    [handleFieldChange]
  );

  const resetForm = useCallback(() => {
    invitationForm.reset();
    setSelectedRole(null);
    setActiveTab("role");
    setMessageCount(0);
    setShowInviteMessage(false);
  }, [invitationForm]);

  const validateAll = useCallback(() => {
    const errors = invitationForm.validate();
    return !errors.hasErrors;
  }, [invitationForm]);

  const isTabVisible = useCallback(
    (tabId: string): boolean => {
      switch (tabId) {
        case "role":
          return true;
        case "details":
          return !!selectedRole;
        case "review":
          return true;
        default:
          return false;
      }
    },
    [selectedRole]
  );

  const getTabLabel = useCallback(
    (tabId: string): string => {
      switch (tabId) {
        case "role":
          return "Role Selection";
        case "details":
          return selectedRole === "EMPLOYEE"
            ? "Employee Details"
            : selectedRole === "VENDOR"
            ? "Vendor Details"
            : "Details";
        case "review":
          return "Review & Send";
        default:
          return tabId;
      }
    },
    [selectedRole]
  );

  return {
    client,
    activeTab,
    selectedRole,
    messageCount,
    showInviteMessage,
    invitationForm,
    hasTabErrors,
    isTabVisible,
    getTabLabel,
    handleTabChange,
    handleRoleSelect,
    handleFieldChange,
    handleMessageCountChange,
    handleShowInviteMessageToggle,
    resetForm,
    validateAll,
    setActiveTab: handleTabChange,
    populateWithDefaultData, // Expose for manual triggering if needed
    isDevMode: shouldUseDefaultData(),
  };
}
