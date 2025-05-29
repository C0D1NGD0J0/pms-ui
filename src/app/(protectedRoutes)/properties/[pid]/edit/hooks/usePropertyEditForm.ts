/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@store/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { extractChanges } from "@utils/helpers";
import { PropertyModel } from "@models/property";
import { propertyService } from "@services/property";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { usePropertyFormBase } from "@hooks/property/usePropertyFormBase";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  EditPropertyFormValues,
  IPropertyDocument,
  IPropertyModel,
} from "@interfaces/property.interface";

export function usePropertyEditForm(pid: string) {
  const router = useRouter();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();
  const [originalValues, setOriginalValues] =
    useState<EditPropertyFormValues | null>(null);

  const { data: propertyData, isLoading: isPropertyLoading } =
    useQuery<IPropertyModel>({
      enabled: !!pid && !!client?.csub,
      queryKey: PROPERTY_QUERY_KEYS.propertyById(client?.csub || "", pid),
      queryFn: () => propertyService.getClientProperty(client?.csub || "", pid),
    });

  const baseHook = usePropertyFormBase();
  const {
    form,
    activeTab,
    setActiveTab,
    formConfig,
    saveAddress,
    hasTabErrors,
    isConfigLoading,
    handleOnChange,
    propertyTypeOptions,
    propertyStatusOptions,
    occupancyStatusOptions,
    documentTypeOptions,

    isTabVisible,
    isFieldVisible,
    isFieldRequired,
    getFieldHelpText,
    propertyTypeUtils,
    currentPropertyType,
    currentTotalUnits,
  } = baseHook;

  const updatePropertyMutation = useMutation({
    mutationFn: (data: Partial<EditPropertyFormValues>) =>
      propertyService.updateClientProperty(client?.csub || "", pid, data),
    onError: (error: any) => {
      openNotification(
        "error",
        "Update Failed",
        error.message || "Failed to update property. Please try again."
      );
    },
  });

  useEffect(() => {
    if (propertyData) {
      const rawData: IPropertyDocument =
        propertyData instanceof PropertyModel
          ? propertyData.getRawData()
          : (propertyData as IPropertyDocument);
      console.log("Raw property data:", rawData);
      const transformedData = {
        name: rawData.name || "",
        cid: rawData.cid || "",
        status: rawData.status as any,
        managedBy: rawData.managedBy || "",
        yearBuilt: rawData.yearBuilt || 1800,
        propertyType: rawData.propertyType as any,
        address: rawData.address || undefined,
        financialDetails: {
          purchasePrice: rawData.financialDetails?.purchasePrice || 0,
          purchaseDate: rawData.financialDetails?.purchaseDate || "",
          marketValue: rawData.financialDetails?.marketValue || 0,
          propertyTax: rawData.financialDetails?.propertyTax || 0,
          lastAssessmentDate:
            rawData.financialDetails?.lastAssessmentDate || "",
        },
        fees: {
          currency: rawData.fees?.currency || "USD",
          taxAmount: rawData.fees?.taxAmount || 0,
          rentalAmount: rawData.fees?.rentalAmount || 0,
          managementFees: rawData.fees?.managementFees || 0,
          securityDeposit: rawData.fees?.securityDeposit || 0,
        },
        specifications: {
          totalArea: rawData.specifications?.totalArea || 0,
          lotSize: rawData.specifications?.lotSize || 0,
          bedrooms: rawData.specifications?.bedrooms || 0,
          bathrooms: rawData.specifications?.bathrooms || 0,
          floors: rawData.specifications?.floors || 1,
          garageSpaces: rawData.specifications?.garageSpaces || 0,
          maxOccupants: rawData.specifications?.maxOccupants || 1,
        },
        utilities: {
          water: rawData.utilities?.water || false,
          gas: rawData.utilities?.gas || false,
          electricity: rawData.utilities?.electricity || false,
          internet: rawData.utilities?.internet || false,
          trash: false,
          cableTV: rawData.utilities?.cableTV || false,
        },
        description: {
          text: rawData.description?.text || "",
          html: rawData.description?.html || "",
        },
        occupancyStatus: rawData.occupancyStatus as any,
        interiorAmenities: {
          airConditioning: rawData.interiorAmenities?.airConditioning || false,
          heating: rawData.interiorAmenities?.heating || false,
          washerDryer: rawData.interiorAmenities?.washerDryer || false,
          dishwasher: rawData.interiorAmenities?.dishwasher || false,
          fridge: rawData.interiorAmenities?.fridge || false,
          furnished: rawData.interiorAmenities?.furnished || false,
          storageSpace: rawData.interiorAmenities?.storageSpace || false,
        },
        communityAmenities: {
          swimmingPool: rawData.communityAmenities?.swimmingPool || false,
          fitnessCenter: rawData.communityAmenities?.fitnessCenter || false,
          elevator: rawData.communityAmenities?.elevator || false,
          parking: rawData.communityAmenities?.parking || false,
          securitySystem: rawData.communityAmenities?.securitySystem || false,
          petFriendly: rawData.communityAmenities?.petFriendly || false,
          laundryFacility: rawData.communityAmenities?.laundryFacility || false,
          doorman: rawData.communityAmenities?.doorman || false,
        },
        totalUnits: rawData.totalUnits || 0,
        documents: rawData.documents || [],
        propertyImages: [],
      };

      form.setValues(transformedData as unknown as EditPropertyFormValues);
      setOriginalValues(transformedData as unknown as EditPropertyFormValues);
    }
  }, [propertyData]);

  const handleSubmit = async (values: EditPropertyFormValues) => {
    if (!originalValues) {
      console.warn("Original values not available for comparison");
      return;
    }
    try {
      values.cid = client?.csub ?? "";
      const changedValues: Partial<EditPropertyFormValues | null> =
        extractChanges(originalValues, values, {
          ignoreKeys: ["cid"],
        });
      if (changedValues) {
        await updatePropertyMutation.mutateAsync(changedValues);
      }
      openNotification(
        "success",
        "Property Updated",
        "Property has been successfully updated."
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.propertyById(client?.csub || "", pid),
      });
      router.push("/properties");
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return {
    form,
    activeTab,
    formConfig,
    saveAddress,
    setActiveTab,
    hasTabErrors,
    propertyData,
    handleOnChange,
    isConfigLoading,
    isPropertyLoading,
    error: updatePropertyMutation.error,
    hasError: updatePropertyMutation.isError,
    handleSubmit: form.onSubmit(handleSubmit),
    isSuccess: updatePropertyMutation.isSuccess,
    successResponse: updatePropertyMutation.data,
    isSubmitting: updatePropertyMutation.isPending,
    documentTypeOptions,
    propertyTypeOptions,
    isLoading: isConfigLoading || isPropertyLoading,
    propertyStatusOptions,
    occupancyStatusOptions,
    // New property type aware features
    isTabVisible,
    isFieldVisible,
    isFieldRequired,
    getFieldHelpText,
    propertyTypeUtils,
    currentPropertyType,
    currentTotalUnits,
  };
}
