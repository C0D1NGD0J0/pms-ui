/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  AuthContentHeader,
  AuthContenFooter,
  AuthContentBody,
} from "@components/AuthLayout";
import { SignupSchema } from "@validations/auth.validations";
import { useNotification } from "@hooks/useNotification";
import { Button, Form } from "@components/FormElements";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";
import { objectToFormData } from "@utils/helpers";
import { ISignupForm } from "@interfaces/index";
import { ChangeEvent, useState } from "react";
import { authService } from "@services/auth";
import { useForm } from "@mantine/form";

import CompanyInfo from "./CompanyInfo";
import UserInfo from "./UserInfo";

const dropdownOptions = [
  { value: "apple", label: "Apple 🍎" },
  { value: "banana", label: "Banana 🍌" },
  { value: "orange", label: "Orange 🍊", disabled: true }, // Disabled option
  { value: "grape", label: "Grape 🍇" },
];

export default function Register() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.signup,
  });
  const { openNotification } = useNotification();
  const form = useForm<ISignupForm, (values: ISignupForm) => ISignupForm>({
    initialValues: {
      firstName: "wayne",
      lastName: "rooney",
      email: "wayne@example.com",
      password: "password",
      cpassword: "password",
      location: "lagos",
      accountType: {
        planId: "business",
        planName: "business",
        isCorporate: true,
      },
      phoneNumber: "2348105308755",
      displayName: "MasterRooney",
      companyProfile: {
        tradingName: "wedabest",
        legalEntityName: "wedabest-records",
        website: "",
        companyEmail: "wedabest@example.com",
        companyPhone: "123456999",
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
      <AuthContenFooter
        footerLink="/"
        footerLinkText="Privacy & Terms of Service"
        footerText="By continuing, you agree to accept our"
      />
    </>
  );
}
