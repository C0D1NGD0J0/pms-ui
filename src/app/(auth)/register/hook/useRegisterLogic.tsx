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

const user2 = {
  firstName: "John",
  lastName: "Dangote",
  email: "john.dangote@example.com",
  password: "Password",
  cpassword: "Password",
  location: "Lagos, Nigeria",
  accountType: {
    planId: "",
    lookUpKey: undefined,
    planName: "" as "essential" | "growth" | "portfolio",
    isEnterpriseAccount: false,
    category: "individual" as const,
    billingInterval: "monthly" as const,
  },
  phoneNumber: "2348105301122",
  displayName: "John Dangote",
  companyProfile: {
    tradingName: "Dangote Realty Group",
    legalEntityName: "Dangote Realty Group LLC",
    website: "https://www.dangoterealty.com",
    companyEmail: "contact@dangoterealty.com",
    companyPhone: "2348105301122",
    companyAddress: "123 Business Street, Lagos, Nigeria",
  },
};

export function useRegisterLogic() {
  const { handleMutationError } = useErrorHandler();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.signup,
    onError: (error) => {
      handleMutationError(error, "Registration failed");
    },
  });
  const { openNotification } = useNotification();
  const {
    data: plansData,
    isLoading: isLoadingPlans,
    isError: isPlansError,
  } = useGetSubscriptionPlans();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState<
    "business" | "individual" | null
  >(null);
  const [selectedPlan, setSelectedPlan] = useState<
    "essential" | "growth" | "portfolio" | null
  >(null);

  const form = useForm<ISignupForm, (values: ISignupForm) => ISignupForm>({
    validateInputOnChange: true,
    initialValues: user2,
    validate: zodResolver(SignupSchema) as any,
  });

  const handleSelectAccountType = (type: "business" | "individual") => {
    setAccountType(type);
    setCurrentStep(1);
  };

  const handleSelectPlan = (
    plan: "essential" | "growth" | "portfolio",
    pricingId: string | null,
    lookUpKey: string | null,
    billingInterval: "monthly" | "annual"
  ) => {
    setSelectedPlan(plan);
    form.setFieldValue("accountType", {
      planId: pricingId || "",
      planName: plan,
      category: accountType as "individual" | "business",
      lookUpKey: lookUpKey || undefined,
      isEnterpriseAccount: accountType === "business",
      billingInterval,
    });
    setCurrentStep(2);
  };

  const nextStep = () => {
    form.validate();
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const goToPlanSelection = () => {
    setCurrentStep(1);
  };

  const goToAccountTypeSelection = () => {
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
      // error handling is now centralized via global error handler
    }
  };

  return {
    form,
    isPending,
    currentStep,
    nextStep,
    prevStep,
    accountType,
    goToPlanSelection,
    goToAccountTypeSelection,
    handleSelectAccountType,
    handleOnChange,
    handleSubmit,
    selectedPlan,
    handleSelectPlan,
    plansData,
    isLoadingPlans,
    isPlansError,
  };
}
