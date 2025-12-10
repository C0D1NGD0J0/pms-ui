"use client";

import { LeaseFormView } from "./view";
import { useLeaseFormLogic } from "./hook";

interface CreateLeaseProps {
  params: Promise<{
    cuid: string;
  }>;
}

export default function CreateLease({ params }: CreateLeaseProps) {
  const logicProps = useLeaseFormLogic({ params });

  return <LeaseFormView {...logicProps} />;
}
