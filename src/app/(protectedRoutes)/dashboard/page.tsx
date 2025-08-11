"use client";

import React from "react";
import Link from "next/link";
import { Table } from "@components/Table";
import { PageHeader } from "@components/PageElements";
import { useCurrentUser } from "@hooks/useCurrentUser";
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
} from "@test-data/index";

export default function Dashboard() {
  const { user } = useCurrentUser();

  return (
    <div className="page admin-dashboard">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome ${user?.displayName}, it's ${new Intl.DateTimeFormat(
          "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ).format(new Date())}`}
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
              showRowNumbers={true} // Enable row numbering
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
              showRowNumbers={true} // Enable row numbering
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
