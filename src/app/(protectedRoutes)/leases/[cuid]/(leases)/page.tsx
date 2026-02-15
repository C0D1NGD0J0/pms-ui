"use client";

import { withClientAccess } from "@hooks/permissionHOCs";

import { LeasesListView } from "./view";
import { useLeasesListLogic } from "./hook";

function LeasesPage() {
  const logicProps = useLeasesListLogic();

  return <LeasesListView {...logicProps} />;
}

export default withClientAccess(LeasesPage);
