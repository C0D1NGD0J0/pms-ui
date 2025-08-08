import { create } from "zustand";
import { authService } from "@services/auth";
import { ICurrentUser, UserClient } from "@interfaces/index";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  permissions: string[];
  user: ICurrentUser | null;
  client: UserClient | null;
  isAuthLoading: boolean;
  isRefreshingToken: boolean;
  refreshTokenError: string | null;
  actions: {
    logout: () => void;
    setUser: (user: ICurrentUser | null) => void;
    setAuthLoading: (isLoading: boolean) => void;
    setClient: (client: UserClient | null) => void;
    setPermissions: (permissions: string[]) => void;
    setRefreshingToken: (isRefreshing: boolean) => void;
    setRefreshTokenError: (error: string | null) => void;
    clearAuthState: () => void;
  };
};

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      client: null,
      permissions: [],
      user: null,
      isAuthLoading: false,
      isRefreshingToken: false,
      refreshTokenError: null,
      actions: {
        logout: async () => {
          const cuid = get().client?.cuid;
          sessionStorage.removeItem("auth-storage");
          await authService.logout(cuid);
          return set({
            user: null,
            permissions: [],
            isAuthLoading: false,
            isRefreshingToken: false,
            refreshTokenError: null,
            client: { cuid: "", displayName: "" },
          });
        },
        setUser: (user: ICurrentUser | null) => {
          return set({ user });
        },
        setClient: (client: UserClient | null) => {
          return set({ client: client });
        },
        setPermissions: (permissions: string[]) => {
          return set({ permissions });
        },
        setAuthLoading: (isAuthLoading: boolean) => {
          return set({ isAuthLoading });
        },
        setRefreshingToken: (isRefreshingToken: boolean) => {
          return set({ isRefreshingToken });
        },
        setRefreshTokenError: (refreshTokenError: string | null) => {
          return set({ refreshTokenError });
        },
        clearAuthState: () => {
          sessionStorage.removeItem("auth-storage");
          return set({
            user: null,
            client: { cuid: "", displayName: "" },
            permissions: [],
            isAuthLoading: false,
            isRefreshingToken: false,
            refreshTokenError: null,
          });
        },
      },
    }),
    {
      name: "auth-storage", // unique name for the storage (session storage key)
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => {
        return { client: state.client } as unknown as AuthState;
      },
    }
  )
);

export const useAuth = () => {
  const {
    client,
    permissions,
    user,
    isAuthLoading,
    isRefreshingToken,
    refreshTokenError,
  } = useAuthStore();
  const isAuthenticated = !!client?.cuid && !isAuthLoading && !!user;
  return {
    isLoggedIn: isAuthenticated,
    isAuthLoading,
    isRefreshingToken,
    refreshTokenError,
    user: user,
    permissions: permissions || [],
    client: client,
  };
};

export const useAuthActions = () => {
  const { actions } = useAuthStore();
  return {
    logout: actions.logout,
    setUser: actions.setUser,
    setClient: actions.setClient,
    setAuthLoading: actions.setAuthLoading,
    clearAuthState: actions.clearAuthState,
    setPermissions: actions.setPermissions,
    setRefreshingToken: actions.setRefreshingToken,
    setRefreshTokenError: actions.setRefreshTokenError,
  };
};
