import { create } from "zustand";
import { authService } from "@services/auth";
import { ICurrentUser } from "@interfaces/index";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserClient = {
  csub: string;
  displayName: string;
};

type AuthState = {
  permissions: string[];
  user: ICurrentUser | null;
  client: UserClient;
  actions: {
    logout: () => void;
    setClient: (client: UserClient) => void;
    setUser: (user: ICurrentUser) => void;
    setPermissions: (permissions: string[]) => void;
  };
};

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      client: { csub: "", displayName: "" },
      permissions: [],
      user: null,
      actions: {
        logout: async () => {
          const csub = get().client.csub;
          await authService.logout(csub);
          return set({
            user: null,
            permissions: [],
            client: { csub: "", displayName: "" },
          });
        },
        setUser: (user: ICurrentUser) => {
          return set({ user });
        },
        setClient: (client: UserClient) => {
          return set({ client });
        },
        setPermissions: (permissions: string[]) => {
          return set({ permissions });
        },
      },
    }),
    {
      name: "auth-storage", // unique name for the storage (local storage key)
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => {
        return { client: state.client } as unknown as AuthState;
      },
    }
  )
);

export const useAuth = () => {
  const { client, permissions, user } = useAuthStore();
  const isLoggedIn = !!user?.sub && !!client.csub;
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

// if (process.env.NODE_ENV === "development") {
//   mountStoreDevtool("Store", useAuthStore);
// }
