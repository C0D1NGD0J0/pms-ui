"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { Button } from "@components/FormElements";
import { withClientAccess } from "@hooks/permissionHOCs";

import { LeaseEditView } from "./view/LeaseEditView";
import { useLeaseEditLogic } from "./hook/useLeaseEditLogic";

interface LeaseEditPageProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

function LeaseEditPage({ params }: LeaseEditPageProps) {
  const router = useRouter();
  const logic = useLeaseEditLogic({ params });

  React.useEffect(() => {
    if (logic.leaseData && logic.leaseData.status === "draft_renewal") {
      router.replace(`/leases/${logic.cuid}/${logic.luid}/renew`);
    }
  }, [logic.leaseData, logic.cuid, logic.luid, router]);

  if (logic.isLoadingEdit || logic.leaseData?.status === "draft_renewal") {
    return <Loading size="regular" description="Loading lease details..." />;
  }

  if (!logic.validationResult.canProceed) {
    return (
      <div className="page-container">
        <div className="error-state">
          <div className="error-icon">
            <i
              className={`bx ${
                logic.validationResult.action === "error"
                  ? "bx-error-circle"
                  : "bx-info-circle"
              }`}
            ></i>
          </div>
          <h3>Cannot Edit Lease</h3>
          <div className="error-message">{logic.validationResult.reason}</div>

          {logic.leaseData && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#f5f5f5",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Lease:</strong> {logic.leaseData.leaseNumber}
              </p>
              <p style={{ marginBottom: "0" }}>
                <strong>Status:</strong> {logic.leaseData.status}
              </p>
            </div>
          )}

          <div className="flex-row flex-center" style={{ marginTop: "1.5rem" }}>
            <Button
              onClick={logic.handleCancel}
              className="btn btn-primary"
              label="Back to Lease Details"
              icon={<i className="bx bx-arrow-back"></i>}
            />
          </div>
        </div>
      </div>
    );
  }

  return <LeaseEditView {...logic} />;
}

export default withClientAccess(LeaseEditPage);
