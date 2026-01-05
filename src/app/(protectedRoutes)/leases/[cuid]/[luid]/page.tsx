"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";

import { LeaseDetailView } from "./view";
import { useLeaseDetailLogic } from "./hook";

interface LeaseDetailPageProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

export default function LeaseDetailPage({ params }: LeaseDetailPageProps) {
  const router = useRouter();
  const { cuid } = use(params);
  const logicProps = useLeaseDetailLogic({ params });

  useEffect(() => {
    if (logicProps.responseData?.lease.status === "draft_renewal") {
      router.replace(`/leases/${cuid}`);
    }
  }, [logicProps.responseData?.lease.status, cuid, router]);

  if (logicProps.responseData?.lease.status === "draft_renewal") {
    return (
      <Loading size="regular" description="Redirecting to leases list..." />
    );
  }

  return <LeaseDetailView {...logicProps} />;
}
