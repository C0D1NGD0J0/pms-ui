"use client";
import React from "react";

import { RegisterView } from "./view";
import { useRegisterLogic } from "./hook/useRegisterLogic";

export default function Register() {
  const {
    form,
    isPending,
    currentStep,
    nextStep,
    prevStep,
    handleOnChange,
    handleSubmit,
    selectedPlan,
    handleSelectPlan,
  } = useRegisterLogic();

  return (
    <RegisterView
      form={form}
      isPending={isPending}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
      handleOnChange={handleOnChange}
      handleSubmit={handleSubmit}
      selectedPlan={selectedPlan}
      handleSelectPlan={handleSelectPlan}
    />
  );
}
