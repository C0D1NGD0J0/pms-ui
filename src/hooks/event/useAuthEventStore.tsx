import { authService } from "@services/auth";
import { EventTypes } from "@services/events";
import { useAuthActions } from "@store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { CURRENT_USER_QUERY_KEY } from "@utils/constants";
import { ICurrentUser, UserClient } from "@interfaces/index";
import { useLoadingManager } from "@hooks/useLoadingManager";

import { useEvent } from "./useEvent";

export function useAuthEventStore() {
  const queryClient = useQueryClient();
  const { setUser, setClient, logout } = useAuthActions();
  const { setAuthenticating, setFetchingUser } = useLoadingManager();

  useEvent(EventTypes.LOGIN_SUCCESS, (loginData: UserClient | null) => {
    if (loginData?.cuid) {
      setAuthenticating(true);
      setClient(loginData);
    }
  });

  useEvent(
    EventTypes.GET_CURRENT_USER,
    async (loginData: UserClient | null) => {
      if (loginData?.cuid) {
        setFetchingUser(true);
        try {
          const resp = await authService.currentuser(loginData.cuid);
          if (resp) {
            setUser(resp.data);
            setClient(resp.data.client);
            queryClient.setQueryData(CURRENT_USER_QUERY_KEY, resp.data);
          }
        } catch (error) {
          console.error('Failed to fetch current user:', error);
        } finally {
          setFetchingUser(false);
          setAuthenticating(false);
        }
      }
    }
  );

  useEvent(EventTypes.CURRENT_USER_UPDATED, (userData: ICurrentUser | null) => {
    setUser(userData);
    setClient(userData?.client ?? null);
    setFetchingUser(false);
    setAuthenticating(false);
  });

  useEvent(EventTypes.LOGOUT, () => {
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    logout();
  });

  useEvent(EventTypes.ACCOUNT_SWITCHED, (account: UserClient | null) => {
    if (!account) {
      return;
    }
    setAuthenticating(true);
    setClient(account);
  });

  useEvent(EventTypes.SESSION_EXPIRED, () => {
    logout();
  });

  return null;
}
