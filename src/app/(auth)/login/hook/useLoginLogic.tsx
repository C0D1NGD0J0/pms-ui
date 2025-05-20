"use client";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { usePublish } from "@hooks/index";
import { useRouter } from "next/navigation";
import { authService } from "@services/auth";
import { EventTypes } from "@services/events";
import { errorFormatter } from "@utils/helpers";
import { useAuthActions } from "@store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { ILoginForm } from "@interfaces/auth.interface";
import { useNotification } from "@hooks/useNotification";
import { LoginSchema } from "@validations/auth.validations";

export function useLoginLogic() {
  const router = useRouter();
  const publish = usePublish();
  const { setClient } = useAuthActions();
  const { openNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [userAccounts, setUserAccounts] = useState<
    { csub: string; displayName: string }[]
  >([]);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ILoginForm) => authService.login(data),
  });

  const form = useForm<ILoginForm>({
    initialValues: {
      password: "password",
      email: "zlatan@example.com",
      otpCode: "",
      rememberMe: false,
    },
    validateInputOnChange: true,
    validate: zodResolver(LoginSchema),
  });

  const handleSubmit = async (values: ILoginForm) => {
    try {
      const response = await mutateAsync(values);
      openNotification(
        "success",
        "Login",
        response.msg || "Login was successful."
      );
      if (response.accounts.length) {
        setIsModalOpen(true);
        setUserAccounts(response.accounts);
        return;
      }

      form.reset();
      publish(EventTypes.LOGIN_SUCCESS, response.activeAccount);
      publish(EventTypes.GET_CURRENT_USER, response.activeAccount);
      router.push("/dashboard");
    } catch (error: unknown) {
      openNotification("error", "Login process failed", errorFormatter(error));
    }
  };

  const handleSelect = (csub: string) => {
    setSelectedClient(csub);
    const selectedAccount = userAccounts.find(
      (account) => account.csub === csub
    );
    if (selectedAccount) {
      setClient(selectedAccount);
      publish(EventTypes.ACCOUNT_SWITCHED, selectedAccount);
      router.push("/dashboard");
    }
  };

  return {
    form,
    isSubmitting: isPending,
    isModalOpen,
    userAccounts,
    selectedClient,
    handleSelect,
    toggleModal: setIsModalOpen,
    handleSubmit,
  };
}
