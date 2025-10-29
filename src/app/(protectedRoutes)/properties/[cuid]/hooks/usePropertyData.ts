import { useAuth } from "@store/index";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@services/property";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { ClientPropertyResponse } from "@interfaces/property.interface";

export function usePropertyData(pid: string) {
  const { client } = useAuth();

  const query = useQuery<ClientPropertyResponse>({
    enabled: !!pid && !!client?.cuid,
    queryKey: PROPERTY_QUERY_KEYS.getPropertyByPid(client?.cuid || "", pid),
    queryFn: () => propertyService.getClientProperty(client!.cuid, pid),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasPendingChanges = (): boolean => {
    return !!(query.data?.property as any)?.pendingChangesPreview;
  };

  const getPendingChangesCount = (): number => {
    const pendingChanges = (query.data?.property as any)?.pendingChangesPreview
      ?.changes;
    if (!pendingChanges) return 0;

    const changes = Object.entries(pendingChanges).filter(
      ([key]) => !["updatedBy", "updatedAt", "displayName"].includes(key)
    );
    return changes.length;
  };

  const getPendingChangesInfo = () => {
    const pendingData = (query.data?.property as any)?.pendingChangesPreview;
    if (!pendingData) return null;

    const changes = Object.entries(pendingData.changes || {}).filter(
      ([key]) => !["updatedBy", "updatedAt"].includes(key)
    );

    return {
      requesterName: pendingData.displayName || "Unknown User",
      requestedAt: query.data?.property?.updatedAt,
      changesCount: changes.length,
      hasChanges: changes.length > 0,
      changes: changes,
    };
  };

  const canEditProperty = (userPermissions: any): boolean => {
    if (hasPendingChanges()) {
      return userPermissions.isManagerOrAbove;
    }

    return userPermissions.canEditProperty?.() ?? true;
  };

  const getEditBlockedMessage = (userPermissions: any): string | null => {
    if (canEditProperty(userPermissions)) return null;

    if (hasPendingChanges() && userPermissions.isStaff) {
      const pendingInfo = getPendingChangesInfo();
      return `Changes are pending approval by your manager. Contact them for urgent updates. (${pendingInfo?.changesCount} changes pending)`;
    }

    return "You don't have permission to edit this property.";
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
    hasPendingChanges,
    getPendingChangesCount,
    getPendingChangesInfo,
    canEditProperty,
    getEditBlockedMessage,
  };
}
