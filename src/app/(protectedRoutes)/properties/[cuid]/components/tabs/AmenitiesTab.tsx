"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { FormField, Checkbox } from "@components/FormElements";
import { PropertyFormValues } from "@interfaces/property.interface";

interface Props {
  propertyForm: UseFormReturnType<PropertyFormValues>;
  handleOnChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | string
  ) => void;
}

export function AmenitiesTab({ propertyForm: form, handleOnChange }: Props) {
  return (
    <>
      <FormSection
        title="Interior Amenities"
        description="Select interior amenities available in the property"
      >
        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="airConditioning"
              name="interiorAmenities.airConditioning"
              checked={form.values.interiorAmenities.airConditioning}
              onChange={handleOnChange}
              label="Air Conditioning"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="heating"
              name="interiorAmenities.heating"
              checked={form.values.interiorAmenities.heating}
              onChange={handleOnChange}
              label="Heating"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="washerDryer"
              name="interiorAmenities.washerDryer"
              checked={form.values.interiorAmenities.washerDryer}
              onChange={handleOnChange}
              label="Washer/Dryer"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="dishwasher"
              name="interiorAmenities.dishwasher"
              checked={form.values.interiorAmenities.dishwasher}
              onChange={handleOnChange}
              label="Dishwasher"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="fridge"
              name="interiorAmenities.fridge"
              checked={form.values.interiorAmenities.fridge}
              onChange={handleOnChange}
              label="Refrigerator"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="furnished"
              name="interiorAmenities.furnished"
              checked={form.values.interiorAmenities.furnished}
              onChange={handleOnChange}
              label="Furnished"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="storageSpace"
              name="interiorAmenities.storageSpace"
              checked={form.values.interiorAmenities.storageSpace}
              onChange={handleOnChange}
              label="Storage Space"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Exterior Amenities"
        description="Select exterior amenities available with the property"
      >
        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="swimmingPool"
              name="communityAmenities.swimmingPool"
              checked={form.values.communityAmenities.swimmingPool}
              onChange={handleOnChange}
              label="Swimming Pool"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="fitnessCenter"
              name="communityAmenities.fitnessCenter"
              checked={form.values.communityAmenities.fitnessCenter}
              onChange={handleOnChange}
              label="Fitness Center"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="elevator"
              name="communityAmenities.elevator"
              checked={form.values.communityAmenities.elevator}
              onChange={handleOnChange}
              label="Elevator"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="parking"
              name="communityAmenities.parking"
              checked={form.values.communityAmenities.parking}
              onChange={handleOnChange}
              label="Parking"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="securitySystem"
              name="communityAmenities.securitySystem"
              checked={form.values.communityAmenities.securitySystem}
              onChange={handleOnChange}
              label="Security System"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Community Amenities"
        description="Select community amenities available near the property"
      >
        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="petFriendly"
              name="communityAmenities.petFriendly"
              checked={form.values.communityAmenities.petFriendly}
              onChange={handleOnChange}
              label="Pet Friendly"
            />
          </FormField>

          <FormField>
            <Checkbox
              id="laundryFacility"
              name="communityAmenities.laundryFacility"
              checked={form.values.communityAmenities.laundryFacility}
              onChange={handleOnChange}
              label="Laundry Facility"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="doorman"
              name="communityAmenities.doorman"
              checked={form.values.communityAmenities.doorman}
              onChange={handleOnChange}
              label="Doorman"
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
