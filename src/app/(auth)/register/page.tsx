/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useForm } from "@mantine/form";
import { authService } from "@services/auth";
import { ChangeEvent, useState } from "react";
import { ISignupForm } from "@interfaces/index";
import { objectToFormData } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { Button, Form } from "@components/FormElements";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { SignupSchema } from "@validations/auth.validations";
import {
  AuthContentHeader,
  AuthContenFooter,
  AuthContentBody,
} from "@components/AuthLayout";

import UserInfo from "./UserInfo";
import CompanyInfo from "./CompanyInfo";

export default function Register() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.signup,
  });
  const { openNotification } = useNotification();
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
    validate: zodResolver(SignupSchema),
  });
  const [currentStep, setCurrentStep] = useState(0);

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

  const renderButtons = (disable = false) => {
    const isBusnessAccount = form.values.accountType.isCorporate;
    if (currentStep === 0 && isBusnessAccount) {
      return (
        <Button label="Next" className="btn btn-primary" onClick={nextStep} />
      );
    } else if (currentStep === 1 && isBusnessAccount) {
      return (
        <>
          <Button label="Back" className="btn btn-outline" onClick={prevStep} />
          <Button
            label={`${isPending ? "Processing..." : "Register"}`}
            className="btn btn-primary"
            type="submit"
            disabled={disable}
          />
        </>
      );
    } else {
      return (
        <Button
          label={`${isPending ? "Processing..." : "Register"}`}
          className="btn btn-primary"
          type="submit"
          disabled={disable}
        />
      );
    }
  };

  return (
    <>
      <AuthContentHeader
        title="Register"
        subtitle="Alredy have an account?"
        headerLink="/login"
        headerLinkText="Login"
      />
      <AuthContentBody>
        <Form
          onSubmit={form.onSubmit(handleSubmit)}
          id="auth-form"
          className="auth-form"
          disabled={isPending}
          autoComplete="off"
        >
          {currentStep === 0 ? (
            <UserInfo formContext={form} onChange={handleOnChange} />
          ) : (
            <CompanyInfo formContext={form} onChange={handleOnChange} />
          )}
          <div className="action-fields">{renderButtons(!form.isValid())}</div>
        </Form>
      </AuthContentBody>
      <AuthContenFooter />
    </>
  );
}
