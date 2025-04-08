"use client";
import React from "react";
import Link from "next/link";
import { Table } from "@components/Table";
import { Panel } from "@components/Panel";
import { InsightCard } from "@components/Cards";
import { AnalyticCard } from "@components/Cards";
import { PageHeader } from "@components/PageElements";
import { HorizontalBarChart, DonutChart } from "@components/Charts";
import {
  serviceRequestColumns,
  statusFilterOptions,
  leaseStatusColumns,
  insightCardsData,
  occupancyColumns,
  serviceRequests,
  serviceTypeData,
  paymentColumns,
  leaseStatuses,
  occupancyData,
  filterOptions,
  priorityData,
  payments,
} from "@/src/test-data";

export default function Dashboard() {
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
        <div className="panels">
          <Table
            variant="withHeader"
            title="Service Requests"
            columns={serviceRequestColumns}
            dataSource={serviceRequests}
            searchOpts={{
              value: "",
              onChange: (value: string) => {
                console.log("Search value:", value);
              },
            }}
            filterOpts={{
              value: "all",
              options: statusFilterOptions,
              onFilterChange: (value: string) => {
                console.log("Filter value:", value);
              },
            }}
            pagination={{ pageSize: 4 }}
            rowKey="id"
          />

          <Table
            variant="withHeader"
            title="Upcoming Payments"
            columns={paymentColumns}
            dataSource={payments}
            searchOpts={{
              value: "",
              onChange: (value: string) => {
                console.log("Search value:", value);
              },
            }}
            filterOpts={{
              value: "all",
              options: statusFilterOptions,
              onFilterChange: (value: string) => {
                console.log("Filter value:", value);
              },
            }}
            pagination={{ pageSize: 4 }}
            rowKey="id"
          />
        </div>
      </div>

      <div className="flex-row">
        <div className="panels">
          <Table
            title="Lease Status"
            columns={leaseStatusColumns}
            dataSource={leaseStatuses}
            searchOpts={{
              value: "",
              onChange: (value: string) => {
                console.log("Search value:", value);
              },
            }}
            filterOpts={{
              value: "all",
              options: statusFilterOptions,
              onFilterChange: (value: string) => {
                console.log("Filter value:", value);
              },
            }}
            pagination={{ pageSize: 4 }}
            rowKey="id"
            variant="withHeader"
          />
        </div>
      </div>

      <div className="flex-row">
        <div className="panels">
          <Table
            title="Occupancy by Property"
            columns={occupancyColumns}
            dataSource={occupancyData}
            searchOpts={{
              value: "",
              onChange: (value: string) => {
                console.log("Search value:", value);
              },
            }}
            filterOpts={{
              value: "all",
              options: filterOptions,
              onFilterChange: (value: string) => {
                console.log("Filter value:", value);
              },
            }}
            pagination={{ pageSize: 5 }}
            rowKey="id"
            variant="withHeader"
          />

          <Panel header={{ title: "Maintenance Request Analysis" }}>
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
          </Panel>
        </div>
      </div>
    </div>
  );
}
