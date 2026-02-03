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
  } = useRegisterLogic();

  return (
    <RegisterView
      form={form}
      isPending={isPending}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
      accountType={accountType}
      goToPlanSelection={goToPlanSelection}
      goToAccountTypeSelection={goToAccountTypeSelection}
      handleSelectAccountType={handleSelectAccountType}
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
