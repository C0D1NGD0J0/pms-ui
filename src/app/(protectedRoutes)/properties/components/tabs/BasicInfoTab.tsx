"use client";
import React, { ChangeEvent } from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { getComponentValue } from "@components/FormElements/GooglePlacesAutocomplete";
import {
  EditPropertyFormValues,
  PropertyFormValues,
} from "@interfaces/property.interface";
import {
  GooglePlacesAutocomplete,
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

interface Props {
  saveAddress: (address: EditPropertyFormValues["address"]) => void;
  form: UseFormReturnType<PropertyFormValues | EditPropertyFormValues>;
  propertyTypeOptions: { value: string; label: string }[];
  propertyStatusOptions: { value: string; label: string }[];
  handleOnChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string
  ) => void;
}

export function BasicInfoTab({
  form,
  saveAddress,
  propertyTypeOptions,
  propertyStatusOptions,
  handleOnChange,
}: Props) {
  const propertyManagerOptions = [
    { value: "1", label: "Jonathan Smith" },
    { value: "2", label: "Sarah Johnson" },
    { value: "3", label: "Michael Davis" },
  ];

  return (
    <>
      <FormSection
        title="Property Information"
        description="Enter basic information about the property"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["name"] as string) || "",
              touched: form.isTouched("name"),
            }}
          >
            <FormLabel htmlFor="name" label="Property Name" required />
            <FormInput
              id="name"
              name="name"
              required
              value={form.values.name}
              onChange={handleOnChange}
              hasError={!!form.errors.name}
              placeholder="Enter property name"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["propertyType"] as string) || "",
              touched: form.isTouched("propertyType"),
            }}
          >
            <FormLabel htmlFor="propertyType" label="Property Type" required />
            <Select
              id="propertyType"
              name="propertyType"
              onChange={handleOnChange}
              options={propertyTypeOptions}
              placeholder="Select property type"
              value={form.values.propertyType || ""}
            />
          </FormField>
          <FormField
            error={{
              msg: (form.errors["status"] as string) || "",
              touched: form.isTouched("status"),
            }}
          >
            <FormLabel htmlFor="status" label="Property Status" required />
            <Select
              id="status"
              name="status"
              onChange={handleOnChange}
              placeholder="Select status"
              options={propertyStatusOptions}
              value={form.values.status || ""}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["managedBy"] as string) || "",
              touched: form.isTouched("managedBy"),
            }}
          >
            <FormLabel htmlFor="managedBy" label="Property Manager" />
            <Select
              id="managedBy"
              name="managedBy"
              value={form.values.managedBy || ""}
              onChange={handleOnChange}
              options={propertyManagerOptions}
              placeholder="Assign property manager"
            />
          </FormField>
          <FormField
            error={{
              msg: (form.errors["yearBuilt"] as string) || "",
              touched: form.isTouched("yearBuilt"),
            }}
          >
            <FormLabel htmlFor="yearBuilt" label="Year Built" />
            <FormInput
              id="yearBuilt"
              name="yearBuilt"
              type="number"
              value={form.values.yearBuilt}
              onChange={handleOnChange}
              placeholder="Enter year built"
              min="1800"
              max={new Date().getFullYear() + 10}
              hasError={false}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Property Address"
        description="Enter the complete address of the property"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["address.fullAddress"] as string) || "",
              touched: form.isTouched("address.fullAddress"),
            }}
          >
            <FormLabel htmlFor="address" label="Street Address" required />
            <div
              className="address-helper-text"
              style={{
                fontSize: "0.75rem",
                color: "#6c757d",
                marginBottom: "0.25rem",
              }}
            >
              Please select an address from the dropdown after typing
            </div>
            <GooglePlacesAutocomplete
              id="address"
              onChange={handleOnChange}
              name="address.fullAddress"
              placeholder="Enter street address"
              value={form.values.address.fullAddress || ""}
              onPlaceSelected={(place) => {
                if (!place || !place.address_components) return;

                const addressComponents = place.address_components;
                const unitNumber = form.values.address.unitNumber || "";
                const address = {
                  fullAddress: place.formatted_address,
                  city:
                    getComponentValue(addressComponents, "locality") ||
                    getComponentValue(addressComponents, "postal_town"),
                  state: getComponentValue(
                    addressComponents,
                    "administrative_area_level_1"
                  ),
                  street: getComponentValue(addressComponents, "route"),
                  country: getComponentValue(addressComponents, "country"),
                  postCode: getComponentValue(addressComponents, "postal_code"),
                  coordinates: [
                    place.geometry.location.lat(),
                    place.geometry.location.lng(),
                  ],
                  streetNumber: addressComponents[0].long_name || "",
                  unitNumber,
                };
                saveAddress(address);
              }}
              hasError={!!form.errors["address.fullAddress"]}
            />
          </FormField>
        </div>
        {form.values.address.unitNumber && (
          <div className="form-fields">
            <FormField
              error={{
                msg: (form.errors["address.unitNumber"] as string) || "",
                touched: form.isTouched("address.unitNumber"),
              }}
            >
              <FormLabel
                htmlFor="unitNumber"
                label="Unit/Apartment (optional)"
              />
              <FormInput
                id="unitNumber"
                name="address.unitNumber"
                type="text"
                value={form.values.address.unitNumber || ""}
                readOnly
                disabled
                placeholder="Enter unit or apartment number"
                hasError={!!form.errors["address.unitNumber"]}
              />
            </FormField>
          </div>
        )}

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["address.city"] as string) || "",
              touched: form.isTouched("address.city"),
            }}
          >
            <FormLabel htmlFor="city" label="City" />
            <FormInput
              disabled
              id="city"
              type="text"
              readOnly
              name="address.city"
              placeholder="Enter city"
              value={form.values.address.city || ""}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="stateProvince" label="State/Province" />
            <FormInput
              disabled
              type="text"
              id="stateProvince"
              readOnly
              name="address.state"
              value={form.values.address.state || ""}
              placeholder="Enter state/province"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="postalCode" label="Postal Code" />
            <FormInput
              disabled
              id="postalCode"
              name="address.postCode"
              type="text"
              value={form.values.address.postCode || ""}
              onChange={() => "ffgcgfcfg"}
              placeholder="Enter postal code"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="country" label="Country" />
            <FormInput
              disabled
              type="text"
              id="country"
              readOnly
              name="address.country"
              placeholder="Enter country"
              value={form.values.address.country || ""}
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
