import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { userService } from "@services/users";
import { extractChanges } from "@utils/helpers";
import { USER_QUERY_KEYS } from "@utils/constants";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  defaultProfileValues,
  ProfileFormValues,
  profileSchema,
} from "@validations/profile.validations";

interface UseUserProfileEditFormProps {
  cuid: string;
  uid: string;
  userType: "employee" | "vendor";
  userData: any; // Employee or Vendor response
}

export function useUserProfileEditForm({
  cuid,
  uid,
  userType,
  userData,
}: UseUserProfileEditFormProps) {
  const queryClient = useQueryClient();
  const { message } = useNotification();
  const [originalValues, setOriginalValues] = useState<any>(null);

  const form = useForm<ProfileFormValues>({
    initialValues: defaultProfileValues,
    validateInputOnBlur: true,
    validateInputOnChange: false,
    validate: zodResolver(profileSchema.partial()),
  });

  useEffect(() => {
    if (userData?.profile) {
      const formValues: ProfileFormValues = {
        personalInfo: {
          firstName: userData.profile.firstName || "",
          lastName: userData.profile.lastName || "",
          displayName:
            userData.profile.displayName || userData.profile.fullName || "",
          email: userData.profile.email || "",
          phoneNumber: userData.profile.phoneNumber || "",
          location: (userData.profile as any).location || "",
          dob: null,
          avatar: {
            url: userData.profile.avatar?.url || "",
            filename: "",
            key: "",
          },
          bio: (userData.profile as any).about || "",
          headline: "",
        },
        settings: {
          theme: (userData.profile as any).settings?.theme || "light",
          loginType:
            (userData.profile as any).settings?.loginType || "password",
          timeZone: (userData.profile as any).settings?.timeZone || "UTC",
          lang: (userData.profile as any).settings?.lang || "en",
          notifications: {
            messages:
              (userData.profile as any).settings?.notifications?.messages ??
              false,
            comments:
              (userData.profile as any).settings?.notifications?.comments ??
              false,
            announcements:
              (userData.profile as any).settings?.notifications
                ?.announcements ?? false,
          },
          gdprSettings: {
            dataRetentionPolicy:
              (userData.profile as any).settings?.gdprSettings
                ?.dataRetentionPolicy || "standard",
            dataProcessingConsent:
              (userData.profile as any).settings?.gdprSettings
                ?.dataProcessingConsent ?? false,
          },
        },
        identification: {
          idType: "passport",
          issueDate: null,
          expiryDate: null,
          idNumber: "",
          authority: "",
          issuingState: "",
        },
        documents: {
          items: [],
        },
        employeeInfo: {
          jobTitle:
            userType === "employee"
              ? userData.employeeInfo?.position || ""
              : "",
          department:
            userType === "employee"
              ? userData.employeeInfo?.department || ""
              : "",
          reportsTo:
            userType === "employee"
              ? userData.employeeInfo?.directManager || ""
              : "",
          employeeId:
            userType === "employee"
              ? userData.employeeInfo?.employeeId || ""
              : "",
          startDate:
            userType === "employee" && userData.employeeInfo?.hireDate
              ? new Date(userData.employeeInfo.hireDate)
              : null,
          permissions: [],
        },
        vendorInfo: {
          vendorId:
            userType === "vendor" ? userData.vendorInfo?.vendorId || "" : "",
          linkedVendorUid:
            userType === "vendor"
              ? userData.vendorInfo?.linkedVendorUid || ""
              : "",
          isLinkedAccount:
            userType === "vendor"
              ? userData.vendorInfo?.isLinkedAccount ?? false
              : false,
        },
      };

      form.setValues(formValues);
      setOriginalValues(formValues);
    }
  }, [userData, userType]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => userService.updateUserProfile(cuid, uid, data),
    onSuccess: () => {
      message.success(
        `${
          userType === "employee" ? "Employee" : "Vendor"
        } updated successfully!`
      );
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.getUserByUid(cuid, uid),
      });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEYS.getClientUsers, cuid],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          `Failed to update ${userType}`
      );
    },
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    if (!originalValues) {
      console.warn("Original values not available for comparison");
      return;
    }

    try {
      const changedData = extractChanges(originalValues, values, {
        ignoreKeys: ["identification", "documents", "vendorInfo"], // Don't compare these complex objects
      });

      if (!changedData || Object.keys(changedData).length === 0) {
        message.info("No changes detected");
        return;
      }

      // const profileUpdatePayload: any = {};

      // Personal info changes
      // if (changedData.personalInfo) {
      //   profileUpdatePayload.personalInfo = {
      //     firstName: values.personalInfo.firstName,
      //     lastName: values.personalInfo.lastName,
      //     phoneNumber: values.personalInfo.phoneNumber,
      //   };

      //   // Email goes in userInfo section
      //   if (values.personalInfo.email !== originalValues.personalInfo.email) {
      //     profileUpdatePayload.userInfo = {
      //       email: values.personalInfo.email,
      //     };
      //   }
      // }

      // // Employee info changes
      // if (changedData.employeeInfo && userType === "employee") {
      //   profileUpdatePayload.employeeInfo = {
      //     jobTitle: values.employeeInfo.jobTitle,
      //     department: values.employeeInfo.department,
      //     employeeId: values.employeeInfo.employeeId,
      //     reportsTo: values.employeeInfo.reportsTo,
      //     startDate: values.employeeInfo.startDate || undefined,
      //   };
      // }

      // // Vendor info changes (if we need to support this later)
      // if (changedData.vendorInfo && userType === "vendor") {
      //   profileUpdatePayload.vendorInfo = values.vendorInfo;
      // }

      // // Settings changes (though admins shouldn't edit user settings typically)
      // if (changedData.settings) {
      //   profileUpdatePayload.settings = {
      //     lang: values.settings.lang,
      //     timeZone: values.settings.timeZone,
      //   };
      // }

      await updateMutation.mutateAsync(changedData);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return {
    form,
    isSubmitting: updateMutation.isPending,
    handleSubmit: form.onSubmit(handleSubmit),
  };
}
