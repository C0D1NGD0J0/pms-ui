import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { authService } from "@services/auth";
import { ChangeEvent, useState } from "react";
import { ISignupForm } from "@interfaces/index";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { useNotification } from "@hooks/useNotification";
import { SignupSchema } from "@validations/auth.validations";

import { useGetSubscriptionPlans } from "./queries/useGetSubscriptionPlans";

const user1 = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@acmerealty.com",
  password: "Password1",
  cpassword: "Password1",
  location: "New York, NY",
  accountType: {
    planId: "",
    planName: "personal",
    isEnterpriseAccount: true,
    lookUpKey: undefined,
    billingInterval: "monthly" as const,
  },
  phoneNumber: "2125551234",
  displayName: "Sarah Johnson",
  companyProfile: {
    tradingName: "Acme Realty Group",
    legalEntityName: "Acme Realty Group LLC",
    website: "www.acmerealty.com",
    companyEmail: "contact@acmerealty.com",
    companyPhone: "2125551200",
  },
};

export function useRegisterLogic() {
  const { handleMutationError } = useErrorHandler();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.signup,
    // Global error handler logs automatically, we just need to show notification
    onError: (error) => handleMutationError(error, "Registration failed"),
  });
  const { openNotification } = useNotification();
  const {
    data: plansData,
    isLoading: isLoadingPlans,
    isError: isPlansError,
  } = useGetSubscriptionPlans();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<
    "personal" | "starter" | "professional" | null
  >(null);

  const form = useForm<ISignupForm, (values: ISignupForm) => ISignupForm>({
    validateInputOnChange: true,
    initialValues: user1,
    validate: zodResolver(SignupSchema) as any,
  });

  const handleSelectPlan = (
    plan: "personal" | "starter" | "professional",
    pricingId: string | null,
    lookUpKey: string | null,
    billingInterval: "monthly" | "annual"
  ) => {
    setSelectedPlan(plan);
    form.setFieldValue("accountType", {
      planId: pricingId || "",
      planName: plan,
      lookUpKey: lookUpKey || undefined,
      isEnterpriseAccount: plan === "personal" || plan === "professional",
      billingInterval,
    });
    setCurrentStep(1);
  };

  const nextStep = () => {
    form.validate();
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const goToPlanSelection = () => {
    setCurrentStep(0);
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    field?: keyof ISignupForm
  ) => {
    if (typeof e === "string" && field) {
      form.setFieldValue(field, e);
      return;
    } else if (typeof e !== "string") {
      form.setFieldValue(e.target.name, e.target.value);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const formData = {
        ...values,
      };
      if (!values.accountType.isEnterpriseAccount) {
        formData.companyProfile = undefined;
      }
      const response = await mutateAsync(formData);
      openNotification(
        "success",
        "Registration successful",
        response.msg || "Registration successful"
      );
      form.reset();
      router.replace("/login");
    } catch {
      // Error handling is now centralized via global error handler
    }
  };

  return {
    form,
    isPending,
    currentStep,
    nextStep,
    prevStep,
    goToPlanSelection,
    handleOnChange,
    handleSubmit,
    selectedPlan,
    handleSelectPlan,
    plansData,
    isLoadingPlans,
    isPlansError,
  };
}
