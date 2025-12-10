"use client";

import React from "react";

import { LeaseEditView } from "./view/LeaseEditView";
import { useLeaseEditLogic } from "./hook/useLeaseEditLogic";

interface LeaseEditPageProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

export default function LeaseEditPage({ params }: LeaseEditPageProps) {
  const logic = useLeaseEditLogic({ params });

  return <LeaseEditView {...logic} />;
}
