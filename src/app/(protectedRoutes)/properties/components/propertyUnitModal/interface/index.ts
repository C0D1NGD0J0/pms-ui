import { UseFormReturnType } from "@mantine/form";
import { UnitFormValues } from "@interfaces/unit.interface";
import { IPropertyDocument } from "@interfaces/property.interface";

export interface UnitsFormData {
  units: UnitFormValues[];
}

export interface UsePropertyUnitLogicProps {
  property: IPropertyDocument;
  onClose: () => void;
}

export interface PropertyUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: IPropertyDocument;
}

export interface PropertyUnitModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  property: IPropertyDocument;
  form: UseFormReturnType<
    UnitsFormData,
    (values: UnitsFormData) => UnitsFormData
  >;
  isMultiUnit: boolean;
  isSubmitting: boolean;
  activeUnitIndex: number;
  totalUnitsCreated: number;
  currentUnit: UnitFormValues;
  setIsMultiUnit: (value: boolean) => void;
  unitTypeOptions: Array<{ value: string; label: string }>;
  unitStatusOptions: Array<{ value: string; label: string }>;
  fieldVisibility: {
    totalArea: boolean;
    rooms: boolean;
    bathrooms: boolean;
    maxOccupants: boolean;
  };
  unitNumberingScheme: string;
  setUnitNumberingScheme: (value: string) => void;
  customPrefix: string;
  setCustomPrefix: (value: string) => void;
  prefixOptions: Array<{ value: string; label: string; example: string }>;
  generateNextUnitNumber: () => string;
  handleCancel: () => void;
  handleCopyUnit: () => void;
  handleAddAnotherUnit: () => void;
  handleRemoveUnit: (index: number) => void;
  handleSubmit: (values: UnitsFormData) => void;
  handleFieldChange: (fieldPath: string, value: any) => void;
}
