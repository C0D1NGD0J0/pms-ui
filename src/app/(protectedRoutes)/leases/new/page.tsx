"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@components/PageElements";
import { AccordionContainer, AccordionItem } from "@components/Accordion";
import {
  DatePicker,
  FormField,
  FormLabel,
  FormInput,
  FileInput,
  Checkbox,
  TextArea,
  Button,
  Select,
  Toggle,
} from "@components/FormElements";

// Placeholder components for now - will be built out later
const PropertySelectionForm = () => {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [propertyHasUnits, setPropertyHasUnits] = useState(false);

  // Placeholder options - will be fetched from API
  const propertyOptions = [
    { value: "", label: "Select a property" },
    { value: "prop-1", label: "Sunset Towers - 123 Main St" },
    { value: "prop-2", label: "Oak Street Plaza - 456 Oak St" },
  ];

  const unitOptions = [
    { value: "", label: "Select a unit" },
    { value: "unit-1", label: "Unit 101" },
    { value: "unit-2", label: "Unit 102" },
    { value: "unit-3", label: "Unit 201" },
  ];

  const handlePropertyChange = (value: string) => {
    setSelectedProperty(value);
    // In real implementation, check if selected property has units
    // For now, show units for prop-1 only
    setPropertyHasUnits(value === "prop-1");
  };

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="property" label="Property" required />
          <Select
            id="property"
            name="property.id"
            onChange={handlePropertyChange}
            options={propertyOptions}
            placeholder="Select property"
            value={selectedProperty}
          />
        </FormField>
      </div>

      {propertyHasUnits && selectedProperty && (
        <div className="form-fields">
          <FormField
            error={{
              msg: "",
              touched: false,
            }}
          >
            <FormLabel htmlFor="unit" label="Unit" required />
            <Select
              id="unit"
              name="property.unitId"
              onChange={() => {}}
              options={unitOptions}
              placeholder="Select unit"
              value=""
            />
          </FormField>
        </div>
      )}
    </>
  );
};

const TenantInfoForm = () => {
  const [useExistingTenant, setUseExistingTenant] = useState(true);

  // Placeholder options - will be fetched from API
  const tenantOptions = [
    { value: "", label: "Select a tenant" },
    { value: "tenant-1", label: "John Doe - john.doe@example.com" },
    { value: "tenant-2", label: "Jane Smith - jane.smith@example.com" },
  ];

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="tenantType" label="Tenant Selection Type" />
          <Select
            id="tenantType"
            name="tenantType"
            onChange={(e) => setUseExistingTenant(e === "existing")}
            options={[
              { value: "existing", label: "Select Existing Tenant" },
              { value: "invite", label: "Invite New Tenant" },
            ]}
            value={useExistingTenant ? "existing" : "invite"}
          />
        </FormField>
      </div>

      {useExistingTenant ? (
        <div className="form-fields">
          <FormField
            error={{
              msg: "",
              touched: false,
            }}
          >
            <FormLabel htmlFor="tenantId" label="Tenant" required />
            <Select
              id="tenantId"
              name="tenantInfo.id"
              onChange={() => {}}
              options={tenantOptions}
              placeholder="Select tenant"
              value=""
            />
          </FormField>
        </div>
      ) : (
        <>
          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel htmlFor="tenantEmail" label="Tenant Email" required />
              <FormInput
                id="tenantEmail"
                name="tenantInfo.email"
                type="email"
                onChange={() => {}}
                placeholder="Enter tenant email"
                value=""
                hasError={false}
              />
            </FormField>
          </div>
          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel htmlFor="tenantName" label="Tenant Name" />
              <FormInput
                id="tenantName"
                name="tenantName"
                type="text"
                onChange={() => {}}
                placeholder="Enter tenant name"
                value=""
                hasError={false}
              />
            </FormField>
          </div>
        </>
      )}
    </>
  );
};

const LeaseTermsForm = () => {
  const leaseTypeOptions = [
    { value: "", label: "Select lease type" },
    { value: "fixed_term", label: "Fixed Term" },
    { value: "month_to_month", label: "Month to Month" },
  ];

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="leaseType" label="Lease Type" required />
          <Select
            id="leaseType"
            name="type"
            onChange={() => {}}
            options={leaseTypeOptions}
            placeholder="Select lease type"
            value=""
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="startDate" label="Start Date" required />
          <DatePicker
            id="startDate"
            name="duration.startDate"
            onChange={() => {}}
            placeholder="Select start date"
            value={null}
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="endDate" label="End Date" required />
          <DatePicker
            id="endDate"
            name="duration.endDate"
            onChange={() => {}}
            placeholder="Select end date"
            value={null}
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="moveInDate" label="Move-In Date" />
          <DatePicker
            id="moveInDate"
            name="duration.moveInDate"
            onChange={() => {}}
            placeholder="Select move-in date (optional)"
            value={null}
          />
        </FormField>
      </div>
    </>
  );
};

const FinancialDetailsForm = () => {
  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
  ];

  const paymentMethodOptions = [
    { value: "", label: "Select payment method" },
    { value: "e-transfer", label: "E-Transfer" },
    { value: "credit_card", label: "Credit Card" },
    { value: "crypto", label: "Cryptocurrency" },
  ];

  const lateFeeTypeOptions = [
    { value: "", label: "Select late fee type" },
    { value: "fixed", label: "Fixed Amount" },
    { value: "percentage", label: "Percentage" },
  ];

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="monthlyRent" label="Monthly Rent" required />
          <FormInput
            id="monthlyRent"
            name="fees.monthlyRent"
            type="number"
            onChange={() => {}}
            placeholder="Enter monthly rent"
            value=""
            hasError={false}
            min="0"
            step="0.01"
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel
            htmlFor="securityDeposit"
            label="Security Deposit"
            required
          />
          <FormInput
            id="securityDeposit"
            name="fees.securityDeposit"
            type="number"
            onChange={() => {}}
            placeholder="Enter security deposit"
            value=""
            hasError={false}
            min="0"
            step="0.01"
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="rentDueDay" label="Rent Due Day" required />
          <FormInput
            id="rentDueDay"
            name="fees.rentDueDay"
            type="number"
            onChange={() => {}}
            placeholder="Day of month (1-31)"
            value=""
            hasError={false}
            min="1"
            max="31"
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="currency" label="Currency" />
          <Select
            id="currency"
            name="fees.currency"
            onChange={() => {}}
            options={currencyOptions}
            value="USD"
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="paymentMethod" label="Accepted Payment Method" />
          <Select
            id="paymentMethod"
            name="fees.acceptedPaymentMethod"
            onChange={() => {}}
            options={paymentMethodOptions}
            placeholder="Select payment method"
            value=""
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="lateFeeAmount" label="Late Fee Amount" />
          <FormInput
            id="lateFeeAmount"
            name="fees.lateFeeAmount"
            type="number"
            onChange={() => {}}
            placeholder="Enter late fee amount"
            value=""
            hasError={false}
            min="0"
            step="0.01"
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel
            htmlFor="lateFeeDays"
            label="Late Fee Grace Period (Days)"
          />
          <FormInput
            id="lateFeeDays"
            name="fees.lateFeeDays"
            type="number"
            onChange={() => {}}
            placeholder="Days after due date"
            value=""
            hasError={false}
            min="1"
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="lateFeeType" label="Late Fee Type" />
          <Select
            id="lateFeeType"
            name="fees.lateFeeType"
            onChange={() => {}}
            options={lateFeeTypeOptions}
            placeholder="Select late fee type"
            value=""
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="lateFeePercentage" label="Late Fee Percentage" />
          <FormInput
            id="lateFeePercentage"
            name="fees.lateFeePercentage"
            type="number"
            onChange={() => {}}
            placeholder="Enter percentage (0-100)"
            value=""
            hasError={false}
            min="0"
            max="100"
            step="0.01"
          />
        </FormField>
      </div>
    </>
  );
};

const AdditionalTermsForm = () => {
  const [petPolicyAllowed, setPetPolicyAllowed] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);

  const utilities = [
    { value: "water", label: "Water" },
    { value: "gas", label: "Gas" },
    { value: "electricity", label: "Electricity" },
    { value: "internet", label: "Internet" },
    { value: "cable", label: "Cable" },
    { value: "trash", label: "Trash" },
    { value: "sewer", label: "Sewer" },
    { value: "heating", label: "Heating" },
    { value: "cooling", label: "Cooling" },
  ];

  return (
    <>
      {/* Utilities Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Utilities Included
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {utilities.map((utility) => (
            <FormField
              key={utility.value}
              error={{
                msg: "",
                touched: false,
              }}
            >
              <Checkbox
                id={`utility-${utility.value}`}
                name={`utilitiesIncluded.${utility.value}`}
                label={utility.label}
                checked={false}
                onChange={() => {}}
              />
            </FormField>
          ))}
        </div>
      </div>

      {/* Pet Policy Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Pet Policy
        </h4>
        <div className="toggle-container">
          <div className="toggle-label">
            <p>Allow pets in this property</p>
          </div>
          <Toggle
            id="petPolicyAllowed"
            name="petPolicy.allowed"
            initialState={petPolicyAllowed}
            onChange={(checked) => setPetPolicyAllowed(checked)}
          />
        </div>

        {petPolicyAllowed && (
          <>
            <div className="form-fields">
              <FormField
                error={{
                  msg: "",
                  touched: false,
                }}
              >
                <FormLabel htmlFor="maxPets" label="Maximum Number of Pets" />
                <FormInput
                  id="maxPets"
                  name="petPolicy.maxPets"
                  type="number"
                  onChange={() => {}}
                  placeholder="Enter max number of pets"
                  value=""
                  hasError={false}
                  min="1"
                />
              </FormField>
              <FormField
                error={{
                  msg: "",
                  touched: false,
                }}
              >
                <FormLabel htmlFor="petTypes" label="Allowed Pet Types" />
                <FormInput
                  id="petTypes"
                  name="petPolicy.types"
                  type="text"
                  onChange={() => {}}
                  placeholder="e.g., Dogs, Cats"
                  value=""
                  hasError={false}
                />
              </FormField>
            </div>

            <div className="form-fields">
              <FormField
                error={{
                  msg: "",
                  touched: false,
                }}
              >
                <FormLabel htmlFor="petDeposit" label="Pet Deposit" />
                <FormInput
                  id="petDeposit"
                  name="petPolicy.deposit"
                  type="number"
                  onChange={() => {}}
                  placeholder="Enter pet deposit amount"
                  value=""
                  hasError={false}
                  min="0"
                  step="0.01"
                />
              </FormField>
              <FormField
                error={{
                  msg: "",
                  touched: false,
                }}
              >
                <FormLabel htmlFor="petMonthlyFee" label="Monthly Pet Fee" />
                <FormInput
                  id="petMonthlyFee"
                  name="petPolicy.monthlyFee"
                  type="number"
                  onChange={() => {}}
                  placeholder="Enter monthly pet fee"
                  value=""
                  hasError={false}
                  min="0"
                  step="0.01"
                />
              </FormField>
            </div>
          </>
        )}
      </div>

      {/* Renewal Options Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Renewal Options
        </h4>
        <div className="toggle-container">
          <div className="toggle-label">
            <p>Automatically renew this lease when it expires</p>
          </div>
          <Toggle
            id="autoRenew"
            name="renewalOptions.autoRenew"
            initialState={autoRenew}
            onChange={(checked) => setAutoRenew(checked)}
          />
        </div>

        {autoRenew && (
          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor="noticePeriodDays"
                label="Notice Period (Days)"
              />
              <FormInput
                id="noticePeriodDays"
                name="renewalOptions.noticePeriodDays"
                type="number"
                onChange={() => {}}
                placeholder="Days before end date"
                value=""
                hasError={false}
                min="1"
              />
            </FormField>
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor="renewalTermMonths"
                label="Renewal Term (Months)"
              />
              <FormInput
                id="renewalTermMonths"
                name="renewalOptions.renewalTermMonths"
                type="number"
                onChange={() => {}}
                placeholder="Length of renewal term"
                value=""
                hasError={false}
                min="1"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Internal Notes Section */}
      <div>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Internal Notes
        </h4>
        <div className="form-fields">
          <FormField
            error={{
              msg: "",
              touched: false,
            }}
          >
            <FormLabel htmlFor="internalNotes" label="Notes" />
            <TextArea
              id="internalNotes"
              name="internalNotes"
              onChange={() => {}}
              placeholder="Add any internal notes about this lease (for internal use only)..."
              value=""
              rows={4}
              maxLength={2000}
            />
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                marginTop: "0.5rem",
                textAlign: "right",
              }}
            >
              0 / 2000 characters
            </p>
          </FormField>
        </div>
      </div>
    </>
  );
};

const CoTenantsForm = () => {
  const [coTenants, setCoTenants] = useState([
    { id: 1, name: "", email: "", phone: "", occupation: "" },
  ]);

  const addCoTenant = () => {
    setCoTenants([
      ...coTenants,
      { id: Date.now(), name: "", email: "", phone: "", occupation: "" },
    ]);
  };

  const removeCoTenant = (id: number) => {
    setCoTenants(coTenants.filter((ct) => ct.id !== id));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h4 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>
          Co-Tenants (Optional)
        </h4>
        <Button
          className="btn btn-outline btn-sm"
          label="Add Co-Tenant"
          icon={<i className="bx bx-plus"></i>}
          onClick={addCoTenant}
        />
      </div>

      {coTenants.map((coTenant, index) => (
        <div
          key={coTenant.id}
          style={{
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h5 style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>
              Co-Tenant {index + 1}
            </h5>
            {coTenants.length > 1 && (
              <Button
                className="btn btn-outline btn-sm"
                label="Remove"
                icon={<i className="bx bx-trash"></i>}
                onClick={() => removeCoTenant(coTenant.id)}
              />
            )}
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor={`coTenant-name-${coTenant.id}`}
                label="Name"
                required
              />
              <FormInput
                id={`coTenant-name-${coTenant.id}`}
                name={`coTenants.${index}.name`}
                type="text"
                onChange={() => {}}
                placeholder="Enter co-tenant name"
                value={coTenant.name}
                hasError={false}
              />
            </FormField>
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor={`coTenant-email-${coTenant.id}`}
                label="Email"
                required
              />
              <FormInput
                id={`coTenant-email-${coTenant.id}`}
                name={`coTenants.${index}.email`}
                type="email"
                onChange={() => {}}
                placeholder="Enter co-tenant email"
                value={coTenant.email}
                hasError={false}
              />
            </FormField>
          </div>

          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor={`coTenant-phone-${coTenant.id}`}
                label="Phone"
                required
              />
              <FormInput
                id={`coTenant-phone-${coTenant.id}`}
                name={`coTenants.${index}.phone`}
                type="tel"
                onChange={() => {}}
                placeholder="Enter co-tenant phone"
                value={coTenant.phone}
                hasError={false}
              />
            </FormField>
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor={`coTenant-occupation-${coTenant.id}`}
                label="Occupation"
              />
              <FormInput
                id={`coTenant-occupation-${coTenant.id}`}
                name={`coTenants.${index}.occupation`}
                type="text"
                onChange={() => {}}
                placeholder="Enter occupation (optional)"
                value={coTenant.occupation}
                hasError={false}
              />
            </FormField>
          </div>
        </div>
      ))}
    </>
  );
};

const DocumentsForm = () => {
  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Lease Documents
        </h4>
        <div className="form-fields">
          <FormField
            error={{
              msg: "",
              touched: false,
            }}
          >
            <FormLabel htmlFor="leaseDocuments" label="Upload Documents" />
            <FileInput
              onChange={() => {}}
              accept=".pdf,.doc,.docx"
              multiImage={true}
              instructionText="Select lease agreements and related documents"
              maxFiles={10}
              totalSizeAllowed={50}
              onError={(message) =>
                console.error("File upload error:", message)
              }
            />
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                marginTop: "0.5rem",
              }}
            >
              Upload lease agreements, addendums, or other related documents
              (PDF, DOC, DOCX)
            </p>
          </FormField>
        </div>
      </div>
    </>
  );
};

// Improved semantic preview component
const LeasePreviewContent = ({
  data,
  activeSection,
}: {
  data: any;
  activeSection: string;
}) => (
  <div className="lease-preview">
    {/* Property Information */}
    <section className="preview-section">
      <header className="section-header">
        <i className="bx bx-building"></i>
        <h3>Property Information</h3>
      </header>
      <dl className="info-list">
        <div className="info-item">
          <dt>Address</dt>
          <dd>{data?.property?.address || <em>Not selected</em>}</dd>
        </div>
        <div className="info-item">
          <dt>Unit</dt>
          <dd>{data?.property?.unit || <em>Not specified</em>}</dd>
        </div>
      </dl>
    </section>

    {/* Tenant Information */}
    <section className="preview-section">
      <header className="section-header">
        <i className="bx bx-user"></i>
        <h3>Tenant Details</h3>
      </header>
      <dl className="info-list">
        <div className="info-item">
          <dt>Primary Tenant</dt>
          <dd>{data?.tenant?.name || <em>Not selected</em>}</dd>
        </div>
        <div className="info-item">
          <dt>Email</dt>
          <dd>{data?.tenant?.email || <em>Not provided</em>}</dd>
        </div>
      </dl>
    </section>

    {/* Financial Summary */}
    <section className="preview-section">
      <header className="section-header">
        <i className="bx bx-dollar-circle"></i>
        <h3>Financial Summary</h3>
      </header>
      <dl className="info-list">
        <div className="info-item">
          <dt>Lease Period</dt>
          <dd>
            {data?.duration?.startDate ? (
              `${data.duration.startDate} - ${data.duration.endDate}`
            ) : (
              <em>Not set</em>
            )}
          </dd>
        </div>
        <div className="info-item">
          <dt>Monthly Rent</dt>
          <dd className="amount">${data?.fees?.monthlyRent || 0}</dd>
        </div>
        <div className="info-item">
          <dt>Security Deposit</dt>
          <dd className="amount">${data?.fees?.securityDeposit || 0}</dd>
        </div>
      </dl>
    </section>

    {/* Progress Indicator */}
    <section className="preview-section">
      <header className="section-header">
        <i className="bx bx-check-circle"></i>
        <h3>Progress</h3>
      </header>
      <div className="progress-info">
        <div className="info-item">
          <dt>Current Section</dt>
          <dd className="current-section">
            {activeSection.replace(/-/g, " ").toUpperCase()}
          </dd>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "17%" }}></div>
        </div>
        <span className="progress-text">1 of 6 sections</span>
      </div>
    </section>
  </div>
);

export default function CreateLease() {
  const router = useRouter();
  // Mock data for preview - will be replaced with actual form data later
  const mockLeaseData = {
    property: {
      address: "123 Main Street, Downtown",
      unit: "Apt 4B",
    },
    tenant: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    duration: {
      startDate: "2024-01-15",
      endDate: "2024-12-15",
    },
    fees: {
      monthlyRent: 2500,
      securityDeposit: 2500,
    },
  };

  const handleCreateLease = () => {
    console.log("Create lease submitted", mockLeaseData);
    // Here you would typically submit to backend
  };

  const accordionItems: AccordionItem[] = [
    {
      id: "property",
      label: "Property & Unit",
      subtitle: "Select property and unit",
      icon: <i className="bx bx-building"></i>,
      content: <PropertySelectionForm />,
      // hasError: false, // Will be connected to form validation later
      // isCompleted: false, // Will be connected to form completion status later
    },
    {
      id: "tenant",
      label: "Tenant Information",
      subtitle: "Select or invite tenant",
      icon: <i className="bx bx-user"></i>,
      content: <TenantInfoForm />,
    },
    {
      id: "lease-terms",
      label: "Lease Terms",
      subtitle: "Define lease duration and terms",
      icon: <i className="bx bx-file-blank"></i>,
      content: <LeaseTermsForm />,
    },
    {
      id: "financial",
      label: "Financial Details",
      subtitle: "Set rent, deposits, and fees",
      icon: <i className="bx bx-dollar-circle"></i>,
      content: <FinancialDetailsForm />,
    },
    {
      id: "additional",
      label: "Additional Terms",
      subtitle: "Utilities, pet policy, renewals",
      icon: <i className="bx bx-cog"></i>,
      content: <AdditionalTermsForm />,
    },
    {
      id: "cotenants",
      label: "Co-Tenants",
      subtitle: "Add additional tenants (optional)",
      icon: <i className="bx bx-group"></i>,
      content: <CoTenantsForm />,
    },
    {
      id: "documents",
      label: "Documents",
      subtitle: "Upload lease documents",
      icon: <i className="bx bx-file"></i>,
      content: <DocumentsForm />,
    },
  ];

  const handleCancel = () => {
    router.push("/leases");
  };
  return (
    <div className="page-container">
      <div className="page add-lease">
        <PageHeader
          title="Create New Lease"
          headerBtn={
            <Button
              label="Back"
              className="btn btn-outline"
              onClick={handleCancel}
              icon={<i className="bx bx-arrow-back"></i>}
            />
          }
        />

        <div className="resource-form">
          <AccordionContainer
            items={accordionItems}
            showSidebar={true}
            defaultActiveId="property"
            ariaLabel="Create lease form sections"
            onChange={(activeId) => {
              console.log("Active section changed to:", activeId);
            }}
            showPreviewDrawer={true}
            previewTitle="Lease Review"
            previewData={mockLeaseData}
            renderPreview={(activeItem, activeId) => (
              <LeasePreviewContent
                data={mockLeaseData}
                activeSection={activeId || "property"}
              />
            )}
            previewActions={
              <Button
                className="btn btn-primary btn-block"
                label="Create Lease"
                icon={<i className="bx bx-check"></i>}
                onClick={handleCreateLease}
              />
            }
            onPreviewToggle={(data) => {
              console.log("Preview toggled with data:", data);
            }}
          />

          {/* Action buttons at bottom of form */}
          <div
            className="form-actions"
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <Button
              className="btn btn-outline"
              label="Save as Draft"
              icon={<i className="bx bx-save"></i>}
              onClick={() => console.log("Save as draft")}
            />
            <Button
              className="btn btn-primary"
              label="Create Lease"
              icon={<i className="bx bx-check"></i>}
              onClick={handleCreateLease}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
