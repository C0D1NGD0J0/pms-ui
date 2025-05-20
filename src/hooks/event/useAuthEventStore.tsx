import { authService } from "@services/auth";
import { EventTypes } from "@services/events";
import { useAuthActions } from "@store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { ICurrentUser, UserClient } from "@interfaces/index";

import { useEvent } from "./useEvent";

export const CURRENT_USER_QUERY_KEY = ["currentUser"];

export function useAuthEventStore() {
  const queryClient = useQueryClient();
  const { setUser, setAuthLoading, setClient, logout } = useAuthActions();

  useEvent(EventTypes.LOGIN_SUCCESS, (loginData: UserClient | null) => {
    if (loginData?.csub) {
      setAuthLoading(true);
      setClient(loginData);
    }
  });

  useEvent(
    EventTypes.GET_CURRENT_USER,
    async (loginData: UserClient | null) => {
      if (loginData?.csub) {
        const resp = await authService.currentuser(loginData.csub);
        if (resp) {
          setUser(resp.data);
          setClient(resp.data.client);
          queryClient.setQueryData(CURRENT_USER_QUERY_KEY, resp.data);
          setAuthLoading(false);
        }
      }
    }
  );

  useEvent(EventTypes.CURRENT_USER_UPDATED, (userData: ICurrentUser | null) => {
    setUser(userData);
    setClient(userData?.client ?? null);
    setAuthLoading(false);
  });

  useEvent(EventTypes.LOGOUT, () => {
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    logout();
  });

  useEvent(EventTypes.ACCOUNT_SWITCHED, (account: UserClient | null) => {
    if (!account) {
      return;
    }
    setAuthLoading(true);
    setClient(account);
  });

  useEvent(EventTypes.SESSION_EXPIRED, () => {
    logout();
  });

  return null;
}
