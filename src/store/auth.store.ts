import { create } from "zustand";
import { authService } from "@services/auth";
import { ICurrentUser, UserClient } from "@interfaces/index";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  permissions: string[];
  user: ICurrentUser | null;
  client: UserClient | null;
  isAuthLoading: boolean;
  actions: {
    logout: () => void;
    setUser: (user: ICurrentUser | null) => void;
    setAuthLoading: (isLoading: boolean) => void;
    setClient: (client: UserClient | null) => void;
    setPermissions: (permissions: string[]) => void;
  };
};

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      client: null,
      permissions: [],
      user: null,
      isAuthLoading: false,
      actions: {
        logout: async () => {
          const csub = get().client?.csub;
          await authService.logout(csub);
          sessionStorage.removeItem("auth-storage");
          return set({
            user: null,
            permissions: [],
            isAuthLoading: false,
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
  const { client, permissions, user, isAuthLoading } = useAuthStore();
  const isLoggedIn = !!user?.sub && !!client?.csub;
  return {
    user,
    client,
    isLoggedIn,
    permissions,
    isAuthLoading,
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
  };
};
