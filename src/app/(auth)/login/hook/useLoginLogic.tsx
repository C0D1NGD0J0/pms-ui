"use client";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { authService } from "@services/auth";
import { EventTypes } from "@services/events";
import { useAuthActions } from "@store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { ILoginForm } from "@interfaces/auth.interface";
import { useNotification } from "@hooks/useNotification";
import { useErrorHandler, usePublish } from "@hooks/index";
import { LoginSchema } from "@validations/auth.validations";

export function useLoginLogic() {
  const router = useRouter();
  const publish = usePublish();
  const { setClient } = useAuthActions();
  const { openNotification } = useNotification();
  const { handleMutationError } = useErrorHandler();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [userAccounts, setUserAccounts] = useState<
    { cuid: string; clientDisplayName: string }[]
  >([]);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ILoginForm) => authService.login(data),
    onError: (error) => {
      handleMutationError(error, "Login process failed");
    },
  });

  const form = useForm<ILoginForm>({
    initialValues: {
      password: "Password1",
      email: "wayne@example.com",
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
    } catch {
      // Mutation errors are handled by the onError callback in useMutation
      // This catch block only catches non-mutation errors (e.g., runtime errors in try block)
    }
  };

  const handleSelect = (cuid: string) => {
    setSelectedClient(cuid);
  };

  const handleModalConfirm = () => {
    const selectedAccount = userAccounts.find(
      (account) => account.cuid === selectedClient
    );
    if (selectedAccount) {
      const clientData = {
        cuid: selectedAccount.cuid,
        displayName: selectedAccount.clientDisplayName,
      };
      setClient(clientData);
      publish(EventTypes.ACCOUNT_SWITCHED, clientData);
      router.push("/dashboard");
    }
    setIsModalOpen(false);
  };

  return {
    form,
    isSubmitting: isPending,
    isModalOpen,
    userAccounts,
    selectedClient,
    handleSelect,
    handleModalConfirm,
    toggleModal: setIsModalOpen,
    handleSubmit,
  };
}
