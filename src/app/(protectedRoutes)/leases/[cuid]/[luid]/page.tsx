"use client";

import { useLeaseDetailLogic } from "./hook";
import { LeaseDetailView } from "./view";

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
