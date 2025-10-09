"use client";

import { useSearchParams } from "next/navigation";
import { Skeleton } from "@src/components/Skeleton";
import React, { useEffect, useState, use } from "react";
import { IInvitationDocument } from "@src/interfaces/invitation.interface";

import { useValidateInviteToken } from "./hooks";
import { InvitationAcceptanceView } from "./view";
import { InvalidInvitationError } from "./components";

interface InvitationPageProps {
  params: Promise<{
    cuid: string;
  }>;
}

export default function InvitationPage({ params }: InvitationPageProps) {
  const searchParams = useSearchParams();
  const { cuid } = use(params);
  const token = searchParams.get("token");
  const [validationState, setValidationState] = useState<{
    status: "idle" | "loading" | "success" | "error" | "rate-limited";
    data: { invitation: IInvitationDocument } | null;
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
  }, [cuid, token, validateToken]);

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

  if (
    !token ||
    (!isLoading && validationState.status === "error") ||
    !validationState.data
  ) {
    const errorType = !token ? "missing-token" : "invalid";
    return <InvalidInvitationError errorType={errorType} />;
  }

  if (
    validationState.data &&
    validationState.data.invitation?.status === "expired"
  ) {
    return <InvalidInvitationError errorType="expired" />;
  }
  console.log(
    "Rendering InvitationDetails with invitation:",
    validationState.data
  );
  return (
    <InvitationAcceptanceView
      cuid={cuid}
      token={token}
      invitation={validationState.data.invitation}
    />
  );
}
