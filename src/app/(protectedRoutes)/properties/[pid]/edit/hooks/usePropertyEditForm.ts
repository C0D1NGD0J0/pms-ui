/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@store/index";
import { useEffect, useState } from "react";
import { extractChanges } from "@utils/helpers";
import { propertyService } from "@services/property";
import { useNotification } from "@hooks/useNotification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EditPropertyFormValues } from "@interfaces/property.interface";
import { usePropertyFormBase } from "@hooks/property/usePropertyFormBase";

export function usePropertyEditForm(pid: string) {
  const { client } = useAuth();
  const { openNotification } = useNotification();
  const [originalValues, setOriginalValues] =
    useState<EditPropertyFormValues | null>(null);

  const { data: propertyData, isLoading: isPropertyLoading } = useQuery({
    queryKey: ["/property", pid],
    enabled: !!pid && !!client?.csub,
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
  } = baseHook;

  const updatePropertyMutation = useMutation({
    mutationFn: (data: Partial<EditPropertyFormValues>) =>
      propertyService.updateClientProperty(client?.csub || "", pid, data),
    onSuccess: () => {
      openNotification(
        "success",
        "Property Updated",
        "Property has been successfully updated."
      );
    },
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
      const transformedData: EditPropertyFormValues = {
        name: propertyData.name || "",
        cid: propertyData.cid || "",
        status: propertyData.status as any,
        managedBy: propertyData.managedBy || "",
        yearBuilt: propertyData.yearBuilt || 1800,
        propertyType: propertyData.propertyType as any,
        // address: {
        //   fullAddress: propertyData.address?.fullAddress || "",
        //   city: propertyData.address?.city || "",
        //   state: propertyData.address?.state || "",
        //   postCode: propertyData.address?.postCode || "",
        //   country: propertyData.address?.country || "",
        //   unitNumber: propertyData.address?.unitNumber || "",
        //   street: propertyData.address?.street || "",
        //   streetNumber: propertyData.address?.streetNumber || "",
        //   coordinates: propertyData.address?.coordinates,
        // },
        address: {
          fullAddress: "55 Water St, Brooklyn, NY 11201, USA",
          city: "",
          state: "New York",
          postCode: "11201",
          country: "United States",
          unitNumber: "",
          street: "Water Street",
          streetNumber: "55",
          coordinates: [40.7033634, -73.9916659],
        },
        financialDetails: {
          purchasePrice: 0,
          purchaseDate: "",
          marketValue: 0,
          propertyTax: 0,
          lastAssessmentDate: "",
        },
        fees: {
          currency: propertyData.fees?.currency || "USD",
          taxAmount: propertyData.fees?.taxAmount || "0",
          rentalAmount: propertyData.fees?.rentalAmount || "0",
          managementFees: propertyData.fees?.managementFees || "0",
          securityDeposit: propertyData.fees?.securityDeposit || "0",
        },
        specifications: {
          totalArea: propertyData.specifications?.totalArea || 0,
          lotSize: propertyData.specifications?.lotSize || 0,
          bedrooms: propertyData.specifications?.bedrooms || 0,
          bathrooms: propertyData.specifications?.bathrooms || 0,
          floors: propertyData.specifications?.floors || 1,
          garageSpaces: propertyData.specifications?.garageSpaces || 0,
          maxOccupants: propertyData.specifications?.maxOccupants || 1,
        },
        utilities: {
          water: propertyData.utilities?.water || false,
          gas: propertyData.utilities?.gas || false,
          electricity: propertyData.utilities?.electricity || false,
          internet: propertyData.utilities?.internet || false,
          trash: false,
          cableTV: propertyData.utilities?.cableTV || false,
        },
        description: {
          text: propertyData.description?.text || "",
          html: propertyData.description?.html || "",
        },
        occupancyStatus: propertyData.occupancyStatus as any,
        interiorAmenities: {
          airConditioning:
            propertyData.interiorAmenities?.airConditioning || false,
          heating: propertyData.interiorAmenities?.heating || false,
          washerDryer: propertyData.interiorAmenities?.washerDryer || false,
          dishwasher: propertyData.interiorAmenities?.dishwasher || false,
          fridge: propertyData.interiorAmenities?.fridge || false,
          furnished: propertyData.interiorAmenities?.furnished || false,
          storageSpace: propertyData.interiorAmenities?.storageSpace || false,
        },
        communityAmenities: {
          swimmingPool: propertyData.communityAmenities?.swimmingPool || false,
          fitnessCenter:
            propertyData.communityAmenities?.fitnessCenter || false,
          elevator: propertyData.communityAmenities?.elevator || false,
          parking: propertyData.communityAmenities?.parking || false,
          securitySystem:
            propertyData.communityAmenities?.securitySystem || false,
          petFriendly: propertyData.communityAmenities?.petFriendly || false,
          laundryFacility:
            propertyData.communityAmenities?.laundryFacility || false,
          doorman: propertyData.communityAmenities?.doorman || false,
        },
        totalUnits: propertyData.totalUnits || 0,
        documents: propertyData.documents || [],
        propertyImages: [],
      };

      form.setValues(transformedData);
      setOriginalValues(transformedData);
    }
  }, [propertyData]);

  const handleSubmit = async (values: EditPropertyFormValues) => {
    if (!originalValues) {
      console.warn("Original values not available for comparison");
      return;
    }
    try {
      values.cid = client?.csub ?? "";
      const changedValues = extractChanges(originalValues, values);

      const changes = changedValues || {};
      const dataToSubmit: Partial<EditPropertyFormValues> = {
        cid: client?.csub ?? "",
        ...changes,
      };
      await updatePropertyMutation.mutateAsync(dataToSubmit);
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
    propertyData,
    handleOnChange,
    isConfigLoading,
    isPropertyLoading,
    hasTabErrors,
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
  };
}
