import { useEffect, use } from "react";
import { useForm } from "@mantine/form";
import { authService } from "@services/auth";
import { errorFormatter } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { IResetPasswordForm } from "@interfaces/auth.interface";
import { ResetPasswordSchema } from "@validations/auth.validations";

export function useResetPasswordLogic({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { openNotification } = useNotification();

  const form = useForm<IResetPasswordForm>({
    initialValues: {
      password: "",
      cpassword: "",
      token: "",
    },
    validateInputOnChange: true,
    validate: zodResolver(ResetPasswordSchema) as any,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IResetPasswordForm) =>
      authService.resetPassword(data.token, data.password),
  });

  useEffect(() => {
    if (token) {
      form.setFieldValue("token", token);
    }
  }, [token]);

  const handleSubmit = async (values: IResetPasswordForm) => {
    try {
      const response = await mutateAsync(values);
      openNotification(
        "success",
        "Password reset",
        response.msg || "Password reset was successful."
      );
      form.reset();
    } catch (error: unknown) {
      openNotification(
        "error",
        "Password reset process failed",
        errorFormatter(error)
      );
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
    token,
  };
}
