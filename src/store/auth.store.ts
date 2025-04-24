import { create } from "zustand";
import { authService } from "@services/auth";
import { ICurrentUser, UserClient } from "@interfaces/index";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  permissions: string[];
  user: ICurrentUser | null;
  client: UserClient | null;
  actions: {
    logout: () => void;
    setClient: (client: UserClient | null) => void;
    setUser: (user: ICurrentUser | null) => void;
    setPermissions: (permissions: string[]) => void;
  };
};

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      client: null,
      permissions: [],
      user: null,
      actions: {
        logout: async () => {
          const csub = get().client?.csub;
          await authService.logout(csub);
          sessionStorage.removeItem("auth-storage");
          return set({
            user: null,
            permissions: [],
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
  const { client, permissions, user } = useAuthStore();
  const isLoggedIn = !!user?.sub && !!client?.csub;
  return {
    user,
    client,
    isLoggedIn,
    permissions,
  };
};

export const useAuthActions = () => {
  const { actions } = useAuthStore();
  return {
    logout: actions.logout,
    setUser: actions.setUser,
    setClient: actions.setClient,
    setPermissions: actions.setPermissions,
  };
};
