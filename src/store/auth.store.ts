import { create } from "zustand";
import { authService } from "@services/auth";
import { ICurrentUser, UserClient } from "@interfaces/index";
import { createJSONStorage, persist } from "zustand/middleware";

export enum LoadingReason {
  INITIALIZING = "initializing",
  AUTHENTICATING = "authenticating",
  REFRESHING_TOKEN = "refreshing_token",
  FETCHING_USER = "fetching_user",
  PROCESSING_INVITE = "processing_invite",
  IDLE_SESSION = "idle_session",
  LOGGING_OUT = "logging_out",
}

const LOADING_MESSAGES: Record<LoadingReason, string> = {
  [LoadingReason.INITIALIZING]: "Starting up...",
  [LoadingReason.AUTHENTICATING]: "Authenticating...",
  [LoadingReason.REFRESHING_TOKEN]: "Refreshing your session...",
  [LoadingReason.FETCHING_USER]: "Loading your user info...",
  [LoadingReason.PROCESSING_INVITE]: "Setting up your account...",
  [LoadingReason.IDLE_SESSION]: "Session idle - tap to continue",
  [LoadingReason.LOGGING_OUT]: "Signing out...",
};

type AuthState = {
  permissions: string[];
  user: ICurrentUser | null;
  client: UserClient | null;
  currentLoadingState: LoadingReason | null;
  actions: {
    logout: () => Promise<void>;
    setUser: (user: ICurrentUser | null) => void;
    setClient: (client: UserClient | null) => void;
    setPermissions: (permissions: string[]) => void;
    setLoadingState: (state: LoadingReason | null) => void;
    clearAuthState: () => void;
  };
};

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      client: null,
      permissions: [],
      user: null,
      currentLoadingState: null,
      actions: {
        logout: async () => {
          const cuid = get().client?.cuid;
          await authService.logout(cuid);
          return set({
            user: null,
            client: null,
            permissions: [],
            currentLoadingState: null,
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
        setLoadingState: (currentLoadingState: LoadingReason | null) => {
          return set({ currentLoadingState });
        },
        clearAuthState: () => {
          return set({
            user: null,
            client: null,
            permissions: [],
            currentLoadingState: null,
          });
        },
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => {
        return { client: state.client } as unknown as AuthState;
      },
    }
  )
);

export const useAuth = () => {
  const { client, permissions, user, currentLoadingState } = useAuthStore();
  const isAuthenticated = !!client?.cuid && !!user;
  return {
    isLoggedIn: isAuthenticated,
    user: user,
    permissions: permissions || [],
    client: client,
    currentLoadingState,
    isLoading: currentLoadingState !== null,
    loadingMessage: currentLoadingState
      ? LOADING_MESSAGES[currentLoadingState]
      : "",
  };
};

export const useAuthActions = () => {
  const { actions } = useAuthStore();
  return {
    logout: actions.logout,
    setUser: actions.setUser,
    setClient: actions.setClient,
    clearAuthState: actions.clearAuthState,
    setPermissions: actions.setPermissions,
    setLoadingState: actions.setLoadingState,
  };
};
