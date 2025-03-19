/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Link from "next/link";
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

const dropdownOptions = [
  { value: "apple", label: "Apple 🍎" },
  { value: "banana", label: "Banana 🍌" },
  { value: "orange", label: "Orange 🍊", disabled: true }, // Disabled option
  { value: "grape", label: "Grape 🍇" },
];

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
        <Form
          onSubmit={handleSubmit}
          id="register-form"
          className="auth-form"
          autoComplete="false"
        >
          <div className="form-fields">
            <FloatingLabelInput
              id="firstName"
              name="firstName"
              value=""
              onChange={() => {}}
              label="First name"
              required
            />
            <FloatingLabelInput
              id="lastName"
              name="lastName"
              value=""
              onChange={() => {}}
              label="Last name"
              required
            />
          </div>

          <div className="form-fields">
            <FloatingLabelInput
              id="email"
              name="email"
              value=""
              onChange={() => {}}
              label="Email"
              type="email"
              required
            />
          </div>

          <div className="form-fields">
            <CustomDropdown
              id="location"
              placeholder="Select a location"
              value="Lagos"
              onChange={(v) => {
                console.log("----value: ", v);
              }}
              options={dropdownOptions}
              required
            />
          </div>

          <div className="form-fields">
            <FloatingLabelInput
              id="phoneNumber"
              name="phoneNumber"
              value=""
              onChange={() => {}}
              label="Phone number"
              required
            />
          </div>

          <div className="form-fields">
            <FloatingLabelInput
              id="password"
              name="password"
              value=""
              onChange={() => {}}
              label="Password"
              type="password"
              required
            />

            <FloatingLabelInput
              id="cpassword"
              name="cpassword"
              value=""
              onChange={() => {}}
              label="Confirm password"
              type="password"
              required
            />
          </div>

          <div className="form-fields">
            <CustomDropdown
              id="accountType"
              placeholder="Acount type"
              value=""
              onChange={(v) => {
                console.log("----value: ", v);
              }}
              options={[
                { value: "personal", label: "Personal" },
                { value: "corporate", label: "Business" },
              ]}
              required
            />
          </div>

          <div className="action-fields">
            <Button label="Next" className="btn btn-primary" />
          </div>
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
