import { ChangeEvent } from "react";
import { ISignupForm } from "@interfaces/index";
import { UseFormReturnType } from "@mantine/form";
import { Button, Form } from "@components/FormElements";
import {
  AuthContentHeader,
  AuthContentFooter,
  AuthContentBody,
} from "@components/AuthLayout";

import UserInfo from "../UserInfo";
import CompanyInfo from "../CompanyInfo";

interface RegisterViewProps {
  form: UseFormReturnType<ISignupForm, (values: ISignupForm) => ISignupForm>;
  isPending: boolean;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  handleOnChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    field?: keyof ISignupForm
  ) => void;
  handleSubmit: (values: ISignupForm) => void;
}

export function RegisterView({
  form,
  isPending,
  currentStep,
  nextStep,
  prevStep,
  handleOnChange,
  handleSubmit,
}: RegisterViewProps) {
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
        subtitle="Already have an account?"
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
      <AuthContentFooter />
    </>
  );
}
