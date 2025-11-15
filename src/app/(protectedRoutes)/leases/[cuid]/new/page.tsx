"use client";

import { useLeaseFormLogic } from "./hook";
import { LeaseFormView } from "./view";

interface CreateLeaseProps {
  params: Promise<{
    cuid: string;
  }>;
}

export default function CreateLease({ params }: CreateLeaseProps) {
  const logicProps = useLeaseFormLogic({ params });

  return <LeaseFormView {...logicProps} />;
}
