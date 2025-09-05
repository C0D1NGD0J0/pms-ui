import { useAuth } from "@store/index";
import { useEffect, useState } from "react";
import { userService } from "@services/users";
import { extractChanges } from "@utils/helpers";
import { UseFormReturnType } from "@mantine/form";
import { USER_QUERY_KEYS } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ProfileFormValues } from "@validations/profile.validations";

import { useGetProfileInfo } from "./useGetUserProfile";

export function useProfileEditForm({
  profileForm,
  uid,
}: {
  profileForm: UseFormReturnType<ProfileFormValues>;
  uid?: string;
}) {
  const { user, client } = useAuth();
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();
  const [originalValues, setOriginalValues] =
    useState<ProfileFormValues | null>(null);

  const targetUid = uid || user?.uid || "";

  // Use existing profile data hook
  const {
    data: profileApiData,
    isLoading: isDataLoading,
    error,
  } = useGetProfileInfo(client?.cuid || "", targetUid);

  useEffect(() => {
    if (profileApiData) {
      const profile = profileApiData;

      const formValues: ProfileFormValues = {
        personalInfo: {
          firstName: profile.personalInfo?.firstName || "",
          lastName: profile.personalInfo?.lastName || "",
          displayName: profile.personalInfo?.displayName || "",
          email: profile.personalInfo?.email || "",
          location: profile.personalInfo?.location || "",
          dob: profile.personalInfo?.dob
            ? new Date(profile.personalInfo.dob)
            : null,
          avatar: {
            url: profile.personalInfo?.avatar?.url || "",
          },
          phoneNumber: profile.personalInfo?.phoneNumber || "",
          bio: profile.personalInfo?.about || profile.personalInfo?.bio || "",
          headline: profile.personalInfo?.headline || "",
        },
        settings: {
          theme: profile.settings?.theme || "light",
          loginType: profile.settings?.loginType || "password",
          timeZone: profile.settings?.timeZone || "UTC",
          lang: profile.settings?.lang || "en",
          notifications: {
            messages: profile.settings?.notifications?.messages || false,
            comments: profile.settings?.notifications?.comments || false,
            announcements:
              profile.settings?.notifications?.announcements || false,
          },
          gdprSettings: {
            dataRetentionPolicy:
              profile.settings?.gdprSettings?.dataRetentionPolicy || "standard",
            dataProcessingConsent:
              profile.settings?.gdprSettings?.dataProcessingConsent || false,
          },
        },
        identification: {
          idType: profile.identification?.idType || "passport",
          issueDate: profile.identification?.issueDate
            ? new Date(profile.identification.issueDate)
            : null,
          expiryDate: profile.identification?.expiryDate
            ? new Date(profile.identification.expiryDate)
            : null,
          idNumber: profile.identification?.idNumber || "",
          authority: profile.identification?.authority || "",
          issuingState: profile.identification?.issuingState || "",
        },
        employeeInfo: {
          jobTitle: profile.employeeInfo?.jobTitle || "",
          department: profile.employeeInfo?.department || "",
          reportsTo: profile.employeeInfo?.reportsTo || "",
          employeeId: profile.employeeInfo?.employeeId || "",
          startDate: profile.employeeInfo?.startDate
            ? new Date(profile.employeeInfo.startDate)
            : null,
          permissions: profile.roles || [],
        },
        vendorInfo: {
          vendorId: profile.vendorInfo?.vendorId || "",
          linkedVendorUid: profile.vendorInfo?.linkedVendorUid || "",
          isLinkedAccount: profile.vendorInfo?.isLinkedAccount || false,
        },
        documents: { items: [] },
        // profile.documents?.map((doc: any) => ({
        //   id: doc.id || "",
        //   name: doc.name || "",
        //   type: doc.type || "",
        //   file: doc.file || undefined,
        //   url: doc.url || "",
        //   filename: doc.filename || "",
        //   key: doc.key || "",
        //   uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt) : null,
        //   expiryDate: doc.expiryDate ? new Date(doc.expiryDate) : null,
        //   status: doc.status || "uploaded",
        // })) || [],
      };

      profileForm.setValues(formValues);
      setOriginalValues(formValues);
    }
  }, [profileApiData]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ProfileFormValues>) => {
      if (!client?.cuid) {
        throw new Error("Client ID is required");
      }
      return userService.updateUserProfile(client.cuid, targetUid, data as any);
    },
    onError: (error: any) => {
      openNotification(
        "error",
        "Update Failed",
        error.message || "Failed to update profile. Please try again."
      );
    },
  });

  const handleUpdateSubmit = async (values: ProfileFormValues) => {
    if (!originalValues) {
      console.warn("Original values not available for comparison");
      return;
    }

    try {
      const changedValues: Partial<ProfileFormValues | null> = extractChanges(
        originalValues,
        values,
        {
          ignoreKeys: ["personalInfo.avatar.isUploading"], // Ignore upload state
        }
      );

      if (changedValues && Object.keys(changedValues).length > 0) {
        await updateProfileMutation.mutateAsync(changedValues);

        openNotification(
          "success",
          "Profile Updated",
          "Your profile has been successfully updated."
        );

        if (client?.cuid) {
          queryClient.invalidateQueries({
            queryKey: USER_QUERY_KEYS.getUserProfile(client.cuid, targetUid),
          });
        }

        setOriginalValues(values);
      } else {
        openNotification("info", "No Changes", "No changes detected to save.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return {
    isDataLoading,
    profileData: profileApiData,
    hasError: updateProfileMutation.isError,
    isSuccess: updateProfileMutation.isSuccess,
    error: updateProfileMutation.error || error,
    successResponse: updateProfileMutation.data,
    isSubmitting: updateProfileMutation.isPending,
    handleUpdate: profileForm.onSubmit(handleUpdateSubmit),
  };
}
