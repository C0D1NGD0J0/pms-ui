"use client";
import React, { ReactNode, useState } from "react";
import { FormSection } from "@components/FormLayout";
import { Modal } from "@components/FormElements/Modal";
import { IPropertyDocument } from "@interfaces/property.interface";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  Textarea,
  Select,
  Button,
  Form,
} from "@components/FormElements";

// Define the unit form values interface
interface UnitFormValues {
  unitNumber: string;
  type: string;
  totalArea: number;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  rentAmount: number;
  status: string;
  description: string;
  amenities: {
    airConditioning: boolean;
    washerDryer: boolean;
    dishwasher: boolean;
    parking: boolean;
  };
}

interface PropertyUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: IPropertyDocument;
}

export function PropertyUnitModal({
  isOpen,
  onClose,
  property,
}: PropertyUnitModalProps) {
  const [isMultiUnit, setIsMultiUnit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form state with default values
  const [formValues, setFormValues] = useState<UnitFormValues>({
    unitNumber: "",
    type: "",
    totalArea: 0,
    floor: 1,
    bedrooms: 0,
    bathrooms: 0,
    rentAmount: 0,
    status: "available",
    description: "",
    amenities: {
      airConditioning: false,
      washerDryer: false,
      dishwasher: false,
      parking: false,
    },
  });

  // These would be fetched from an API in a real implementation
  const unitTypeOptions = [
    { value: "studio", label: "Studio" },
    { value: "1br", label: "1 Bedroom" },
    { value: "2br", label: "2 Bedroom" },
    { value: "3br", label: "3 Bedroom" },
    { value: "4br", label: "4+ Bedroom" },
    { value: "penthouse", label: "Penthouse" },
    { value: "commercial", label: "Commercial Space" },
  ];

  const unitStatusOptions = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Under Maintenance" },
    { value: "renovation", label: "Under Renovation" },
    { value: "reserved", label: "Reserved" },
  ];

  // Handler for input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      // For checkbox inputs
      const checkbox = e.target as HTMLInputElement;
      const isChecked = checkbox.checked;

      if (name.includes(".")) {
        // For nested fields like amenities.airConditioning
        const [parent, child] = name.split(".");
        setFormValues((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof UnitFormValues],
            [child]: isChecked,
          },
        }));
      } else {
        setFormValues((prev) => ({
          ...prev,
          [name]: isChecked,
        }));
      }
    } else {
      // For text/number/select inputs
      if (name.includes(".")) {
        // For nested fields
        const [parent, child] = name.split(".");
        setFormValues((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof UnitFormValues],
            [child]: value,
          },
        }));
      } else {
        // For non-nested fields, handle type conversion for number inputs
        const newValue =
          type === "number" ? (value ? Number(value) : 0) : value;
        setFormValues((prev) => ({
          ...prev,
          [name]: newValue,
        }));
      }
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here we would typically send the data to the server
    console.log("Submitting unit data:", {
      propertyId: property.id,
      units: [formValues],
    });

    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleAddAnotherUnit = () => {
    // In a real implementation, we would add the current unit to an array
    // and reset the form for a new unit
    console.log("Current unit data:", formValues);

    // Reset form for new unit
    setFormValues({
      unitNumber: "",
      type: "",
      totalArea: 0,
      floor: 1,
      bedrooms: 0,
      bathrooms: 0,
      rentAmount: 0,
      status: "available",
      description: "",
      amenities: {
        airConditioning: false,
        washerDryer: false,
        dishwasher: false,
        parking: false,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <Modal.Header title="Manage Property Units" onClose={onClose} />
      <Modal.Content>
        <Form
          id="property-units-form"
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        >
          <FormSection
            title="Property Units"
            description="Add and manage individual units for this property"
          >
            <div className="form-fields">
              <FormField>
                <Checkbox
                  id="is-multi-unit"
                  name="isMultiUnit"
                  checked={isMultiUnit}
                  onChange={(e) => setIsMultiUnit(e.target.checked)}
                  label="This is a multi-unit property"
                />
              </FormField>
            </div>

            {isMultiUnit && (
              <div className="form-fields unit-card">
                <div className="unit-header">
                  <h4>Unit #1</h4>
                  <div className="unit-actions">
                    <button
                      type="button"
                      className="btn-text btn-duplicate"
                      title="Duplicate Unit"
                    >
                      <i className="bx bx-copy"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-text"
                      title="Remove Unit"
                    >
                      <i className="bx bx-x"></i>
                    </button>
                  </div>
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel htmlFor="unit-number" label="Unit Number/Name" />
                    <FormInput
                      id="unit-number"
                      name="unitNumber"
                      value={formValues.unitNumber}
                      onChange={handleInputChange}
                      placeholder="Enter unit number or name (e.g., 101, A1, Suite 3)"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="unit-type" label="Unit Type" />
                    <Select
                      id="unit-type"
                      name="type"
                      value={formValues.type}
                      onChange={handleInputChange}
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
                      name="totalArea"
                      type="number"
                      value={formValues.totalArea}
                      onChange={handleInputChange}
                      placeholder="Enter unit area"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="unit-floor" label="Floor/Level" />
                    <FormInput
                      id="unit-floor"
                      name="floor"
                      type="number"
                      value={formValues.floor}
                      onChange={handleInputChange}
                      placeholder="Enter floor or level"
                    />
                  </FormField>
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel htmlFor="unit-bedrooms" label="Bedrooms" />
                    <FormInput
                      id="unit-bedrooms"
                      name="bedrooms"
                      type="number"
                      value={formValues.bedrooms}
                      onChange={handleInputChange}
                      placeholder="Number of bedrooms"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="unit-bathrooms" label="Bathrooms" />
                    <FormInput
                      id="unit-bathrooms"
                      name="bathrooms"
                      type="number"
                      value={formValues.bathrooms}
                      onChange={handleInputChange}
                      step="0.5"
                      placeholder="Number of bathrooms"
                    />
                  </FormField>
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel htmlFor="unit-rent" label="Monthly Rent ($)" />
                    <FormInput
                      id="unit-rent"
                      name="rentAmount"
                      type="number"
                      value={formValues.rentAmount}
                      onChange={handleInputChange}
                      placeholder="Enter monthly rent amount"
                    />
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="unit-status" label="Status" />
                    <Select
                      id="unit-status"
                      name="status"
                      value={formValues.status}
                      onChange={handleInputChange}
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
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Enter any special features or details about this unit..."
                    />
                  </FormField>
                </div>

                <SectionTitle>Amenities</SectionTitle>
                <div className="form-fields checkbox-fields">
                  <FormField>
                    <Checkbox
                      id="unit-aircon"
                      name="amenities.airConditioning"
                      checked={formValues.amenities.airConditioning}
                      onChange={handleInputChange}
                      label="Air Conditioning"
                    />
                  </FormField>

                  <FormField>
                    <Checkbox
                      id="unit-washer-dryer"
                      name="amenities.washerDryer"
                      checked={formValues.amenities.washerDryer}
                      onChange={handleInputChange}
                      label="Washer/Dryer"
                    />
                  </FormField>

                  <FormField>
                    <Checkbox
                      id="unit-dishwasher"
                      name="amenities.dishwasher"
                      checked={formValues.amenities.dishwasher}
                      onChange={handleInputChange}
                      label="Dishwasher"
                    />
                  </FormField>

                  <FormField>
                    <Checkbox
                      id="unit-parking"
                      name="amenities.parking"
                      checked={formValues.amenities.parking}
                      onChange={handleInputChange}
                      label="Parking"
                    />
                  </FormField>
                </div>
              </div>
            )}

            <Button
              type="button"
              className="btn btn-outline add-unit-btn"
              label="Add Another Unit"
              icon={<i className="bx bx-plus"></i>}
              onClick={handleAddAnotherUnit}
              disabled={!isMultiUnit}
            />
          </FormSection>
        </Form>
      </Modal.Content>
      <Modal.Footer>
        <Button
          type="button"
          className="btn btn-outline"
          label="Cancel"
          onClick={onClose}
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
