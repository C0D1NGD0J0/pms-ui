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

export interface PropertyUnitModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  property: IPropertyDocument;
  form: UseFormReturnType<UnitsFormData>;
  isMultiUnit: boolean;
  setIsMultiUnit: (value: boolean) => void;
  isSubmitting: boolean;
  activeUnitIndex: number;
  currentUnit: UnitFormValues;
  totalUnitsCreated: number;
  unitTypeOptions: Array<{ value: string; label: string }>;
  unitStatusOptions: Array<{ value: string; label: string }>;
  fieldVisibility: {
    totalArea: boolean;
    rooms: boolean;
    bathrooms: boolean;
    maxOccupants: boolean;
  };
  handleCopyUnit: () => void;
  handleRemoveUnit: (index: number) => void;
  handleSubmit: (values: UnitsFormData) => void;
  handleAddAnotherUnit: () => void;
  handleCancel: () => void;
  handleFieldChange: (fieldPath: string, value: any) => void;
}
