"use client";

import React from "react";
import Link from "next/link";
import { Table } from "@components/Table";
import { PageHeader } from "@components/PageElements";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { AnalyticCard, InsightCard } from "@components/Cards";
import { HorizontalBarChart, DonutChart } from "@components/Charts";
import {
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
} from "@test-data/index";

export default function Dashboard() {
  const { user } = useCurrentUser();

  const today = new Date();
  const greeting = today.getHours() < 12
    ? "Good morning"
    : today.getHours() < 18
    ? "Good afternoon"
    : "Good evening";

  return (
    <div className="page admin-dashboard">
      <PageHeader
        title={`${greeting}, ${user?.displayName?.split(' ')[0] || 'there'}!`}
        subtitle={new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(today)}
        headerBtn={
          <Link className="btn btn-primary" href={"/properties/new"}>
            <i className="bx bx-plus-circle"></i>
            Add Property
          </Link>
        }
      />

      <div className="dashboard-insights">
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

      <div className="dashboard-grid">
        <div className="dashboard-section dashboard-section--dual">
          <Panel className="dashboard-panel">
            <Table
              withHeader
              headerTitle="Recent Service Requests"
              columns={serviceRequestColumns}
              dataSource={serviceRequests}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </Panel>
          <Panel className="dashboard-panel">
            <Table
              withHeader
              headerTitle="Upcoming Payments"
              columns={paymentColumns}
              dataSource={payments}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </Panel>
        </div>

        <div className="dashboard-section dashboard-section--full">
          <Panel className="dashboard-panel">
            <Table
              withHeader
              headerTitle="Occupancy Overview"
              columns={occupancyColumns}
              dataSource={occupancyData}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </Panel>
        </div>

        <div className="dashboard-section dashboard-section--dual">
          <Panel className="dashboard-panel">
            <PanelHeader header={{ title: "Priority Distribution" }} />
            <PanelContent>
              <AnalyticCard
                title="By Priority"
                data={priorityData}
                nameKey={"name"}
                valueKey={"value"}
                showLegend
              >
                <DonutChart data={priorityData} className="priority-chart" />
              </AnalyticCard>
            </PanelContent>
          </Panel>

          <Panel className="dashboard-panel">
            <PanelHeader header={{ title: "Service Requests by Type" }} />
            <PanelContent>
              <AnalyticCard title="By Service Type" data={serviceTypeData}>
                <HorizontalBarChart
                  data={serviceTypeData}
                  className="horizontal-bar-chart"
                />
              </AnalyticCard>
            </PanelContent>
          </Panel>
        </div>

        <div className="dashboard-section dashboard-section--full">
          <Panel className="dashboard-panel">
            <Table
              headerTitle="Active Leases"
              columns={leaseStatusColumns}
              dataSource={leaseStatuses}
              pagination={{ pageSize: 6 }}
              rowKey="id"
              withHeader
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
