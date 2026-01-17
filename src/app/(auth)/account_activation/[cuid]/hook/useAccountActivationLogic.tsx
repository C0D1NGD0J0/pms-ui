import { useForm } from "@mantine/form";
import { authService } from "@services/auth";
import { errorFormatter } from "@utils/helpers";
import { useEffect, useState, use } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { useSearchParams, useRouter } from "next/navigation";
import { IAccountActivationForm } from "@interfaces/auth.interface";
import { AccountActivationSchema } from "@validations/auth.validations";

export function useAccountActivationLogic({
  params,
}: {
  params: Promise<{ cuid: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openNotification } = useNotification();
  const [emailError, setEmailError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showResendActivation, setShowResendActivation] = useState(false);
  const [email, setEmail] = useState("");
  const token = searchParams.get("t");
  const { cuid } = use(params);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (
      values: IAccountActivationForm & { type: string; email: string }
    ) => {
      if (values.type === "resendCode") {
        return authService.resendActivationLink(values.email);
      } else if (values.type === "verifyCode") {
        return authService.accountActivation(cuid, values);
      }
      throw new Error("Unknown mutation type");
    },
  });

  const form = useForm<IAccountActivationForm>({
    initialValues: {
      token: "",
      cuid: "",
    },
    validateInputOnChange: true,
    validate: zodResolver(AccountActivationSchema) as any,
  });

  useEffect(() => {
    if (token) {
      form.setFieldValue("token", token);
      form.setFieldValue("cuid", cuid);
      form.validate();
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
      await mutateAsync({ type: "resendCode", cuid, token: "", email });
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
        cuid,
        token: values.token,
        email: "",
      });
      console.log(response, values);
      openNotification(
        "success",
        "Account Activated",
        response.msg || "Your account has been successfully activated."
      );
      setIsSuccess(true);
      router.push("/register");
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
