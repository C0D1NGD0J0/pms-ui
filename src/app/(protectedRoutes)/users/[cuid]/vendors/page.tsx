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
import { withClientAccess } from "@hooks/permissionHOCs";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { useGetVendorStats, useGetVendors } from "./hooks";
import { VendorTableView } from "./components/VendorTableView";

interface VendorsPageProps {
  params: Promise<{
    cuid: string;
  }>;
}

function VendorsPage({ params }: VendorsPageProps) {
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

  const { stats } = useGetVendorStats(cuid);
  console.log("Vendor stats:", stats);
  
  const businessTypeData = useMemo(() => {
    return stats?.businessTypeDistribution || [];
  }, [stats]);

  const servicesData = useMemo(() => {
    return stats?.servicesDistribution || [];
  }, [stats]);

  const businessTypeLegendColors = useMemo(() => {
    return generateLegendColors(businessTypeData.length);
  }, [businessTypeData.length]);

  const servicesLegendColors = useMemo(() => {
    return generateLegendColors(servicesData.length);
  }, [servicesData.length]);

  const handleEditVendor = (vendor: FilteredUserTableData) => {
    router.push(
      `/users/${cuid}/user-edit/${vendor.vendorInfo?.vuid}?type=vendor`
    );
  };

  const handleViewVendorDetails = (vendor: FilteredUserTableData) => {
    router.push(`/users/${cuid}/vendors/${vendor.vendorInfo?.vuid}`);
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
            value={stats?.totalVendors || totalCount}
            icon={<i className="bx bx-building"></i>}
            trend={{
              value: "4",
              direction: "up",
              period: "this quarter",
            }}
          />

          <InsightCard
            title="Business Types"
            value={businessTypeData.length}
            icon={<i className="bx bx-category"></i>}
            trend={{
              value: `${businessTypeData.length > 0 ? businessTypeData[0]?.name : 'None'}`,
              direction: "none",
              period: "most common",
            }}
          />

          <InsightCard
            title="Services Offered"
            value={servicesData.length}
            icon={<i className="bx bx-wrench"></i>}
            trend={{
              value: `${servicesData.length > 0 ? servicesData[0]?.name : 'None'}`,
              direction: "none",
              period: "most popular",
            }}
          />

          <InsightCard
            title="Active Vendors"
            value={stats?.totalVendors || 0}
            icon={<i className="bx bx-check-circle"></i>}
            trend={{
              value: "100%",
              direction: "up",
              period: "connected",
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
              <PanelHeader header={{ title: "Vendor Business Types" }} />
              <PanelContent>
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <ChartContainer
                      type="donut"
                      data={businessTypeData}
                      height={300}
                      colors={businessTypeLegendColors}
                      chartProps={{
                        donutchart: { showTotal: true, showTooltip: true },
                      }}
                      showLegend={true}
                      legend={businessTypeData.map((type, index) => ({
                        name: type.name,
                        color: businessTypeLegendColors[index],
                        percentage: type.percentage,
                      }))}
                      emptyStateMessage="No business type data available"
                      emptyStateIcon={<i className="bx bx-category"></i>}
                    />
                  </div>
                </div>
              </PanelContent>
            </Panel>

            <Panel variant="alt-2">
              <PanelHeader header={{ title: "Services Offered" }} />
              <PanelContent>
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <ChartContainer
                      type="donut"
                      data={servicesData}
                      height={300}
                      colors={servicesLegendColors}
                      chartProps={{
                        donutchart: { showTotal: true, showTooltip: true },
                      }}
                      showLegend={true}
                      legend={servicesData.map((service, index) => ({
                        name: service.name,
                        color: servicesLegendColors[index],
                        percentage: service.percentage,
                      }))}
                      emptyStateMessage="No services data available"
                      emptyStateIcon={<i className="bx bx-wrench"></i>}
                    />
                  </div>
                </div>
              </PanelContent>
            </Panel>
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

export default withClientAccess(VendorsPage);
