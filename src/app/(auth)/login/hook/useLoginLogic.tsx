"use client";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { authService } from "@services/auth";
import { useAuthActions } from "@store/hooks";
import { errorFormatter } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { ILoginForm } from "@interfaces/auth.interface";
import { useNotification } from "@hooks/useNotification";
import { LoginSchema } from "@validations/auth.validations";

export function useLoginLogic() {
  const router = useRouter();
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
      password: "",
      email: "",
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
      setClient(response.activeAccount);
      router.push("/dashboard");
    } catch (error: unknown) {
      openNotification("error", "Login process failed", errorFormatter(error));
    }
  };

  const handleSelect = (csub: string) => {
    setSelectedClient(csub);
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
