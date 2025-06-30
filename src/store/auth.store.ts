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
          const csub = get().client?.csub;
          await authService.logout(csub);
          sessionStorage.removeItem("auth-storage");
          return set({
            user: null,
            permissions: [],
            isAuthLoading: false,
            isRefreshingToken: false,
            refreshTokenError: null,
            client: { csub: "", displayName: "" },
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
            client: { csub: "", displayName: "" },
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
  const isLoggedIn = !!user?.sub && !!client?.csub;
  return {
    user,
    client,
    isLoggedIn,
    permissions,
    isAuthLoading,
    isRefreshingToken,
    refreshTokenError,
  };
};

export const useAuthActions = () => {
  const { actions } = useAuthStore();
  return {
    logout: actions.logout,
    setUser: actions.setUser,
    setClient: actions.setClient,
    setAuthLoading: actions.setAuthLoading,
    setPermissions: actions.setPermissions,
    setRefreshingToken: actions.setRefreshingToken,
    setRefreshTokenError: actions.setRefreshTokenError,
    clearAuthState: actions.clearAuthState,
  };
};
