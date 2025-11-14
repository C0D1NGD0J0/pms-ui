import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useNotification } from "@hooks/useNotification";
import { LeaseFormValues } from "@interfaces/lease.interface";
import { transformLeaseForDuplication } from "@utils/leaseHelpers";

import { useGetLeaseByLuid } from "./useGetLeaseByLuid";

interface UseLeaseDuplicationReturn {
  isDuplicating: boolean;
  duplicateSource: string | null;
  duplicateData: Partial<LeaseFormValues> | null;
  error: string | null;
}

export function useLeaseDuplication(cuid: string): UseLeaseDuplicationReturn {
  const searchParams = useSearchParams();
  const duplicateLuid = searchParams.get("duplicate");
  const { openNotification } = useNotification();

  const [duplicateSource, setDuplicateSource] = useState<string | null>(null);
  const [duplicateData, setDuplicateData] =
    useState<Partial<LeaseFormValues> | null>(null);

  const {
    data: leaseData,
    isLoading,
    isError,
    error,
  } = useGetLeaseByLuid(cuid, duplicateLuid || "");

  useEffect(() => {
    if (isError && error) {
      openNotification(
        "error",
        "Duplication Failed",
        "Failed to load lease data"
      );
    }
  }, [isError, error, openNotification]);

  useEffect(() => {
    if (leaseData?.lease && duplicateLuid) {
      const rawLease = leaseData.lease;
      const transformedData = transformLeaseForDuplication(rawLease);
      setDuplicateData(transformedData);
      setDuplicateSource(`Lease #${rawLease.leaseNumber}`);
    }
  }, [leaseData, duplicateLuid]);

  return {
    isDuplicating: isLoading,
    duplicateSource,
    duplicateData,
    error: isError ? "Failed to load lease data" : null,
  };
}
