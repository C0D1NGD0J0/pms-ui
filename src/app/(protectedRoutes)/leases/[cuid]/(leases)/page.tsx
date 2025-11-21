"use client";

import { LeasesListView } from "./view";
import { useLeasesListLogic } from "./hook";

export default function LeasesPage() {
  const logicProps = useLeasesListLogic();

  return <LeasesListView {...logicProps} />;
}
