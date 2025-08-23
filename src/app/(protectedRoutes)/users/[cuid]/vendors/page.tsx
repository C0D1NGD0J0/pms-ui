"use client";

import { useRouter } from "next/navigation";
import { InsightCard } from "@components/Cards";
import React, { useState, useMemo } from "react";
import { Button } from "@components/FormElements";
import { ChartContainer } from "@components/Charts";
import { invitationService } from "@services/invite";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { AddUserModal } from "@components/UserManagement";
import { PageHeader } from "@components/PageElements/Header";
import { generateLegendColors } from "@src/utils/employeeUtils";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import { useGetUserStats } from "@app/(protectedRoutes)/shared-hooks/useGetUserStats";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { useGetVendors } from "./hooks";
import { VendorTableView } from "./components/VendorTableView";

interface VendorsPageProps {
  params: Promise<{
    cuid: string;
  }>;
}

export default function VendorsPage({ params }: VendorsPageProps) {
  const { cuid } = React.use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { message } = useNotification();

  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  const {
    vendors,
    serviceOptions,
    pagination,
    totalCount,
    handleSortChange,
    handlePageChange,
    handleServiceTypeFilter,
    isLoading,
  } = useGetVendors(cuid);

  const { stats } = useGetUserStats(cuid, {
    role: ["vendor"],
  });

  const serviceTypeData = useMemo(() => {
    return stats?.departmentDistribution || [];
  }, [stats]);

  const legendColors = useMemo(() => {
    return generateLegendColors(serviceTypeData.length);
  }, [serviceTypeData.length]);

  const handleEditVendor = (vendor: FilteredUserTableData) => {
    console.log("Edit vendor:", vendor);
    // TODO: Implement edit vendor modal/form
  };

  const handleViewVendorDetails = (vendor: FilteredUserTableData) => {
    router.push(`/users/${cuid}/vendors/${vendor.uid}`);
  };

  const handleMessageVendor = (vendor: FilteredUserTableData) => {
    console.log("Message vendor:", vendor);
    // TODO: Implement message vendor functionality
  };

  const handleAddNewVendor = () => {
    setIsAddVendorModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddVendorModalOpen(false);
  };

  const handleSubmitVendorInvite = async (
    data: Partial<IInvitationFormData>
  ) => {
    try {
      setIsSubmittingInvite(true);
      await invitationService.sendInvite(cuid, data);

      message.success("Vendor invitation sent successfully!");
      setIsAddVendorModalOpen(false);

      // Refresh the vendor list
      queryClient.invalidateQueries({ queryKey: [`/vendors/${cuid}`, cuid] });
    } catch (error: any) {
      console.error("Failed to send vendor invitation:", error);
      message.error(
        error?.response?.data?.message ||
          "Failed to send vendor invitation. Please try again."
      );
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const headerButtons = (
    <div className="flex-row">
      <Button
        label="Add new vendor"
        className="btn btn-success"
        onClick={handleAddNewVendor}
        icon={<i className="bx bx-plus-circle"></i>}
      />
    </div>
  );

  return (
    <div className="page-container">
      <div className="page vendor-management-page">
        <PageHeader title="Vendor Management" headerBtn={headerButtons} />

        <div className="insights">
          <InsightCard
            title="Total Vendors"
            value={totalCount}
            icon={<i className="bx bx-building"></i>}
            trend={{
              value: "4",
              direction: "up",
              period: "this quarter",
            }}
          />

          <InsightCard
            title="Completed Jobs"
            value="138"
            icon={<i className="bx bx-check-circle"></i>}
            trend={{
              value: "12%",
              direction: "up",
              period: "vs last quarter",
            }}
          />

          <InsightCard
            title="Avg. Service Cost"
            value="$285"
            icon={<i className="bx bx-money"></i>}
            trend={{
              value: "3%",
              direction: "down",
              period: "vs last quarter",
            }}
          />

          <InsightCard
            title="Avg. Response Time"
            value="1.8 days"
            icon={<i className="bx bx-time"></i>}
            trend={{
              value: "0.5 days",
              direction: "up",
              period: "improvement",
            }}
          />
        </div>

        <div className="flex-row">
          <PanelsWrapper>
            <Panel variant="alt-2">
              <VendorTableView
                vendors={vendors}
                filterOptions={serviceOptions}
                handlePageChange={handlePageChange}
                handleSortByChange={handleServiceTypeFilter}
                handleSortChange={handleSortChange}
                isLoading={isLoading}
                onEdit={handleEditVendor}
                onMessage={handleMessageVendor}
                onViewDetails={handleViewVendorDetails}
                pagination={pagination}
                totalCount={totalCount}
              />
            </Panel>
          </PanelsWrapper>
        </div>

        <div className="flex-row">
          <PanelsWrapper>
            <Panel variant="alt-2">
              <PanelHeader header={{ title: "Vendor Service Types" }} />
              <PanelContent>
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <ChartContainer
                      type="donut"
                      data={serviceTypeData}
                      height={300}
                      colors={legendColors}
                      chartProps={{
                        donutchart: { showTotal: true, showTooltip: true },
                      }}
                      showLegend={true}
                      legend={serviceTypeData.map((service, index) => ({
                        name: service.name,
                        color: legendColors[index],
                        percentage: service.percentage,
                      }))}
                      emptyStateMessage="No service type data available"
                      emptyStateIcon={<i className="bx bx-wrench"></i>}
                    />
                  </div>
                </div>
              </PanelContent>
            </Panel>

            <></>
          </PanelsWrapper>
        </div>
      </div>

      <AddUserModal
        userType="vendor"
        isOpen={isAddVendorModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitVendorInvite}
        isSubmitting={isSubmittingInvite}
      />
    </div>
  );
}
