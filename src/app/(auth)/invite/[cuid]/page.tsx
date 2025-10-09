"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@src/components/Skeleton";
import { useLoadingManager } from "@hooks/useLoadingManager";
import { IInvitationDocument } from "@src/interfaces/invitation.interface";

import { useValidateInviteToken } from "./hooks";
import { InvitationAcceptanceView } from "./view";
import { InvalidInvitationError } from "./components";

interface InvitationPageProps {
  params: Promise<{
    cuid: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
}

export default function InvitationPage({
  params,
  searchParams,
}: InvitationPageProps) {
  const { cuid } = React.use(params);
  const { token } = React.use(searchParams);
  // const { setProcessingInvite, isLoading } = useLoadingManager();
  const [validationState, setValidationState] = useState<{
    status: "idle" | "loading" | "success" | "error" | "rate-limited";
    data: IInvitationDocument | null;
    error: null | string;
  }>({
    status: "idle",
    data: null,
    error: null,
  });
  const { validateToken, isLoading } = useValidateInviteToken();

  useEffect(() => {
    if (!cuid || !token || validationState.status !== "idle") return;

    setValidationState({ status: "loading", data: null, error: null });
    validateToken({ cuid, token })
      .then((result) => {
        console.log("result", result);
        if (result.success) {
          setValidationState({
            status: "success",
            data: result,
            error: null,
          });
        } else if (result.rateLimited) {
          setValidationState({
            status: "rate-limited",
            data: null,
            error: "Rate limited",
          });
        } else {
          setValidationState({
            status: "error",
            data: null,
            error: "Invalid token",
          });
        }
      })
      .catch((error) => {
        setValidationState({
          status: "error",
          data: null,
          error,
        });
      });
  }, [cuid, token]);

  if (isLoading) {
    return (
      <>
        <Skeleton
          type="card"
          active
          paragraph={{ rows: 4 }}
          title={{ width: "60%" }}
        />
        <div className="mt-2">
          <Skeleton.Button
            active
            size="small"
            shape="square"
            style={{ width: 120 }}
          />
          <Skeleton.Button
            active
            size="small"
            shape="square"
            style={{ width: 120, marginLeft: 12 }}
          />
        </div>
      </>
    );
  }

  if (!token || (!isLoading && validationState.status === "error")) {
    const errorType = !token ? "missing-token" : "invalid";
    return <InvalidInvitationError errorType={errorType} />;
  }

  if (validationState.data && validationState.data.status === "expired") {
    return <InvalidInvitationError errorType="expired" />;
  }

  return (
    <InvitationAcceptanceView
      cuid={cuid}
      token={token}
      invitation={validationState.data!}
    />
  );
}
