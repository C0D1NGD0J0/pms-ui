"use client";

import React from "react";

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

  if (!token) {
    return <InvalidInvitationError />;
  }

  return <InvitationAcceptanceView cuid={cuid} token={token} />;
}
