import React from "react";
import Image from "next/image";
import { FormSection } from "@components/FormLayout/formSection";
import {
  FormField,
  FormInput,
  FormLabel,
  FileInput,
} from "@components/FormElements";

interface PersonalInfoTabProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  handleProfilePhotoChange: (file: File | null) => void;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  handleInputChange,
  handleProfilePhotoChange,
}) => {
  return (
    <div className="resource-form">
      <FormSection
        title="Profile Photo"
        description="Upload or change your profile picture"
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "2rem",
            padding: "1rem 0",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #e0e0e0",
              flexShrink: 0,
            }}
          >
            <Image
              src={
                formData.personalInfo.avatar.url || "/assets/imgs/avatar.png"
              }
              alt="Profile"
              fill
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FileInput
              accept="image/*"
              onChange={handleProfilePhotoChange}
              instructionText="JPG, PNG or WEBP (max 5MB). Recommended size: 400x400px"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Basic Information"
        description="Your personal details and contact information"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="firstName" label="First Name" />
            <FormInput
              id="firstName"
              name="firstName"
              type="text"
              value={formData.personalInfo.firstName}
              onChange={(e) =>
                handleInputChange("personalInfo", "firstName", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="lastName" label="Last Name" />
            <FormInput
              id="lastName"
              name="lastName"
              type="text"
              value={formData.personalInfo.lastName}
              onChange={(e) =>
                handleInputChange("personalInfo", "lastName", e.target.value)
              }
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="displayName" label="Display Name" />
            <FormInput
              id="displayName"
              name="displayName"
              type="text"
              value={formData.personalInfo.displayName}
              onChange={(e) =>
                handleInputChange("personalInfo", "displayName", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="phoneNumber" label="Phone Number" />
            <FormInput
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.personalInfo.phoneNumber}
              onChange={(e) =>
                handleInputChange("personalInfo", "phoneNumber", e.target.value)
              }
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="dob" label="Date of Birth" />
            <FormInput
              id="dob"
              name="dob"
              type="date"
              value={
                formData.personalInfo.dob
                  ? formData.personalInfo.dob.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleInputChange(
                  "personalInfo",
                  "dob",
                  new Date(e.target.value)
                )
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="location" label="Location" />
            <FormInput
              id="location"
              name="location"
              type="text"
              value={formData.personalInfo.location}
              onChange={(e) =>
                handleInputChange("personalInfo", "location", e.target.value)
              }
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Professional Information"
        description="Your headline and bio information"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="headline" label="Headline" />
            <FormInput
              id="headline"
              name="headline"
              type="text"
              value={formData.personalInfo.headline}
              onChange={(e) =>
                handleInputChange("personalInfo", "headline", e.target.value)
              }
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="bio" label="Bio" />
            <textarea
              id="bio"
              name="bio"
              rows={4}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              value={formData.personalInfo.bio}
              onChange={(e) =>
                handleInputChange("personalInfo", "bio", e.target.value)
              }
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
