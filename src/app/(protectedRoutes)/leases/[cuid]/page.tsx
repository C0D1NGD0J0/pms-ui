"use client";

import { LeasesListView } from "./(leases)/view";
import { useLeasesListLogic } from "./(leases)/hook";

export default function LeasesPage() {
  const logicProps = useLeasesListLogic();

  return <LeasesListView {...logicProps} />;
}
