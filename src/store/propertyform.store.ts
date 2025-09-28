import { create } from "zustand";
import { defaultPropertyValues, PropertyFormValues } from "@interfaces/index";

interface PropertyFormState {
  formValues: PropertyFormValues;
  validationStatus: {
    basic: boolean;
    property: boolean;
    amenities: boolean;
    documents: boolean;
  };
  actions: {
    resetForm: () => void;
    setTabValidation: (tab: string, isValid: boolean) => void;
    setFormValues: (values: Partial<PropertyFormValues>) => void;
  };
}

export const usePropertyFormStore = create<PropertyFormState>()((set) => ({
  formValues: defaultPropertyValues,
  validationStatus: {
    basic: false,
    property: false,
    amenities: true,
    documents: true,
  },
  actions: {
    setFormValues: (values) => {
      set((state) => ({
        formValues: { ...state.formValues, ...values },
      }));
    },
    resetForm: () => set({ formValues: defaultPropertyValues }),
    setTabValidation: (tab, isValid) =>
      set((state) => ({
        validationStatus: {
          ...state.validationStatus,
          [tab]: isValid,
        },
      })),
  },
}));

export const useProperty = () => {
  const { formValues, validationStatus } = usePropertyFormStore();
  return {
    formValues,
    validationStatus,
  };
};

export const usePropertyFormActions = () => {
  const { actions } = usePropertyFormStore();
  return {
    setFormValues: actions.setFormValues,
    setTabValidation: actions.setTabValidation,
    resetForm: actions.resetForm,
  };
};
