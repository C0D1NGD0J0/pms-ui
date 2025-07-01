"use client";

import React from "react";
import { PageHeader } from "@components/PageElements/Header";

import { AccountTabs } from "../components/AccountTabs";
import { AccountOverview } from "../components/AccountOverview";

const AccountPage: React.FC = () => {
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

      <AccountOverview />
      <AccountTabs />
    </div>
  );
};

export default AccountPage;
