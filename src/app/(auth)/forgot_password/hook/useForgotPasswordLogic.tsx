import { useForm } from "@mantine/form";
import { authService } from "@services/auth";
import { errorFormatter } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { ForgotPasswordSchema } from "@validations/auth.validations";

export interface ForgotPasswordForm {
  email: string;
}

export function useForgotPasswordLogic() {
  const { openNotification } = useNotification();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.forgotPassword,
  });

  const form = useForm<ForgotPasswordForm>({
    initialValues: {
      email: "",
    },
    validateInputOnChange: true,
    validate: zodResolver(ForgotPasswordSchema) as any,
  });

  const handleSubmit = async (values: ForgotPasswordForm) => {
    try {
      const response = await mutateAsync(values.email);
      openNotification(
        "success",
        "Forgot password",
        response.msg || "Password reset link has been sent to your inbox."
      );
      form.reset();
    } catch (error: unknown) {
      openNotification(
        "error",
        "Forgot password process failed",
        errorFormatter(error)
      );
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
  };
}
