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
    goToPlanSelection,
    handleOnChange,
    handleSubmit,
    selectedPlan,
    handleSelectPlan,
    plansData,
    isLoadingPlans,
    isPlansError,
  } = useRegisterLogic();

  return (
    <RegisterView
      form={form}
      isPending={isPending}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
      goToPlanSelection={goToPlanSelection}
      handleOnChange={handleOnChange}
      handleSubmit={handleSubmit}
      selectedPlan={selectedPlan}
      handleSelectPlan={handleSelectPlan}
      plansData={plansData}
      isLoadingPlans={isLoadingPlans}
      isPlansError={isPlansError}
    />
  );
}
