"use client";

import React, { useState } from "react";
import { Panel } from "@components/Panel";
import { useRouter } from "next/navigation";
import { InsightCard } from "@components/Cards";
import { Button } from "@components/FormElements";
import { invitationService } from "@services/invite";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { FilteredUser } from "@interfaces/user.interface";
import { AddUserModal } from "@components/UserManagement";
import { PageHeader } from "@components/PageElements/Header";
import { HorizontalBarChart, DonutChart } from "@components/Charts";
import { IInvitationFormData } from "@interfaces/invitation.interface";

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
    sortOptions,
    pagination,
    totalCount,
    handleSortChange,
    handlePageChange,
    handleSortByChange,
    isLoading,
  } = useGetVendors(cuid);

  const handleEditVendor = (vendor: FilteredUser) => {
    console.log("Edit vendor:", vendor);
    // TODO: Implement edit vendor modal/form
  };

  const handleViewVendorDetails = (vendor: FilteredUser) => {
    router.push(`/users/${cuid}/vendors/${vendor.id}`);
  };

  const handleMessageVendor = (vendor: FilteredUser) => {
    console.log("Message vendor:", vendor);
    // TODO: Implement message vendor functionality
  };

  const handleAddNewVendor = () => {
    setIsAddVendorModalOpen(true);
  };

  const handleImportVendors = () => {
    console.log("Import vendor list");
    // TODO: Implement vendor import functionality
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
        label="Import vendor list"
        className="btn btn-primary"
        onClick={handleImportVendors}
        icon={<i className="bx bx-import"></i>}
      />
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

        {/* Main Vendor Table */}
        <VendorTableView
          vendors={vendors}
          filterOptions={sortOptions}
          handlePageChange={handlePageChange}
          handleSortByChange={handleSortByChange}
          handleSortChange={handleSortChange}
          isLoading={isLoading}
          onEdit={handleEditVendor}
          onMessage={handleMessageVendor}
          onViewDetails={handleViewVendorDetails}
          pagination={pagination}
          totalCount={totalCount}
        />

        {/* Analytics Panels */}
        <div className="flex-row">
          <div className="panels">
            {/* Vendor Service Types Panel */}
            <Panel variant="alt-2">
              <div className="panel-header">
                <div className="panel-header__title">
                  <h4>Vendor Service Types</h4>
                </div>
              </div>
              <div className="panel-content">
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <div className="chart-container">
                      <DonutChart
                        data={[
                          { name: "Plumbing", value: 30 },
                          { name: "Electrical", value: 25 },
                          { name: "HVAC", value: 20 },
                          { name: "General", value: 15 },
                          { name: "Other", value: 10 },
                        ]}
                        height={300}
                        showTotal={true}
                        showTooltip={true}
                      />
                    </div>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: "hsl(194, 66%, 24%)" }}></span>
                        <span>Plumbing (30%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: "hsl(39, 73%, 49%)" }}></span>
                        <span>Electrical (25%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: "hsl(130, 100%, 37%)" }}></span>
                        <span>HVAC (20%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: "hsl(0, 100%, 50%)" }}></span>
                        <span>General (15%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: "hsl(213, 14%, 56%)" }}></span>
                        <span>Other (10%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            {/* Vendor Performance Panel */}
            <Panel variant="alt-2">
              <div className="panel-header">
                <div className="panel-header__title">
                  <h4>Vendor Performance</h4>
                </div>
              </div>
              <div className="panel-content">
                <div className="chart-container">
                  <HorizontalBarChart
                    data={[
                      { name: "Climate Systems", value: 4.9 },
                      { name: "City Plumbing", value: 4.5 },
                      { name: "Locksmith Express", value: 4.3 },
                      { name: "ElectraPro", value: 4.0 },
                      { name: "Security Masters", value: 3.5 },
                    ]}
                    height={300}
                    valueKey="value"
                    nameKey="name"
                    showAxis={true}
                  />
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* Add Vendor Modal */}
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