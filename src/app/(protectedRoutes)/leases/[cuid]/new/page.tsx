"use client";

import { withClientAccess } from "@hooks/permissionHOCs";

import { LeaseFormView } from "./view";
import { useLeaseFormLogic } from "./hook";

interface CreateLeaseProps {
  params: Promise<{
    cuid: string;
  }>;
}

function CreateLease({ params }: CreateLeaseProps) {
  const logicProps = useLeaseFormLogic({ params });

  return <LeaseFormView {...logicProps} />;
}

export default withClientAccess(CreateLease);
