"use client";

import { LeaseDetailView } from "./view";
import { useLeaseDetailLogic } from "./hook";

interface LeaseDetailPageProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

export default function LeaseDetailPage({ params }: LeaseDetailPageProps) {
  const logicProps = useLeaseDetailLogic({ params });

  return <LeaseDetailView {...logicProps} />;
}
