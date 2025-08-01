"use client";

import React, { useEffect } from "react";
import { Skeleton } from "@src/components/Skeleton";
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
  const [invite, setInvite] = React.useState<{
    isValid: boolean;
    data: IInvitationDocument | null;
  }>({
    isValid: false,
    data: null,
  });
  const { validateToken, isLoading } = useValidateInviteToken();
  const [loading, setIsLoading] = React.useState(isLoading);

  useEffect(() => {
    if (cuid && token) {
      validateToken({ cuid, token })
        .then((resp) => {
          console.log("Token validation response:", resp);
          if (resp.success) {
            setInvite({ isValid: resp.isValid, data: resp.invitation });
          }
        })
        .catch(() => {
          setInvite({ isValid: false, data: null });
        });
    }
    setIsLoading(false);
  }, [cuid, token, validateToken]);

  if (loading) {
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

  if (!token || (!isLoading && !invite.isValid)) {
    const errorType = !token ? "missing-token" : "invalid";
    return <InvalidInvitationError errorType={errorType} />;
  }

  if (invite.data && invite.data.status === "expired") {
    return <InvalidInvitationError errorType="expired" />;
  }

  return (
    <InvitationAcceptanceView
      cuid={cuid}
      token={token}
      invitation={invite.data!}
    />
  );
}
