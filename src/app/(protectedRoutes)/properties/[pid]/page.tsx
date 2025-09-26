"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Table } from "@components/Table";
import { Loading } from "@components/Loading";
import { Badge } from "@src/components/Badge";
import { TabContainer } from "@components/Tab";
import { IUnit } from "@interfaces/unit.interface";
import { TabItem } from "@components/Tab/interface";
import { propertyTypeRules } from "@utils/constants";
import { PageHeader } from "@components/PageElements";
import { useParams, useRouter } from "next/navigation";
import { ImageGallery } from "@components/ImageGallery";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";
import {
  PendingChangesBanner,
  PropertyChangesModal,
  PropertyManager,
  PropertyMetrics,
  PropertySidebar,
  UnitsList,
} from "@components/Property";

import {
  MaintenanceLogTab,
  PaymentHistoryTab,
  CurrentTenantTab,
  DocumentsTab,
} from "./components";
import {
  useGetPropertyUnits,
  useApproveProperty,
  useRejectProperty,
  usePropertyData,
} from "../hooks";

const propertyData = {
  id: "BRK001",
  name: "Brooks Bungalows",
  address: "24 Brooks Avenue, New Jersey, USA",
  metrics: [
    {
      value: "$2,500",
      label: "Monthly Rent",
      change: { value: "+5.2% vs last year", trend: "positive" as const },
    },
    {
      value: "$30,000",
      label: "Annual Revenue",
      change: { value: "+8.7% vs last year", trend: "positive" as const },
    },
    {
      value: "92%",
      label: "Occupancy Rate",
      change: { value: "+3.5% vs market avg", trend: "positive" as const },
    },
    {
      value: "$1,300",
      label: "Monthly Net Income",
      change: { value: "+12.3% vs last year", trend: "positive" as const },
    },
  ],
  // tenant: {
  //   id: "tenant-001",
  //   name: "John Doe",
  //   avatar: "JD",
  //   lease: "Jan 2024 - Dec 2024",
  //   rentDue: "1st of month",
  //   contact: "(555) 123-4567 | john.doe@example.com",
  //   details: {
  //     tenantSince: "January 2024",
  //     occupants: "3 (2 Adults, 1 Child)",
  //     paymentMethod: "Bank Transfer",
  //     paymentHistory: "Excellent",
  //     securityDeposit: "$2,500",
  //     leaseRenewal: "Due in 6 months",
  //   },
  // },
  images: [
    { src: "/assets/imgs/villa-1.jpeg", alt: "Property Main Image" },
    { src: "/assets/imgs/villa-3.jpeg", alt: "Property View 2" },
    { src: "/assets/imgs/cover.jpeg", alt: "Property View 3" },
    { src: "/assets/imgs/villa-1.jpeg", alt: "Property View 4" },
  ],
  // units: [
  //   {
  //     id: "unit-a",
  //     number: "Unit A",
  //     status: "occupied" as const,
  //     details: "2 bed, 1 bath • 850 sq ft",
  //     tenant: "John Doe",
  //     rent: "$2,500/month",
  //   },
  //   {
  //     id: "unit-b",
  //     number: "Unit B",
  //     status: "vacant" as const,
  //     details: "1 bed, 1 bath • 650 sq ft",
  //     tenant: "Available since June 1",
  //     rent: "$1,800/month",
  //   },
  //   {
  //     id: "unit-c",
  //     number: "Unit C",
  //     status: "maintenance" as const,
  //     details: "3 bed, 2 bath • 1,200 sq ft",
  //     tenant: "Kitchen renovation",
  //     rent: "$3,200/month",
  //   },
  //   {
  //     id: "unit-d",
  //     number: "Unit D",
  //     status: "occupied" as const,
  //     details: "2 bed, 2 bath • 950 sq ft",
  //     tenant: "Sarah Smith",
  //     rent: "$2,800/month",
  //   },
  //   {
  //     id: "unit-e",
  //     number: "Unit E",
  //     status: "occupied" as const,
  //     details: "1 bed, 1 bath • 600 sq ft",
  //     tenant: "Mike Johnson",
  //     rent: "$1,700/month",
  //   },
  // ],
  manager: {
    name: "Sarah Johnson",
    title: "Senior Property Manager",
    avatar: "SJ",
    contact: {
      phone: "(555) 987-6543",
      email: "sarah.j@property.com",
    },
    stats: [
      { label: "Properties", value: "12" },
      { label: "Rating", value: "4.8" },
      { label: "Years", value: "3" },
    ],
  },
};

const reportsData = [
  {
    date: "June 25, 2025",
    employee: "Sarah Johnson",
    issue: "Tenant Complaint - Noise",
    unit: "Unit A",
    id: "report-001",
    priority: "Medium",
    status: "In Progress",
  },
  {
    date: "June 24, 2025",
    employee: "Mike Torres",
    issue: "Lease Violation - Pet Policy",
    id: "report-002",
    unit: "Unit C",
    priority: "High",
    status: "Under Review",
  },
  {
    date: "June 23, 2025",
    employee: "Lisa Chen",
    issue: "Late Rent Payment",
    unit: "Unit B",
    priority: "High",
    id: "report-003",
    status: "Overdue",
  },
];

const reportColumns = [
  { title: "Date Reported", dataIndex: "date" },
  { title: "Employee", dataIndex: "employee" },
  { title: "Issue Type", dataIndex: "issue" },
  { title: "Unit/Area", dataIndex: "unit" },
  { title: "Priority", dataIndex: "priority", isStatus: true },
  { title: "Status", dataIndex: "status", isStatus: true },
];

export default function PropertyShow() {
  const permission = useUnifiedPermissions();
  const [activeTab, setActiveTab] = useState("tenant");
  const [searchTerm, setSearchTerm] = useState("");
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const params = useParams<{ pid: string }>();
  const router = useRouter();
  let savedUnits: IUnit[] = [];
  const { data, isLoading, error } = usePropertyData(params.pid);

  const approvePropertyMutation = useApproveProperty(
    data?.property?.cuid || ""
  );
  const rejectPropertyMutation = useRejectProperty(data?.property?.cuid || "");

  const handleViewChanges = () => {
    // Open modal to view changes instead of navigating
    setIsChangesModalOpen(true);
  };

  const handleApprove = (notes?: string) => {
    if (!data?.property?.pid) return;
    approvePropertyMutation.mutate(
      { pid: data.property.pid, notes },
      {
        onSuccess: () => {
          setIsChangesModalOpen(false);
          router.refresh();
        },
      }
    );
  };

  const handleReject = (reason: string) => {
    if (!data?.property?.pid) return;
    rejectPropertyMutation.mutate(
      { pid: data.property.pid, reason },
      {
        onSuccess: () => {
          setIsChangesModalOpen(false);
          router.refresh();
        },
      }
    );
  };

  const closeChangesModal = () => {
    setIsChangesModalOpen(false);
  };

  const isMultiUnit = data?.property?.propertyType
    ? propertyTypeRules[data.property.propertyType]?.isMultiUnit ?? false
    : false;

  const {
    data: units,
    isLoading: isUnitsLoading,
    error: unitsError,
  } = useGetPropertyUnits(
    data?.property?.cuid ?? "",
    params.pid,
    {
      limit: 10,
    },
    {
      enabled: isMultiUnit && !!data?.property?.cuid && !!params.pid,
    }
  );

  if (units) {
    if ("pages" in units && Array.isArray(units.pages)) {
      savedUnits = units.pages.flatMap((page: any) => page?.items || []) || [];
    } else if ("items" in units && Array.isArray(units.items)) {
      savedUnits = units.items;
    }
  }

  if (isLoading) {
    return <Loading description="Fetching property details" />;
  }

  if (error || !data?.property) {
    return (
      <div className="page property-show">
        <div className="error-message">
          <h2>Error Loading Property</h2>
          <p>Unable to load property data. Please try again.</p>
        </div>
      </div>
    );
  }

  const tabItems: TabItem[] = [
    {
      id: "tenant",
      label: "Current Tenant",
      icon: <i className="bx bx-user"></i>,
      content: (
        <CurrentTenantTab
          tenant={null}
          unitsInfo={{
            availableSpaces: data?.unitInfo?.availableSpaces ?? 0,
            maxAllowedUnits: data?.unitInfo?.maxAllowedUnits ?? 0,
          }}
          property={data?.property}
          isMultiUnit={isMultiUnit}
        />
      ),
    },
    {
      id: "maintenance",
      label: "Maintenance Log",
      icon: <i className="bx bx-wrench"></i>,
      content: <MaintenanceLogTab />,
    },
    {
      id: "payments",
      label: "Payment History",
      icon: <i className="bx bx-credit-card"></i>,
      content: <PaymentHistoryTab />,
    },
    {
      id: "documents",
      label: "Documents",
      icon: <i className="bx bx-file"></i>,
      content: (
        <DocumentsTab propertyDocuments={data.property.documents || []} />
      ),
    },
  ];

  const canEditWithPendingChanges =
    Object.keys(data.property?.pendingChanges || []).length > 0 &&
    permission.isManagerOrAbove;

  return (
    <div className="page property-show">
      <PageHeader
        title={data?.property?.name}
        subtitle={`Property ID: #${data?.property?.pid} | ${
          data?.property?.address?.fullAddress || "No address"
        }`}
        headerBtn={
          <div className="flex-row">
            {canEditWithPendingChanges ? (
              <Link
                href={{
                  pathname: `/properties/${data?.property?.pid}/edit`,
                  query: { activeTab: "basic" },
                }}
                className="btn btn-outline"
              >
                <i className="bx bx-edit btn-icon"></i>
                <strong>Edit Property</strong>
              </Link>
            ) : (
              <Badge variant="danger" text="Pending changes under review..." />
            )}
            {data?.unitInfo?.canAddUnit && (
              <Link
                href={{
                  pathname: `/properties/${data?.property?.pid}/edit`,
                  query: { activeTab: "units" },
                }}
                className="btn btn-primary"
              >
                <i className="bx bx-edit btn-plus"></i>
                <strong>Add Unit</strong>
              </Link>
            )}
          </div>
        }
      />

      {data?.property?.pendingChangesPreview && (
        <PendingChangesBanner
          property={data.property}
          pendingChanges={data.property.pendingChangesPreview}
          requesterName={
            data.property?.pendingChanges?.displayName || "Unknown User"
          }
          onViewChanges={handleViewChanges}
        />
      )}

      <div className="property-layout">
        <div className="property-main-content">
          <PropertyMetrics metrics={propertyData["metrics"]} />

          <PanelsWrapper>
            <Panel>
              <PanelContent>
                <TabContainer
                  tabItems={tabItems}
                  defaultTab={activeTab}
                  onChange={setActiveTab}
                  scrollOnChange={false}
                  ariaLabel="Property management tabs"
                />
              </PanelContent>
            </Panel>
          </PanelsWrapper>

          <PanelsWrapper>
            <Panel>
              <PanelHeader
                header={{ title: "Notes/Reports" }}
                searchOpts={{
                  isVisible: true,
                  value: searchTerm,
                  placeholder: "Search reports...",
                  onChange: (e) => setSearchTerm(e.target.value),
                }}
              />
              <PanelContent>
                <Table
                  dataSource={reportsData}
                  columns={reportColumns}
                  key={`${new Date()}`}
                />
              </PanelContent>
            </Panel>
          </PanelsWrapper>
        </div>

        <PropertySidebar>
          <ImageGallery
            images={data.property.images}
            title="Property Gallery"
          />
          {(data.unitInfo?.currentUnits ?? 0) > 0 && isMultiUnit && (
            <UnitsList
              units={savedUnits}
              errors={unitsError}
              isLoading={isUnitsLoading}
              unitsStats={data?.unitInfo}
            />
          )}
          <PropertyManager manager={propertyData.manager} />
        </PropertySidebar>
      </div>

      {(data?.property as any)?.pendingChangesPreview && (
        <PropertyChangesModal
          visible={isChangesModalOpen}
          property={data.property}
          pendingChanges={(data.property as any).pendingChangesPreview}
          requesterName={
            (data.property as any).approvalDetails?.requestedBy?.name ||
            "Unknown User"
          }
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={closeChangesModal}
          isLoading={
            approvePropertyMutation.isPending ||
            rejectPropertyMutation.isPending
          }
        />
      )}
    </div>
  );
}
