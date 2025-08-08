import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { invitationService } from "@src/services/invite";
import { useErrorHandler, useNotification } from "@hooks/index";
import {
  AccountSetupFormValues,
  accountSetupSchema,
} from "@src/validations/invitation.validations";
import {
  IInvitationAcceptResponse,
  AccountSetupFormData,
} from "@src/interfaces/invitation.interface";

interface UseAccountSetupFormProps {
  inviteeEmail: string;
  onSuccess: (accountData: IInvitationAcceptResponse) => void;
  token: string;
  cuid: string;
  onError?: (error: any) => void;
}

export function useAccountSetupForm({
  inviteeEmail,
  onSuccess,
  cuid,
  token,
}: UseAccountSetupFormProps) {
  const { handleError } = useErrorHandler();
  const { message } = useNotification();

  const initialValues: AccountSetupFormValues = {
    password: "Password1",
    confirmPassword: "Password1",
    phoneNumber: "",
    location: "Toronto, Canada",
    timeZone: "UTC",
    token,
    cuid,
    lang: "en",
    termsAccepted: false,
    newsletterOptIn: false,
  };

  const form = useForm<AccountSetupFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(accountSetupSchema),
  });

  const setupAccountMutation = useMutation<
    IInvitationAcceptResponse,
    any,
    AccountSetupFormData
  >({
    mutationFn: async (data: AccountSetupFormData) => {
      return invitationService.acceptInvitation(data.cuid, data);
    },
    onError: (error: any) => {
      const errorResponse = handleError(error, { showFieldErrors: true });

      if (
        errorResponse &&
        "fieldErrors" in errorResponse &&
        errorResponse.fieldErrors
      ) {
        Object.entries(errorResponse.fieldErrors).forEach(([field, errors]) => {
          if (Array.isArray(errors) && errors.length > 0) {
            form.setFieldError(field, errors[0]);
          } else if (typeof errors === "string") {
            form.setFieldError(field, errors);
          }
        });
      } else {
        console.error("Account setup failwewewed:", error);
        message.error(errorResponse?.message || "Account creation failed", {
          duration: 5,
        });
      }
      // openNotification(
      //   "error",
      //   "Account creation failed.",
      //   error.message || "Failed to create account. Please try again."
      // );
    },
  });

  const handleSubmit = async (values: AccountSetupFormValues) => {
    const formData: AccountSetupFormData = {
      email: inviteeEmail,
      password: values.password,
      confirmPassword: values.confirmPassword,
      phoneNumber: values.phoneNumber,
      location: values.location,
      timeZone: values.timeZone,
      lang: values.lang,
      termsAccepted: values.termsAccepted,
      newsletterOptIn: values.newsletterOptIn,
      token,
      cuid,
    };
    const resp = await setupAccountMutation.mutateAsync(formData);

    if (resp.activeAccount) {
      message.success("Account created successfully!");
      onSuccess(resp);
    }
  };

  const handleFieldChange =
    (field: keyof AccountSetupFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement> | string) => {
      if (typeof event === "string") {
        form.setFieldValue(field, event.trim());
      } else {
        const { value, type, checked } = event.target;
        form.setFieldValue(field, type === "checkbox" ? checked : value.trim());
      }

      if (form.errors[field]) {
        form.clearFieldError(field);
      }
    };

  const handleDropdownChange = (
    value: string,
    field: keyof AccountSetupFormValues
  ) => {
    form.setFieldValue(field, value);

    if (form.errors[field]) {
      form.clearFieldError(field);
    }
  };

  return {
    isSubmitting: setupAccountMutation.isPending,
    handleSubmit: form.onSubmit(handleSubmit),
    touched: form.isTouched,
    isValid: form.isValid(),
    handleDropdownChange,
    values: form.values,
    errors: form.errors,
    handleFieldChange,
  };
}
