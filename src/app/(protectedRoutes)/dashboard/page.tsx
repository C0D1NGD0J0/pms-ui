"use client";

import Link from "next/link";
import { usePublish } from "@hooks/index";
import { Table } from "@components/Table";
import { Loading } from "@components/Loading";
import { EventTypes } from "@services/events";
import React, { useEffect, useState } from "react";
import { useAuthActions } from "@store/auth.store";
import { PageHeader } from "@components/PageElements";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useSearchParams, useRouter } from "next/navigation";
import { AnalyticCard, InsightCard } from "@components/Cards";
import { HorizontalBarChart, DonutChart } from "@components/Charts";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";
import {
  serviceRequestColumns,
  leaseStatusColumns,
  insightCardsData,
  occupancyColumns,
  serviceRequests,
  serviceTypeData,
  paymentColumns,
  leaseStatuses,
  occupancyData,
  priorityData,
  payments,
} from "@src/test-data";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const publish = usePublish();
  const { setClient } = useAuthActions();
  const { user, isLoading: isAuthLoading } = useCurrentUser();
  const [isProcessingInvite, setIsProcessingInvite] = useState(false);

  useEffect(() => {
    const fromInvite = searchParams.get("fromInvite");
    const accountCuid = searchParams.get("accountCuid");
    const accountName = searchParams.get("accountName");

    if (fromInvite === "true" && accountCuid && accountName) {
      const setupAuthFromInvite = async () => {
        try {
          setIsProcessingInvite(true);
          const selectedAccount = {
            cuid: accountCuid,
            displayName: accountName,
          };
          setClient(selectedAccount);
          publish(EventTypes.LOGIN_SUCCESS, selectedAccount);
          publish(EventTypes.GET_CURRENT_USER, selectedAccount);

          router.replace("/dashboard");
        } catch (error) {
          console.error("Failed to set up account from invite:", error);
          setIsProcessingInvite(false);
          router.push("/login?error=invite-setup-failed");
        }
      };

      setupAuthFromInvite();
    }
  }, [searchParams, setClient, publish, router]);

  useEffect(() => {
    if (isProcessingInvite && user && !isAuthLoading) {
      setIsProcessingInvite(false);
    }
  }, [isProcessingInvite, user, isAuthLoading]);

  if (isProcessingInvite) {
    return (
      <Loading description="Setting up your account..." size="fullscreen" />
    );
  }
  return (
    <div className="page admin-dashboard">
      <PageHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString()}
        headerBtn={
          <Link className="btn btn-success" href={"/properties/new"}>
            <i className="bx bx-plus-circle"></i>
            Add new property
          </Link>
        }
      />

      <div className="insights">
        {insightCardsData.map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            description={card.description}
          />
        ))}
      </div>

      <div className="flex-row">
        <PanelsWrapper>
          <Panel>
            <Table
              withHeader
              headerTitle="Service Requests"
              columns={serviceRequestColumns}
              dataSource={serviceRequests}
              pagination={{ pageSize: 4 }}
              rowKey="id"
            />
          </Panel>
          <Panel>
            <Table
              withHeader
              headerTitle="Upcoming Payments"
              columns={paymentColumns}
              dataSource={payments}
              pagination={{ pageSize: 4 }}
              rowKey="id"
            />
          </Panel>
        </PanelsWrapper>
      </div>

      <div className="flex-row">
        <PanelsWrapper>
          <Panel>
            <Table
              headerTitle="Lease Status"
              columns={leaseStatusColumns}
              dataSource={leaseStatuses}
              pagination={{ pageSize: 4 }}
              rowKey="id"
              withHeader
            />
          </Panel>
        </PanelsWrapper>
      </div>

      <div className="flex-row">
        <PanelsWrapper>
          <Panel>
            <Table
              withHeader
              headerTitle="Occupancy by Property"
              columns={occupancyColumns}
              dataSource={occupancyData}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </Panel>

          <Panel header={{ title: "Maintenance Request Analysis" }}>
            <PanelHeader header={{ title: "Maintenance Request Analysis" }} />
            <PanelContent>
              <div className="analytics-cards">
                <AnalyticCard
                  title="By Priority"
                  data={priorityData}
                  nameKey={"name"}
                  valueKey={"value"}
                  showLegend
                >
                  <DonutChart data={priorityData} className="priority-chart" />
                </AnalyticCard>

                <AnalyticCard title="Service type" data={serviceTypeData}>
                  <HorizontalBarChart
                    data={serviceTypeData}
                    className="horizontal-bar-chart"
                  />
                </AnalyticCard>
              </div>
            </PanelContent>
          </Panel>
        </PanelsWrapper>
      </div>
    </div>
  );
}
