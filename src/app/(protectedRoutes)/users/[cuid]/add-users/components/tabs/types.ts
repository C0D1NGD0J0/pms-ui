import { UseFormReturnType } from "@mantine/form";
import { ProfileFormValues } from "@validations/profile.validations";
import { InvitationFormValues } from "@validations/invitation.validations";

// Generic form interface that works with any form structure
export interface GenericForm<T = Record<string, unknown>> {
  values: T;
  setFieldValue: (path: string, value: unknown) => void;
}

// Union types for forms that can be used with our components
export type EmployeeForm =
  | UseFormReturnType<InvitationFormValues>
  | UseFormReturnType<ProfileFormValues>
  | GenericForm<InvitationFormValues>
  | GenericForm<ProfileFormValues>;

export type VendorForm =
  | UseFormReturnType<InvitationFormValues>
  | UseFormReturnType<ProfileFormValues>
  | GenericForm<InvitationFormValues>
  | GenericForm<ProfileFormValues>;
