import { useForm } from "@mantine/form";
import { authService } from "@services/auth";
import { ChangeEvent, useState } from "react";
import { ISignupForm } from "@interfaces/index";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { SignupSchema } from "@validations/auth.validations";

export function useRegisterLogic() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.signup,
  });
  const { openNotification } = useNotification();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<ISignupForm, (values: ISignupForm) => ISignupForm>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      cpassword: "",
      location: "",
      accountType: {
        planId: "",
        planName: "",
        isCorporate: false,
      },
      phoneNumber: "",
      displayName: "",
      companyProfile: {
        tradingName: "",
        legalEntityName: "",
        website: "",
        companyEmail: "",
        companyPhone: "",
      },
    },
    validateInputOnChange: true,
    validate: zodResolver(SignupSchema) as any,
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
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
      if (!values.accountType.isCorporate) {
        formData.companyProfile = undefined;
      }
      const response = await mutateAsync(formData);
      openNotification(
        "success",
        "Registration successful",
        response.msg || "Registration successful"
      );
      form.reset();
      setCurrentStep(0);
    } catch (error: any) {
      let result = "\n";
      error.errors.forEach((err: any, idx: number) => {
        result += `${idx + 1}:  ${err.message}. 
        `;
      });
      openNotification("error", "Registration failed.", result);
    }
  };

  return {
    form,
    isPending,
    currentStep,
    nextStep,
    prevStep,
    handleOnChange,
    handleSubmit,
  };
}
