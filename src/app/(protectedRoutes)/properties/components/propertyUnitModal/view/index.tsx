import React, { ReactNode, useState } from "react";
import { FormSection } from "@components/FormLayout";
import { Modal } from "@components/FormElements/Modal";
import { UnitTypeManager } from "@utils/unitTypeManager";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  Textarea,
  Button,
  Select,
  Form,
} from "@components/FormElements";

import { PropertyUnitModalViewProps } from "../interface";

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h4
    style={{
      marginTop: "20px",
      marginBottom: "10px",
      color: "#124e66",
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: "8px",
    }}
  >
    {children}
  </h4>
);

export function PropertyUnitModalView({
  isOpen,
  onClose,
  property,
  form,
  isMultiUnit,
  isSubmitting,
  activeUnitIndex,
  currentUnit,
  totalUnitsCreated,
  unitTypeOptions,
  unitStatusOptions,
  unitNumberingScheme,
  setUnitNumberingScheme,
  customPrefix,
  setCustomPrefix,
  prefixOptions,
  handleCopyUnit,
  handleRemoveUnit,
  handleSubmit,
  handleAddAnotherUnit,
  handleCancel,
  handleFieldChange,
  fieldVisibility,
}: PropertyUnitModalViewProps) {
  const [isNumberingDropdownOpen, setIsNumberingDropdownOpen] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <Modal.Header title="Manage Property Units" onClose={onClose} />
      <Modal.Content>
        <Form
          id="property-units-form"
          onSubmit={form.onSubmit(handleSubmit)}
          disabled={isSubmitting}
        >
          <FormSection
            title=""
            description="Add and manage individual units for this property"
          >
            <div
              style={{
                marginBottom: "20px",
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
                border: "1px solid #e9ecef",
              }}
            >
              <strong>
                Units Created: {totalUnitsCreated} / {property.totalUnits}
              </strong>
              {totalUnitsCreated > 0 && (
                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "14px",
                    color: "#6c757d",
                  }}
                >
                  Currently editing: Unit #{activeUnitIndex + 1} (
                  {currentUnit.unitNumber || "Untitled"})
                </div>
              )}
            </div>

            {currentUnit && (
              <div className="unit-card">
                <div className="unit-header">
                  <h4>Unit #{activeUnitIndex + 1}</h4>
                  <div className="unit-actions">
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        className="btn-text"
                        title="Numbering Scheme"
                        onClick={() =>
                          setIsNumberingDropdownOpen(!isNumberingDropdownOpen)
                        }
                      >
                        <i className="bx bx-cog"></i>
                      </button>
                      {isNumberingDropdownOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            right: "0",
                            zIndex: 1000,
                            backgroundColor: "white",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            minWidth: "200px",
                            padding: "8px 0",
                          }}
                        >
                          {prefixOptions.map((option: any) => (
                            <button
                              key={option.value}
                              type="button"
                              style={{
                                width: "100%",
                                padding: "8px 16px",
                                border: "none",
                                background:
                                  unitNumberingScheme === option.value
                                    ? "#f0f8ff"
                                    : "transparent",
                                textAlign: "left",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                              onClick={() => {
                                setUnitNumberingScheme(option.value);
                                setIsNumberingDropdownOpen(false);
                              }}
                              onMouseEnter={(e) => {
                                if (unitNumberingScheme !== option.value) {
                                  e.currentTarget.style.backgroundColor =
                                    "#f8f9fa";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (unitNumberingScheme !== option.value) {
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                }
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      label=""
                      title="Copy Unit"
                      className="btn-text"
                      onClick={handleCopyUnit}
                      icon={<i className="bx bx-copy"></i>}
                      disabled={totalUnitsCreated >= property.totalUnits}
                    />
                    <Button
                      label=""
                      title="Remove Unit"
                      className="btn-text"
                      icon={<i className="bx bx-trash"></i>}
                      disabled={form.values.units.length <= 1}
                      onClick={() => handleRemoveUnit(activeUnitIndex)}
                    />
                  </div>
                </div>

                {unitNumberingScheme === "custom" && (
                  <div className="form-fields">
                    <FormField>
                      <FormLabel
                        htmlFor="custom-prefix"
                        label="Custom Prefix"
                      />
                      <FormInput
                        id="custom-prefix"
                        name="customPrefix"
                        value={customPrefix}
                        onChange={(e) => setCustomPrefix(e.target.value)}
                        placeholder="Enter custom prefix (e.g., Apt, Unit, Bldg)"
                      />
                    </FormField>
                  </div>
                )}

                <div className="form-fields">
                  <FormField>
                    <FormLabel htmlFor="unit-number" label="Unit Number/Name" />
                    <FormInput
                      id="unit-number"
                      name={`units.${activeUnitIndex}.unitNumber`}
                      value={currentUnit.unitNumber}
                      onChange={(e) =>
                        handleFieldChange(
                          `units.${activeUnitIndex}.unitNumber`,
                          e.target.value
                        )
                      }
                      placeholder="Enter unit number or name (e.g., 101, A1, Suite 3)"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="unit-type" label="Unit Type" />
                    <Select
                      id="unit-type"
                      name={`units.${activeUnitIndex}.type`}
                      value={currentUnit.type}
                      onChange={(e) =>
                        handleFieldChange(
                          `units.${activeUnitIndex}.type`,
                          e.target.value
                        )
                      }
                      options={unitTypeOptions}
                      placeholder="Select unit type"
                    />
                  </FormField>
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel htmlFor="unit-size" label="Unit Size (sq ft)" />
                    <FormInput
                      id="unit-size"
                      name={`units.${activeUnitIndex}.specifications.totalArea`}
                      type="number"
                      value={currentUnit.specifications.totalArea}
                      onChange={(e) =>
                        handleFieldChange(
                          `units.${activeUnitIndex}.specifications.totalArea`,
                          Number(e.target.value)
                        )
                      }
                      placeholder="Enter unit area"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="unit-floor" label="Floor/Level" />
                    <FormInput
                      id="unit-floor"
                      name={`units.${activeUnitIndex}.floor`}
                      type="number"
                      value={currentUnit.floor}
                      onChange={(e) =>
                        handleFieldChange(
                          `units.${activeUnitIndex}.floor`,
                          Number(e.target.value)
                        )
                      }
                      placeholder="Enter floor or level"
                    />
                  </FormField>
                </div>

                <div className="form-fields">
                  {fieldVisibility.rooms && (
                    <FormField>
                      <FormLabel htmlFor="unit-rooms" label="Rooms" />
                      <FormInput
                        id="unit-rooms"
                        name={`units.${activeUnitIndex}.specifications.rooms`}
                        type="number"
                        value={currentUnit.specifications.rooms}
                        onChange={(e) =>
                          handleFieldChange(
                            `units.${activeUnitIndex}.specifications.rooms`,
                            Number(e.target.value)
                          )
                        }
                        placeholder="Number of rooms"
                      />
                    </FormField>
                  )}

                  {fieldVisibility.bathrooms && (
                    <FormField>
                      <FormLabel htmlFor="unit-bathrooms" label="Bathrooms" />
                      <FormInput
                        id="unit-bathrooms"
                        name={`units.${activeUnitIndex}.specifications.bathrooms`}
                        type="number"
                        value={currentUnit.specifications.bathrooms}
                        onChange={(e) =>
                          handleFieldChange(
                            `units.${activeUnitIndex}.specifications.bathrooms`,
                            Number(e.target.value)
                          )
                        }
                        step="0.5"
                        placeholder="Number of bathrooms"
                      />
                    </FormField>
                  )}
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel htmlFor="unit-rent" label="Monthly Rent ($)" />
                    <FormInput
                      id="unit-rent"
                      name={`units.${activeUnitIndex}.fees.rentAmount`}
                      type="number"
                      value={currentUnit.fees.rentAmount}
                      onChange={(e) =>
                        handleFieldChange(
                          `units.${activeUnitIndex}.fees.rentAmount`,
                          Number(e.target.value)
                        )
                      }
                      placeholder="Enter monthly rent amount"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="unit-status" label="Status" />
                    <Select
                      id="unit-status"
                      name={`units.${activeUnitIndex}.status`}
                      value={currentUnit.status}
                      onChange={(e) =>
                        handleFieldChange(
                          `units.${activeUnitIndex}.status`,
                          e.target.value
                        )
                      }
                      options={unitStatusOptions}
                    />
                  </FormField>
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel
                      htmlFor="unit-description"
                      label="Unit Description (Optional)"
                    />
                    <Textarea
                      id="unit-description"
                      name={`units.${activeUnitIndex}.description`}
                      value={currentUnit.description || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          `units.${activeUnitIndex}.description`,
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Enter any special features or details about this unit..."
                    />
                  </FormField>
                </div>

                <SectionTitle>Amenities</SectionTitle>
                <div className="form-fields checkbox-fields">
                  {UnitTypeManager.getVisibleUnitFeatures(currentUnit.type).map(
                    (feature) => (
                      <FormField key={feature.value}>
                        <Checkbox
                          id={`unit-${feature.value}`}
                          name={`units.${activeUnitIndex}.amenities.${feature.amenityKey}`}
                          checked={
                            currentUnit.amenities[
                              feature.amenityKey as keyof typeof currentUnit.amenities
                            ]
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              `units.${activeUnitIndex}.amenities.${feature.amenityKey}`,
                              e.target.checked
                            )
                          }
                          label={feature.label}
                        />
                      </FormField>
                    )
                  )}
                </div>
              </div>
            )}

            <Button
              type="button"
              className="btn btn-outline add-unit-btn"
              label="Add Another Unit"
              icon={<i className="bx bx-plus"></i>}
              onClick={handleAddAnotherUnit}
              disabled={
                !isMultiUnit || totalUnitsCreated >= property.totalUnits
              }
            />
          </FormSection>
        </Form>
      </Modal.Content>
      <Modal.Footer>
        <Button
          type="button"
          className="btn btn-outline"
          label="Cancel"
          onClick={handleCancel}
        />
        <Button
          type="submit"
          form="property-units-form"
          className="btn btn-primary"
          label={isSubmitting ? "Saving..." : "Save Units"}
          disabled={isSubmitting}
        />
      </Modal.Footer>
    </Modal>
  );
}
