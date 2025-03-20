/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { message, Steps } from "antd";
import {
  AuthContenFooter,
  AuthContentBody,
  AuthContentHeader,
} from "@components/AuthLayout";
import {
  Button,
  Form,
  CustomDropdown,
  FloatingLabelInput,
} from "@components/FormElements";
import UserInfo from "./UserInfo";
import CompanyInfo from "./CompanyInfo";

const dropdownOptions = [
  { value: "apple", label: "Apple 🍎" },
  { value: "banana", label: "Banana 🍌" },
  { value: "orange", label: "Orange 🍊", disabled: true }, // Disabled option
  { value: "grape", label: "Grape 🍇" },
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (_values: unknown) => {};

  const renderButtons = () => {
    if (currentStep === 0) {
      return (
        <Button label="Next" className="btn btn-primary" onClick={nextStep} />
      );
    } else if (currentStep === 1) {
      return (
        <>
          <Button label="Back" className="btn btn-outline" onClick={prevStep} />
          <Button label="Register" className="btn btn-primary" />
        </>
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
          onSubmit={handleSubmit}
          id="register-form"
          className="auth-form"
          autoComplete="false"
        >
          {currentStep === 0 ? <UserInfo /> : <CompanyInfo />}
          <div className="action-fields">{renderButtons()}</div>
        </Form>
      </AuthContentBody>
      <AuthContenFooter
        footerText="By continuing, you agree to accept our"
        footerLink="/"
        footerLinkText="Privacy & Terms of Service"
      />
    </>
  );
}
