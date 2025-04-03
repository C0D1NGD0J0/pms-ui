import { create } from "zustand";
import { ICurrentUser } from "@interfaces/index";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserClient {
  csub: string;
  displayName: string;
}

interface AuthState {
  isLoggedIn: boolean;
  permissions: string[];
  user: ICurrentUser | null;
  client: UserClient;
  actions: {
    logout: (sendRequest?: boolean) => void;
    setUser: (user: ICurrentUser | null) => void;
    setPermissions: (permissions: string[]) => void;
    setClient: (client: UserClient) => void;
  };
}

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      client: { csub: "", displayName: "" },
      isLoggedIn: false,
      permissions: [],
      user: null,
      actions: {
        logout: (sendRequest = false) => {
          if (sendRequest) {
            // Perform logout request here
          }
          return set({ isLoggedIn: false, user: null });
        },
        setUser: (user: ICurrentUser | null) => {
          return set({ user, isLoggedIn: !!user });
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
        // only persist isLoggedIn
        return { isLoggedIn: state.isLoggedIn } as AuthState;
      },
    }
  )
);

export const useAuth = () => {
  const { client, isLoggedIn, permissions, user } = useAuthStore();
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

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useAuthStore);
}
