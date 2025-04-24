import { EventTypes } from "@services/events";
import { useAuthActions } from "@store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { ICurrentUser, UserClient } from "@interfaces/index";

import { useEvent } from "./useEvent";

export const CURRENT_USER_QUERY_KEY = ["currentUser"];

export function useAuthEventStore() {
  const { setUser, setClient, logout } = useAuthActions();
  const queryClient = useQueryClient();

  //resetting user data when login success
  useEvent(EventTypes.LOGIN_SUCCESS, (loginData: UserClient | null) => {
    if (loginData?.csub) {
      setClient(loginData);
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    }
  });

  useEvent(EventTypes.CURRENT_USER_UPDATED, (userData: ICurrentUser | null) => {
    setUser(userData);
    setClient(userData?.client ?? null);
  });

  useEvent(EventTypes.LOGOUT, () => {
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    logout();
  });

  useEvent(EventTypes.ACCOUNT_SWITCHED, (account: UserClient | null) => {
    if (!account) {
      return;
    }
    setClient(account);
  });

  useEvent(EventTypes.SESSION_EXPIRED, () => {
    logout();
  });

  return null;
}
