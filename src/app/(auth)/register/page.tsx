/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Link from "next/link";
import { Button, Result } from "antd";
import {
  AuthContenFooter,
  AuthContentBody,
  AuthContentHeader,
} from "@components/AuthLayout";

export default function Register() {
  const nextStep = () => {};

  const prevStep = () => {};

  const handleSubmit = async (_values: unknown) => {};

  return (
    <>
      <AuthContentHeader
        title="Register"
        subtitle="Alredy have an account?"
        headerLink="/login"
        headerLinkText="Login"
      />
      <AuthContentBody>
        <h1>Welcome, sign up here.</h1>
      </AuthContentBody>
      <AuthContenFooter
        footerText="By continuing, you agree to accept our"
        footerLink="/"
        footerLinkText="Privacy & Terms of Service"
      />
    </>
  );
}
