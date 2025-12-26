"use client";
import React, { useEffect } from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import { PropertyFormValues } from "@interfaces/property.interface";
import { usePropertyFormActions } from "@src/store/propertyform.store";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  TextArea,
  Tooltip,
  Select,
} from "@components/FormElements";

interface Props {
  permission: ReturnType<typeof useUnifiedPermissions>;
  formConfig: any;
  propertyForm: UseFormReturnType<PropertyFormValues>;
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
  propertyForm: form,
  propertyTypeOptions: _propertyTypeOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
  propertyStatusOptions: _propertyStatusOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
  handleOnChange,
  formConfig,
}: Props) {
  const { setTabValidation } = usePropertyFormActions();

  const propertyType = form.values.propertyType || "house";
  const numUnits = parseInt(form.values.maxAllowedUnits?.toString() || "1", 10);

  const isFieldVisible = (fieldName: string) => {
    return PropertyTypeManager.isFieldVisible(
      propertyType,
      fieldName,
      numUnits
    );
  };

  useEffect(() => {
    const isValid = formConfig?.specifications?.totalArea?.isRequired
      ? !!form.values.specifications.totalArea
      : true;

    setTabValidation("property", isValid);
  }, [form.values.specifications, formConfig, setTabValidation]);

  const occupancyStatusOptions =
    formConfig?.occupancyStatuses.map((status: string) => ({
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
                required={PropertyTypeManager.isFieldRequired(
                  propertyType,
                  "totalArea"
                )}
              />
              <FormInput
                id="totalArea"
                name="specifications.totalArea"
                type="number"
                value={form.values.specifications?.totalArea}
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue("specifications.totalArea", Number(value));
                }}
                placeholder="Enter total area"
                min={formConfig?.specifications?.totalArea?.min}
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
                required={PropertyTypeManager.isFieldRequired(
                  propertyType,
                  "lotSize"
                )}
              />
              <FormInput
                id="lotSize"
                name="specifications.lotSize"
                type="number"
                value={form.values.specifications.lotSize}
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue(
                    "specifications.lotSize",
                    parseInt(value, 10)
                  );
                }}
                placeholder="Enter lot size"
                min={formConfig?.specifications?.lotSize?.min}
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
                required={PropertyTypeManager.isFieldRequired(
                  propertyType,
                  "bedrooms"
                )}
              />
              <FormInput
                id="bedrooms"
                name="specifications.bedrooms"
                type="number"
                value={form.values.specifications.bedrooms}
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue("specifications.bedrooms", Number(value));
                }}
                placeholder="Enter number of bedrooms"
                min={formConfig?.specifications?.bedrooms?.min}
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
                required={PropertyTypeManager.isFieldRequired(
                  propertyType,
                  "bathrooms"
                )}
              />
              <FormInput
                id="bathrooms"
                name="specifications.bathrooms"
                type="number"
                value={form.values.specifications.bathrooms}
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue("specifications.bathrooms", Number(value));
                }}
                placeholder="Enter number of bathrooms"
                min={formConfig?.specifications?.bathrooms?.min}
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
                required={PropertyTypeManager.isFieldRequired(
                  propertyType,
                  "floors"
                )}
              />
              <FormInput
                id="floors"
                name="specifications.floors"
                type="number"
                value={form.values.specifications.floors}
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue("specifications.floors", Number(value));
                }}
                placeholder="Enter number of floors"
                min={formConfig?.specifications?.floors?.min}
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
                required={PropertyTypeManager.isFieldRequired(
                  propertyType,
                  "garageSpaces"
                )}
              />
              <FormInput
                id="garageSpaces"
                name="specifications.garageSpaces"
                type="number"
                value={form.values.specifications.garageSpaces}
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue(
                    "specifications.garageSpaces",
                    Number(value)
                  );
                }}
                placeholder="Enter number of garage spaces"
                min={formConfig?.specifications?.garageSpaces?.min}
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
                required={PropertyTypeManager.isFieldRequired(
                  propertyType,
                  "maxOccupants"
                )}
              />
              <FormInput
                type="number"
                id="maxOccupants"
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue(
                    "specifications.maxOccupants",
                    Number(value)
                  );
                }}
                name="specifications.maxOccupants"
                placeholder="Enter maximum number of occupants"
                value={form.values.specifications?.maxOccupants}
                min={formConfig?.specifications?.maxOccupants?.min}
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
          <FormField
            error={{
              msg: (form.errors["maxAllowedUnits"] as string) || "",
              touched: form.isTouched("maxAllowedUnits"),
            }}
          >
            <FormLabel
              htmlFor="maxAllowedUnits"
              label="Total Units"
              required={PropertyTypeManager.isFieldRequired(
                propertyType,
                "maxAllowedUnits"
              )}
            />
            <Tooltip
              content={PropertyTypeManager.getHelpText(
                propertyType,
                "maxAllowedUnits",
                numUnits
              )}
              placement="top"
            >
              <FormInput
                id="maxAllowedUnits"
                name="maxAllowedUnits"
                type="number"
                value={form.values.maxAllowedUnits}
                onChange={(e) => {
                  const value = e.target.value;
                  form.setFieldValue("maxAllowedUnits", parseInt(value, 10));
                }}
                placeholder="Enter total building units"
                min={formConfig?.specifications?.maxAllowedUnits?.min}
                max={250}
                hasError={!!form.errors["maxAllowedUnits"]}
              />
            </Tooltip>
          </FormField>
        </div>
      </FormSection>

      {isFieldVisible("utilities") && (
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
            <TextArea
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
