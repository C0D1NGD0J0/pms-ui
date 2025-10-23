import Image from "next/image";
import { UseFormReturnType } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { FormSection } from "@components/FormLayout/formSection";
import {
  PersonalInfoFormValues,
  ProfileFormValues,
} from "@validations/profile.validations";
import {
  DatePicker,
  FileInput,
  FormField,
  FormInput,
  FormLabel,
} from "@components/FormElements";

interface PersonalInfoTabProps {
  profileForm: UseFormReturnType<ProfileFormValues>;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleProfilePhotoChange: (file: File | null) => void;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  profileForm,
  handleNestedChange,
  handleProfilePhotoChange,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const personalInfo = profileForm.values
    .personalInfo as PersonalInfoFormValues;
  const avatarUrl = personalInfo?.avatar?.url;

  const cleanAvatarUrl = avatarUrl ? decodeURIComponent(avatarUrl.trim()) : "";

  const handleDateChange = (value: string, field?: string) => {
    if (field === "personalInfo.dob") {
      const dateValue = value ? new Date(value) : null;
      handleNestedChange("personalInfo", "dob", dateValue);
    }
  };

  const handlePhotoChangeWithPreview = async (file: File | null) => {
    if (file) {
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setImageError(true);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setImageError(true);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageError(false);

      handleNestedChange("personalInfo", "avatar", {
        ...personalInfo.avatar,
        url: previewUrl,
      });

      handleProfilePhotoChange(file);
    } else {
      setImagePreview(null);
      setImageError(false);
      handleNestedChange("personalInfo", "avatar", {
        url: "",
        filename: "",
        key: "",
      });
      handleProfilePhotoChange(null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const displayImageSrc =
    imagePreview ||
    (imageError || !cleanAvatarUrl
      ? "/assets/imgs/avatar.png"
      : cleanAvatarUrl);

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
              src={displayImageSrc}
              alt="Profile"
              width={100}
              height={100}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
              onError={() => {
                setImageError(true);
              }}
              onLoad={() => {
                setImageError(false);
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FileInput
              accept="image/*"
              onChange={(file) => {
                if (file && !Array.isArray(file)) {
                  handlePhotoChangeWithPreview(file);
                } else {
                  handlePhotoChangeWithPreview(null);
                }
              }}
              instructionText={
                imageError
                  ? "Invalid file. Please select a valid image under 5MB"
                  : "JPG, PNG or WEBP (max 5MB). Recommended size: 400x400px"
              }
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Basic Information"
        description="Your personal details and contact information"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg:
                (profileForm.errors["personalInfo.firstName"] as string) || "",
              touched: profileForm.isTouched("personalInfo.firstName"),
            }}
          >
            <FormLabel htmlFor="firstName" label="First Name" />
            <FormInput
              id="firstName"
              name="personalInfo.firstName"
              type="text"
              value={
                (profileForm.values.personalInfo as PersonalInfoFormValues)
                  ?.firstName || ""
              }
              onChange={(e) =>
                handleNestedChange("personalInfo", "firstName", e.target.value)
              }
              required
              hasError={!!profileForm.errors["personalInfo.firstName"]}
            />
          </FormField>
          <FormField
            error={{
              msg:
                (profileForm.errors["personalInfo.lastName"] as string) || "",
              touched: profileForm.isTouched("personalInfo.lastName"),
            }}
          >
            <FormLabel htmlFor="lastName" label="Last Name" />
            <FormInput
              id="lastName"
              required
              name="personalInfo.lastName"
              type="text"
              value={
                (profileForm.values.personalInfo as PersonalInfoFormValues)
                  ?.lastName || ""
              }
              onChange={(e) =>
                handleNestedChange("personalInfo", "lastName", e.target.value)
              }
              hasError={!!profileForm.errors["personalInfo.lastName"]}
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField
            error={{
              msg:
                (profileForm.errors["personalInfo.displayName"] as string) ||
                "",
              touched: profileForm.isTouched("personalInfo.displayName"),
            }}
          >
            <FormLabel htmlFor="displayName" label="Display Name" />
            <FormInput
              id="displayName"
              required
              name="personalInfo.displayName"
              type="text"
              value={
                (profileForm.values.personalInfo as PersonalInfoFormValues)
                  ?.displayName || ""
              }
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "displayName",
                  e.target.value
                )
              }
              hasError={!!profileForm.errors["personalInfo.displayName"]}
            />
          </FormField>
          <FormField
            error={{
              msg:
                (profileForm.errors["personalInfo.phoneNumber"] as string) ||
                "",
              touched: profileForm.isTouched("personalInfo.phoneNumber"),
            }}
          >
            <FormLabel htmlFor="phoneNumber" label="Phone Number" />
            <FormInput
              id="phoneNumber"
              name="personalInfo.phoneNumber"
              type="tel"
              value={
                (profileForm.values.personalInfo as PersonalInfoFormValues)
                  ?.phoneNumber || ""
              }
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "phoneNumber",
                  e.target.value
                )
              }
              hasError={!!profileForm.errors["personalInfo.phoneNumber"]}
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField
            error={{
              msg: (profileForm.errors["personalInfo.dob"] as string) || "",
              touched: profileForm.isTouched("personalInfo.dob"),
            }}
          >
            <FormLabel htmlFor="dob" label="Date of Birth" />
            <DatePicker
              id="dob"
              name="personalInfo.dob"
              value={
                (profileForm.values.personalInfo as PersonalInfoFormValues)?.dob
                  ? (profileForm.values.personalInfo as PersonalInfoFormValues)
                      .dob!.toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={handleDateChange}
              placeholder="Select date of birth"
              hasError={!!profileForm.errors["personalInfo.dob"]}
            />
          </FormField>
          <FormField
            error={{
              msg:
                (profileForm.errors["personalInfo.location"] as string) || "",
              touched: profileForm.isTouched("personalInfo.location"),
            }}
          >
            <FormLabel htmlFor="location" label="Location" />
            <FormInput
              id="location"
              required
              name="personalInfo.location"
              type="text"
              value={
                (profileForm.values.personalInfo as PersonalInfoFormValues)
                  ?.location || ""
              }
              onChange={(e) =>
                handleNestedChange("personalInfo", "location", e.target.value)
              }
              hasError={!!profileForm.errors["personalInfo.location"]}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Professional Information"
        description="Your headline and bio information"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg:
                (profileForm.errors["personalInfo.headline"] as string) || "",
              touched: profileForm.isTouched("personalInfo.headline"),
            }}
          >
            <FormLabel htmlFor="headline" label="Headline" />
            <FormInput
              id="headline"
              name="personalInfo.headline"
              type="text"
              value={
                (profileForm.values.personalInfo as PersonalInfoFormValues)
                  ?.headline || ""
              }
              onChange={(e) =>
                handleNestedChange("personalInfo", "headline", e.target.value)
              }
              hasError={!!profileForm.errors["personalInfo.headline"]}
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField
            error={{
              msg: (profileForm.errors["personalInfo.bio"] as string) || "",
              touched: profileForm.isTouched("personalInfo.bio"),
            }}
          >
            <FormLabel htmlFor="bio" label="Bio" />
            <textarea
              id="bio"
              name="personalInfo.bio"
              rows={4}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              value={
                (profileForm.values.personalInfo as PersonalInfoFormValues)
                  ?.bio || ""
              }
              onChange={(e) =>
                handleNestedChange("personalInfo", "bio", e.target.value)
              }
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
