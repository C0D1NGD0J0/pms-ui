"use client";
import React from "react";
import { Loading } from "@components/Loading";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { usePropertyFormMetaData } from "@hooks/index";
import { usePropertyFormActions } from "@store/propertyform.store";
import {
  formFieldVisibilityMap,
  PropertyFormValues,
} from "@interfaces/property.interface";
import {
  FormField,
  FormLabel,
  FormInput,
  Checkbox,
  Textarea,
  Select,
} from "@components/FormElements";

interface Props {
  form: UseFormReturnType<PropertyFormValues>;
  propertyTypeOptions: { value: string; label: string }[];
  propertyStatusOptions: { value: string; label: string }[];
  handleOnChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | string
  ) => void;
}

export function PropertyInfoTab({
  form,
  propertyTypeOptions: _propertyTypeOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
  propertyStatusOptions: _propertyStatusOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
  handleOnChange,
}: Props) {
  const { setTabValidation } = usePropertyFormActions();
  const { data: formConfig, isLoading: isFormConfigLoading } =
    usePropertyFormMetaData();

  const propertyType = form.values.propertyType || "house";
  const visibleFields = formFieldVisibilityMap[
    propertyType as keyof typeof formFieldVisibilityMap
  ] || ["totalArea"];

  const isFieldVisible = (fieldName: string) => {
    return visibleFields.includes(fieldName);
  };

  React.useEffect(() => {
    const isValid = formConfig?.specifications?.totalArea?.isRequired
      ? !!form.values.specifications.totalArea
      : true;

    setTabValidation("property", isValid);
  }, [form.values.specifications, formConfig, setTabValidation]);

  if (isFormConfigLoading) {
    return <Loading size="regular" description="Gathering form data..." />;
  }

  const occupancyStatusOptions =
    formConfig?.occupancyStatuses.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
    })) || [];

  return (
    <>
      <FormSection
        title="Property Specifications"
        description={`Enter detailed specifications for this ${propertyType}`}
      >
        <div className="form-fields">
          {isFieldVisible("totalArea") && (
            <FormField
              error={{
                msg: (form.errors["specifications.totalArea"] as string) || "",
                touched: form.isTouched("specifications.totalArea"),
              }}
            >
              <FormLabel
                htmlFor="totalArea"
                label="Total Area (sq ft)"
                required={formConfig?.specifications?.totalArea?.isRequired}
              />
              <FormInput
                id="totalArea"
                name="specifications.totalArea"
                type="number"
                value={form.values.specifications.totalArea.toString()}
                onChange={handleOnChange}
                placeholder="Enter total area"
                min={
                  formConfig?.specifications?.totalArea?.min?.toString() || "0"
                }
                hasError={!!form.errors["specifications.totalArea"]}
              />
            </FormField>
          )}

          {isFieldVisible("lotSize") && (
            <FormField
              error={{
                msg: (form.errors["specifications.lotSize"] as string) || "",
                touched: form.isTouched("specifications.lotSize"),
              }}
            >
              <FormLabel
                htmlFor="lotSize"
                label="Lot Size (sq ft)"
                required={formConfig?.specifications?.lotSize?.isRequired}
              />
              <FormInput
                id="lotSize"
                name="specifications.lotSize"
                type="number"
                value={form.values.specifications.lotSize?.toString() || ""}
                onChange={handleOnChange}
                placeholder="Enter lot size"
                min={
                  formConfig?.specifications?.lotSize?.min?.toString() || "0"
                }
                hasError={!!form.errors["specifications.lotSize"]}
              />
            </FormField>
          )}
        </div>

        <div className="form-fields">
          {isFieldVisible("bedrooms") && (
            <FormField
              error={{
                msg: (form.errors["specifications.bedrooms"] as string) || "",
                touched: form.isTouched("specifications.bedrooms"),
              }}
            >
              <FormLabel
                htmlFor="bedrooms"
                label="Bedrooms"
                required={formConfig?.specifications?.bedrooms?.isRequired}
              />
              <FormInput
                id="bedrooms"
                name="specifications.bedrooms"
                type="number"
                value={form.values.specifications.bedrooms.toString()}
                onChange={handleOnChange}
                placeholder="Enter number of bedrooms"
                min={
                  formConfig?.specifications?.bedrooms?.min?.toString() || "0"
                }
                hasError={!!form.errors["specifications.bedrooms"]}
              />
            </FormField>
          )}

          {isFieldVisible("bathrooms") && (
            <FormField
              error={{
                msg: (form.errors["specifications.bathrooms"] as string) || "",
                touched: form.isTouched("specifications.bathrooms"),
              }}
            >
              <FormLabel
                htmlFor="bathrooms"
                label="Bathrooms"
                required={formConfig?.specifications?.bathrooms?.isRequired}
              />
              <FormInput
                id="bathrooms"
                name="specifications.bathrooms"
                type="number"
                value={form.values.specifications.bathrooms.toString()}
                onChange={handleOnChange}
                placeholder="Enter number of bathrooms"
                min={
                  formConfig?.specifications?.bathrooms?.min?.toString() || "0"
                }
                step="0.5"
                hasError={!!form.errors["specifications.bathrooms"]}
              />
            </FormField>
          )}
        </div>

        {isFieldVisible("floors") && isFieldVisible("garageSpaces") && (
          <div className="form-fields">
            <FormField
              error={{
                msg: (form.errors["specifications.floors"] as string) || "",
                touched: form.isTouched("specifications.floors"),
              }}
            >
              <FormLabel
                htmlFor="floors"
                label="Floors"
                required={formConfig?.specifications?.floors?.isRequired}
              />
              <FormInput
                id="floors"
                name="specifications.floors"
                type="number"
                value={form.values.specifications.floors.toString()}
                onChange={handleOnChange}
                placeholder="Enter number of floors"
                min={formConfig?.specifications?.floors?.min?.toString() || "1"}
                hasError={!!form.errors["specifications.floors"]}
              />
            </FormField>
            <FormField
              error={{
                msg:
                  (form.errors["specifications.garageSpaces"] as string) || "",
                touched: form.isTouched("specifications.garageSpaces"),
              }}
            >
              <FormLabel
                htmlFor="garageSpaces"
                label="Garage Spaces"
                required={formConfig?.specifications?.garageSpaces?.isRequired}
              />
              <FormInput
                id="garageSpaces"
                name="specifications.garageSpaces"
                type="number"
                value={form.values.specifications.garageSpaces.toString()}
                onChange={handleOnChange}
                placeholder="Enter number of garage spaces"
                min={
                  formConfig?.specifications?.garageSpaces?.min?.toString() ||
                  "0"
                }
                hasError={!!form.errors["specifications.garageSpaces"]}
              />
            </FormField>
          </div>
        )}

        {isFieldVisible("maxOccupants") && (
          <div className="form-fields">
            <FormField
              error={{
                msg:
                  (form.errors["specifications.maxOccupants"] as string) || "",
                touched: form.isTouched("specifications.maxOccupants"),
              }}
            >
              <FormLabel
                htmlFor="maxOccupants"
                label="Maximum Occupants"
                required={formConfig?.specifications?.maxOccupants?.isRequired}
              />
              <FormInput
                type="number"
                id="maxOccupants"
                onChange={handleOnChange}
                name="specifications.maxOccupants"
                placeholder="Enter maximum number of occupants"
                value={form.values.specifications?.maxOccupants || 0}
                min={
                  formConfig?.specifications?.maxOccupants?.min?.toString() ||
                  "1"
                }
                hasError={!!form.errors["specifications.maxOccupants"]}
              />
            </FormField>
          </div>
        )}
      </FormSection>

      <FormSection
        title="Occupancy Information"
        description="Enter current occupancy details"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["occupancyStatus"] as string) || "",
              touched: form.isTouched("occupancyStatus"),
            }}
          >
            <FormLabel htmlFor="occupancyStatus" label="Occupancy Status" />
            <Select
              id="occupancyStatus"
              name="occupancyStatus"
              onChange={handleOnChange}
              options={occupancyStatusOptions}
              placeholder="Select occupancy status"
              value={form.values.occupancyStatus || ""}
            />
          </FormField>
          {isFieldVisible("totalUnits") && (
            <FormField
              error={{
                msg: (form.errors["totalUnits"] as string) || "",
                touched: form.isTouched("totalUnits"),
              }}
            >
              <FormLabel htmlFor="totalUnits" label="Total Units" />
              <FormInput
                id="totalUnits"
                name="totalUnits"
                type="number"
                value={form.values.totalUnits.toString()}
                onChange={handleOnChange}
                placeholder="Enter total building units"
                min="0"
                max="250"
                hasError={!!form.errors["totalUnits"]}
              />
            </FormField>
          )}
        </div>
      </FormSection>

      {["house", "townhouse", "apartment", "condominium"].includes(
        propertyType
      ) && (
        <FormSection
          title="Utilities"
          description="Select utilities included with the property"
        >
          <div className="form-fields checkbox-fields">
            <FormField>
              <Checkbox
                id="water"
                name="utilities.water"
                checked={form.values.utilities.water}
                onChange={handleOnChange}
                label="Water"
              />
            </FormField>
            <FormField>
              <Checkbox
                id="gas"
                name="utilities.gas"
                checked={form.values.utilities.gas}
                onChange={handleOnChange}
                label="Gas"
              />
            </FormField>
            <FormField>
              <Checkbox
                id="electricity"
                name="utilities.electricity"
                checked={form.values.utilities.electricity}
                onChange={handleOnChange}
                label="Electricity"
              />
            </FormField>
            <FormField>
              <Checkbox
                id="internet"
                name="utilities.internet"
                checked={form.values.utilities.internet}
                onChange={handleOnChange}
                label="Internet"
              />
            </FormField>
            <FormField>
              <Checkbox
                id="trash"
                name="utilities.trash"
                checked={form.values.utilities.trash}
                onChange={handleOnChange}
                label="Trash"
              />
            </FormField>
            <FormField>
              <Checkbox
                id="cableTV"
                name="utilities.cableTV"
                checked={form.values.utilities.cableTV}
                onChange={handleOnChange}
                label="Cable TV"
              />
            </FormField>
          </div>
        </FormSection>
      )}

      <FormSection
        title="Property Description"
        description="Enter a detailed description of the property"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["description.text"] as string) || "",
              touched: form.isTouched("description.text"),
            }}
          >
            <FormLabel htmlFor="descriptionText" label="Description" />
            <Textarea
              id="descriptionText"
              name="description.text"
              onChange={handleOnChange}
              value={form.values.description.text || ""}
              placeholder="Enter property description"
              rows={5}
            />
            <small className="form-help-text">
              Plain text will be automatically converted to HTML for display
              purposes.
            </small>
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
