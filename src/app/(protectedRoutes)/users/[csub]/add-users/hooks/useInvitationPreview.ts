import { useAuth } from "@store/index";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IUserRole } from "@interfaces/invitation.interface";
import { emailTemplateService } from "@services/email_template";
import { InvitationFormValues } from "@validations/invitation.validations";

export function useInvitationPreview() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<
    string | null
  >(null);
  const [currentFormData, setCurrentFormData] =
    useState<InvitationFormValues | null>(null);
  const [currentRole, setCurrentRole] = useState<IUserRole | null>(null);
  const { client } = useAuth();

  const getTemplateTypeForRole = useCallback(
    (role: IUserRole | null): string => {
      switch (role) {
        case "vendor":
          return "invitation";
        case "tenant":
          return "invitation";
        case "staff":
        case "manager":
        case "admin":
          return "invitation";
        default:
          return "invitation";
      }
    },
    []
  );

  const handleShowPreview = useCallback(
    (formData: InvitationFormValues, selectedRole: IUserRole | null) => {
      // Set form data and role when preview is requested
      setCurrentFormData(formData);
      setCurrentRole(selectedRole);
      const templateType = getTemplateTypeForRole(selectedRole);
      setSelectedTemplateType(templateType);
      setShowPreview(true);
    },
    [getTemplateTypeForRole]
  );

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    setCurrentFormData(null);
    setCurrentRole(null);
    setSelectedTemplateType(null);
  }, []);

  const setTemplateType = useCallback((templateType: string | null) => {
    setSelectedTemplateType(templateType);
  }, []);

  const getTemplateVariables = useCallback(
    (formData: InvitationFormValues, selectedRole: IUserRole | null) => {
      const firstName = formData?.personalInfo?.firstName || "";
      const lastName = formData?.personalInfo?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const displayName = fullName || "there";

      let startDateFormatted = "";
      if (selectedRole !== "vendor" && formData.employeeInfo?.startDate) {
        try {
          if (typeof formData.employeeInfo.startDate === "string") {
            startDateFormatted = new Date(
              formData.employeeInfo.startDate
            ).toLocaleDateString();
          } else if (formData.employeeInfo.startDate instanceof Date) {
            startDateFormatted =
              formData.employeeInfo.startDate.toLocaleDateString();
          }
        } catch (error) {
          console.warn("Error formatting start date:", error);
        }
      }

      const baseVariables = {
        companyName: "Property Management System",
        inviteeName: displayName,
        inviterName: "System Administrator",
        role: selectedRole || "Team Member",
        customMessage: formData.metadata?.inviteMessage || "",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        invitationUrl: "#",
        inviteeEmail: formData.inviteeEmail || "recipient@email.com",
        expectedStartDate: startDateFormatted,
        firstName: firstName || "New",
        lastName: lastName || "User",
      };

      if (selectedRole !== "vendor" && selectedRole && formData.employeeInfo) {
        return {
          ...baseVariables,
          jobTitle: formData.employeeInfo.jobTitle || "",
          department: formData.employeeInfo.department || "",
          employeeId: formData.employeeInfo.employeeId || "",
          reportsTo: formData.employeeInfo.reportsTo || "",
          startDate: startDateFormatted,
        };
      }

      if (selectedRole === "vendor" && formData.vendorInfo) {
        return {
          ...baseVariables,
          companyName:
            formData.vendorInfo.companyName || baseVariables.companyName,
          businessType: formData.vendorInfo.businessType || "",
          serviceArea: formData.vendorInfo.serviceArea?.maxDistance || "10",
          contactPersonName: formData.vendorInfo.contactPerson?.name || "",
          contactPersonEmail: formData.vendorInfo.contactPerson?.email || "",
          contactPersonPhone: formData.vendorInfo.contactPerson?.phone || "",
          taxId: formData.vendorInfo.taxId || "",
          yearsInBusiness: formData.vendorInfo.yearsInBusiness || "",
        };
      }

      return baseVariables;
    },
    []
  );

  const {
    data: renderResponse,
    isLoading: isTemplateLoading,
    error: templateError,
  } = useQuery({
    queryKey: ["renderTemplate", client?.cuid, selectedTemplateType],
    queryFn: async () => {
      if (!client?.cuid || !selectedTemplateType || !currentFormData) {
        throw new Error("Missing required data for template rendering");
      }

      const templateVariables = getTemplateVariables(
        currentFormData,
        currentRole
      );
      const result = await emailTemplateService.renderTemplate(
        client.cuid,
        selectedTemplateType,
        templateVariables
      );

      return result;
    },
    enabled:
      !!client?.cuid &&
      !!selectedTemplateType &&
      !!currentFormData &&
      showPreview,
  });

  const getRenderedEmailContent = useCallback(() => {
    return renderResponse?.renderedHtml || "";
  }, [renderResponse]);

  return {
    showPreview,
    handleShowPreview,
    handleClosePreview,
    getRenderedEmailContent,
    setTemplateType,
    selectedTemplateType,
    isTemplateLoading,
    templateError,
  };
}
