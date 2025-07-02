"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Loading } from "@components/Loading";
import { PageHeader } from "@components/PageElements/Header";

import { useGetClientDetails } from "../hook";
import { AccountTabs } from "../components/AccountTabs";
import { AccountOverview } from "../components/AccountOverview";

const AccountPage: React.FC = () => {
  const params = useParams<{ csub: string }>();
  const {
    data: clientInfo,
    isLoading,
    isError,
  } = useGetClientDetails(params.csub || "");

  if (isLoading) {
    return <Loading description="Loading client details..." size="regular" />;
  }

  if (isError || !clientInfo) {
    return (
      <Loading description="Unable to fetch client details" size="regular" />
    );
  }
  console.log("Client Info:", clientInfo);

  return (
    <div className="page client-account">
      <PageHeader
        title="Account Settings"
        subtitle="dashboard / account"
        headerBtn={
          <button type="button" className="btn btn-primary">
            <i className="bx bx-save"></i>
            Save Changes
          </button>
        }
      />

      <AccountOverview
        accountStats={{
          isVerified: clientInfo.isVerified,
          planName: clientInfo.accountType.planName,
          planId: clientInfo.accountType.planId,
          totalUsers: clientInfo.clientStats.totalUsers,
          totalProperties: clientInfo.clientStats.totalProperties,
        }}
      />
      <AccountTabs clientInfo={clientInfo} />
    </div>
  );
};

export default AccountPage;
