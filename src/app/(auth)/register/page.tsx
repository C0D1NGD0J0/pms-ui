/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  AuthContenFooter,
  AuthContentBody,
  AuthContentHeader,
} from "@components/AuthLayout";
import { Button, Form } from "@components/FormElements";
import { useNotification } from "@hooks/useNotification";
import CompanyInfo from "@app/(auth)/register/CompanyInfo";
import { ISignupForm } from "@interfaces/index";

import UserInfo from "./UserInfo";
import { SignupSchema } from "@validations/auth.validations";

const dropdownOptions = [
  { value: "apple", label: "Apple 🍎" },
  { value: "banana", label: "Banana 🍌" },
  { value: "orange", label: "Orange 🍊", disabled: true }, // Disabled option
  { value: "grape", label: "Grape 🍇" },
];

export default function Register() {
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
        isEnterpriseAccount: false,
      },
      phoneNumber: "",
      displayName: "",
      companyProfile: {
        tradingName: "",
        legalEntityName: "",
        website: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
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
  const handleSubmit = async (e: typeof form.values) => {
    console.log(e, "values");
    openNotification(
      "success",
      "Registration successful",
      "You have successfully"
    );
  };

  const renderButtons = (disable = false) => {
    const isBusnessAccount = form.values.accountType.isEnterpriseAccount;
    if (currentStep === 0 && isBusnessAccount) {
      return (
        <Button label="Next" className="btn btn-primary" onClick={nextStep} />
      );
    } else if (currentStep === 1 && isBusnessAccount) {
      return (
        <>
          <Button label="Back" className="btn btn-outline" onClick={prevStep} />
          <Button
            label="Register"
            className="btn btn-primary"
            type="submit"
            disabled={disable}
          />
        </>
      );
    } else {
      return (
        <Button
          label="Register"
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
