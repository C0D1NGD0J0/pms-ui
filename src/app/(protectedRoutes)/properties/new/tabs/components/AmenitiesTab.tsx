"use client";
import React, { useState } from "react";
import { FormSection } from "@components/FormLayout";
import { FormField, Checkbox } from "@components/FormElements";

export function AmenitiesTab() {
  // State for form data
  const [formData, setFormData] = useState({
    interiorAmenities: {
      airConditioning: false,
      heating: false,
      washerDryer: false,
      dishwasher: false,
      fireplace: false,
      hardwoodFloors: false,
      furnished: false,
      storageSpace: false,
      walkInCloset: false,
    },
    exteriorAmenities: {
      swimmingPool: false,
      fitnessCenter: false,
      elevator: false,
      balconyPatio: false,
      parking: false,
      garden: false,
      securitySystem: false,
      playground: false,
    },
    communityAmenities: {
      petFriendly: false,
      clubhouse: false,
      bbqArea: false,
      laundryFacility: false,
      doorman: false,
    },
  });

  // Handle checkbox change for amenities
  const handleCheckboxChange =
    (
      section: "interiorAmenities" | "exteriorAmenities" | "communityAmenities",
      name: string
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: checked,
        },
      }));
    };

  return (
    <>
      {/* Interior Amenities section */}
      <FormSection
        title="Interior Amenities"
        description="Select interior amenities available in the property"
      >
        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="airConditioning"
              name="airConditioning"
              checked={formData.interiorAmenities.airConditioning}
              onChange={handleCheckboxChange(
                "interiorAmenities",
                "airConditioning"
              )}
              label="Air Conditioning"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="heating"
              name="heating"
              checked={formData.interiorAmenities.heating}
              onChange={handleCheckboxChange("interiorAmenities", "heating")}
              label="Heating"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="washerDryer"
              name="washerDryer"
              checked={formData.interiorAmenities.washerDryer}
              onChange={handleCheckboxChange(
                "interiorAmenities",
                "washerDryer"
              )}
              label="Washer/Dryer"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="dishwasher"
              name="dishwasher"
              checked={formData.interiorAmenities.dishwasher}
              onChange={handleCheckboxChange("interiorAmenities", "dishwasher")}
              label="Dishwasher"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="fireplace"
              name="fireplace"
              checked={formData.interiorAmenities.fireplace}
              onChange={handleCheckboxChange("interiorAmenities", "fireplace")}
              label="Fireplace"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="hardwoodFloors"
              name="hardwoodFloors"
              checked={formData.interiorAmenities.hardwoodFloors}
              onChange={handleCheckboxChange(
                "interiorAmenities",
                "hardwoodFloors"
              )}
              label="Hardwood Floors"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="furnished"
              name="furnished"
              checked={formData.interiorAmenities.furnished}
              onChange={handleCheckboxChange("interiorAmenities", "furnished")}
              label="Furnished"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="storageSpace"
              name="storageSpace"
              checked={formData.interiorAmenities.storageSpace}
              onChange={handleCheckboxChange(
                "interiorAmenities",
                "storageSpace"
              )}
              label="Storage Space"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="walkInCloset"
              name="walkInCloset"
              checked={formData.interiorAmenities.walkInCloset}
              onChange={handleCheckboxChange(
                "interiorAmenities",
                "walkInCloset"
              )}
              label="Walk-in Closet"
            />
          </FormField>
        </div>
      </FormSection>

      {/* Exterior Amenities section */}
      <FormSection
        title="Exterior Amenities"
        description="Select exterior amenities available with the property"
      >
        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="swimmingPool"
              name="swimmingPool"
              checked={formData.exteriorAmenities.swimmingPool}
              onChange={handleCheckboxChange(
                "exteriorAmenities",
                "swimmingPool"
              )}
              label="Swimming Pool"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="fitnessCenter"
              name="fitnessCenter"
              checked={formData.exteriorAmenities.fitnessCenter}
              onChange={handleCheckboxChange(
                "exteriorAmenities",
                "fitnessCenter"
              )}
              label="Fitness Center"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="elevator"
              name="elevator"
              checked={formData.exteriorAmenities.elevator}
              onChange={handleCheckboxChange("exteriorAmenities", "elevator")}
              label="Elevator"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="balconyPatio"
              name="balconyPatio"
              checked={formData.exteriorAmenities.balconyPatio}
              onChange={handleCheckboxChange(
                "exteriorAmenities",
                "balconyPatio"
              )}
              label="Balcony/Patio"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="parking"
              name="parking"
              checked={formData.exteriorAmenities.parking}
              onChange={handleCheckboxChange("exteriorAmenities", "parking")}
              label="Parking"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="garden"
              name="garden"
              checked={formData.exteriorAmenities.garden}
              onChange={handleCheckboxChange("exteriorAmenities", "garden")}
              label="Garden"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="securitySystem"
              name="securitySystem"
              checked={formData.exteriorAmenities.securitySystem}
              onChange={handleCheckboxChange(
                "exteriorAmenities",
                "securitySystem"
              )}
              label="Security System"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="playground"
              name="playground"
              checked={formData.exteriorAmenities.playground}
              onChange={handleCheckboxChange("exteriorAmenities", "playground")}
              label="Playground"
            />
          </FormField>
        </div>
      </FormSection>

      {/* Community Amenities section */}
      <FormSection
        title="Community Amenities"
        description="Select community amenities available near the property"
      >
        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="petFriendly"
              name="petFriendly"
              checked={formData.communityAmenities.petFriendly}
              onChange={handleCheckboxChange(
                "communityAmenities",
                "petFriendly"
              )}
              label="Pet Friendly"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="clubhouse"
              name="clubhouse"
              checked={formData.communityAmenities.clubhouse}
              onChange={handleCheckboxChange("communityAmenities", "clubhouse")}
              label="Clubhouse"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="bbqArea"
              name="bbqArea"
              checked={formData.communityAmenities.bbqArea}
              onChange={handleCheckboxChange("communityAmenities", "bbqArea")}
              label="BBQ Area"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="laundryFacility"
              name="laundryFacility"
              checked={formData.communityAmenities.laundryFacility}
              onChange={handleCheckboxChange(
                "communityAmenities",
                "laundryFacility"
              )}
              label="Laundry Facility"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="doorman"
              name="doorman"
              checked={formData.communityAmenities.doorman}
              onChange={handleCheckboxChange("communityAmenities", "doorman")}
              label="Doorman"
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
