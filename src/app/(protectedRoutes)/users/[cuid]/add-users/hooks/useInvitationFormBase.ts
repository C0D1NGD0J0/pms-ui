import { useForm } from "@mantine/form";
import { IUserRole } from "@interfaces/invitation.interface";
import { useCallback, useEffect, useState, useMemo } from "react";
import { shouldUseDefaultData, getRandomDefault } from "@test-data/properties";
import {
  sanitizeInvitationFormData,
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
  role: "staff",
  metadata: {
    inviteMessage: "",
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
  tenantInfo: {
    employerInfo: {
      companyName: "",
      position: "",
      monthlyIncome: undefined,
      companyRef: "",
      refContactEmail: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
      email: "",
    },
    rentalReferences: [],
  },
  status: "pending",
};

export type InvitationFormBaseProps = {
  initialValues?: InvitationFormValues;
};

export function useInvitationFormBase({
  initialValues = defaultInvitationValues,
}: InvitationFormBaseProps = {}) {
  const [activeTab, setActiveTab] = useState("role");
  const [selectedRole, setSelectedRole] = useState<IUserRole | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [showInviteMessage, setShowInviteMessage] = useState(false);

  const customValidation = useCallback((values: InvitationFormValues) => {
    try {
      const sanitizedData = sanitizeInvitationFormData(values);
      const result = invitationSchema.safeParse(sanitizedData);

      if (!result.success) {
        const errors: Record<string, any> = {};

        result.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          errors[path] = issue.message;
        });

        return errors;
      }

      return {};
    } catch (error) {
      console.error("Validation error:", error);
      return { _form: "Validation failed" };
    }
  }, []);

  const invitationForm = useForm<InvitationFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: customValidation,
  });

  useEffect(() => {
    invitationForm.validate();
  }, [invitationForm.values]);

  const getTabFields = useCallback(() => {
    const baseFields = [
      "personalInfo.firstName",
      "personalInfo.lastName",
      "personalInfo.phoneNumber",
      "inviteeEmail",
    ];

    const vendorFields = [
      ...baseFields,
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
    ];

    const staffFields = [
      ...baseFields,
      "employeeInfo.jobTitle",
      "employeeInfo.department",
      "employeeInfo.employeeId",
      "employeeInfo.reportsTo",
      "employeeInfo.startDate",
    ];

    const tenantFields = [
      ...baseFields,
      "tenantInfo.employerInfo.companyName",
      "tenantInfo.employerInfo.position",
      "tenantInfo.employerInfo.monthlyIncome",
      "tenantInfo.employerInfo.companyRef",
      "tenantInfo.employerInfo.refContactEmail",
      "tenantInfo.emergencyContact.name",
      "tenantInfo.emergencyContact.phone",
      "tenantInfo.emergencyContact.relationship",
      "tenantInfo.emergencyContact.email",
      "tenantInfo.rentalReferences",
    ];

    let detailsFields = baseFields;
    if (selectedRole === "vendor") {
      detailsFields = vendorFields;
    } else if (selectedRole === "tenant") {
      detailsFields = tenantFields;
    } else if (
      selectedRole === "manager" ||
      selectedRole === "staff" ||
      selectedRole === "admin"
    ) {
      detailsFields = staffFields;
    }

    return {
      role: ["role", "metadata.inviteMessage"],
      details: detailsFields,
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
        const getDataPath = (role: IUserRole) => {
          if (role === "vendor") {
            return "invitation.vendors";
          } else if (role === "tenant") {
            return "invitation.tenants";
          } else {
            return "invitation.employees";
          }
        };

        const defaultData = getRandomDefault(getDataPath(role));
        if (defaultData) {
          const transformedData = { ...defaultData };

          if (transformedData.employeeInfo?.startDate instanceof Date) {
            transformedData.employeeInfo.startDate =
              transformedData.employeeInfo.startDate
                .toISOString()
                .split("T")[0];
          }

          // invitationForm.setValues(transformedData);
          // if (transformedData.metadata?.inviteMessage) {
          //   setMessageCount(transformedData.metadata.inviteMessage.length);
          // }
        }
      } catch (error) {
        console.warn("Failed to populate default data:", error);
      }
    },
    [invitationForm]
  );

  const handleRoleSelect = useCallback(
    (role: IUserRole) => {
      if (role === "super-admin") {
        console.warn("Super-admin role cannot be set from frontend");
        return;
      }

      setSelectedRole(role);
      invitationForm.setFieldValue("role", role);

      // Clear other role-specific data
      if (role === "vendor") {
        invitationForm.setFieldValue(
          "employeeInfo",
          defaultInvitationValues.employeeInfo
        );
        invitationForm.setFieldValue(
          "tenantInfo",
          defaultInvitationValues.tenantInfo
        );
      } else if (role === "tenant") {
        invitationForm.setFieldValue(
          "vendorInfo",
          defaultInvitationValues.vendorInfo
        );
        invitationForm.setFieldValue(
          "employeeInfo",
          defaultInvitationValues.employeeInfo
        );
      } else {
        // Staff roles (manager, staff, admin)
        invitationForm.setFieldValue(
          "vendorInfo",
          defaultInvitationValues.vendorInfo
        );
        invitationForm.setFieldValue(
          "tenantInfo",
          defaultInvitationValues.tenantInfo
        );
      }

      // populate with default data for all roles
      setTimeout(() => {
        populateWithDefaultData(role);
      }, 100);
    },
    [invitationForm, populateWithDefaultData]
  );

  const handleMessageCountChange = useCallback((count: number) => {
    setMessageCount(count);
  }, []);

  const handleShowInviteMessageToggle = useCallback(
    (show: boolean) => {
      setShowInviteMessage(show);
      if (!show) {
        invitationForm.setFieldValue("metadata.inviteMessage", "");
        setMessageCount(0);
      }
    },
    [invitationForm]
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
          if (selectedRole === "vendor") {
            return "Vendor Details";
          } else if (selectedRole === "tenant") {
            return "Tenant Details";
          } else if (selectedRole) {
            return "Staff Details";
          }
          return "Details";
        case "review":
          return "Review & Send";
        default:
          return tabId;
      }
    },
    [selectedRole]
  );

  return {
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
    handleMessageCountChange,
    handleShowInviteMessageToggle,
    resetForm,
    validateAll,
    setActiveTab: handleTabChange,
    populateWithDefaultData,
    isDevMode: shouldUseDefaultData(),
  };
}
