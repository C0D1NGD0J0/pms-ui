import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { authService } from "@services/auth";
import { errorFormatter } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { IAccountActivationForm } from "@interfaces/auth.interface";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { AccountActivationSchema } from "@validations/auth.validations";

export function useAccountActivationLogic() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openNotification } = useNotification();
  const [emailError, setEmailError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showResendActivation, setShowResendActivation] = useState(false);
  const [email, setEmail] = useState("");
  const token = searchParams.get("t");
  const csub = params.csub as string;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (
      values: IAccountActivationForm & { type: string; email: string }
    ) => {
      if (values.type === "resendCode") {
        return authService.resendActivationLink(values.email);
      } else if (values.type === "verifyCode") {
        return authService.accountActivation(csub, values);
      }
      throw new Error("Unknown mutation type");
    },
  });

  const form = useForm<IAccountActivationForm>({
    initialValues: {
      token: "",
      csub: csub,
    },
    validateInputOnChange: true,
    validate: zodResolver(AccountActivationSchema) as any,
  });

  useEffect(() => {
    if (token) {
      form.setFieldValue("token", token);
    }
  }, [token]);

  const handleResendActivation = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    setEmailError("");
    try {
      await mutateAsync({ type: "resendCode", csub, token: "", email });
      openNotification(
        "success",
        "Activation Link Sent",
        "A new activation link has been sent to your email."
      );
      setIsPopoverOpen(false);
      setShowResendActivation(false);
      router.push("/account_activation");
    } catch (error: any) {
      openNotification("error", "Request Failed", errorFormatter(error));
    }
  };

  const handleSubmit = async (values: IAccountActivationForm) => {
    try {
      const response = await mutateAsync({
        type: "verifyCode",
        csub,
        token: values.token,
        email: "",
      });
      openNotification(
        "success",
        "Account Activated",
        response.msg || "Your account has been successfully activated."
      );
      setIsSuccess(true);
      router.push("/login");
    } catch (error: unknown) {
      openNotification("error", "Activation Failed", errorFormatter(error));
      setShowResendActivation(true); // this will show the resend activation link
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
    token,
    email,
    setEmail,
    emailError,
    isSuccess,
    isPopoverOpen,
    setIsPopoverOpen,
    showResendActivation,
    handleResendActivation,
    setEmailError,
  };
}
