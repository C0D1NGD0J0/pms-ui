import { handlers } from "./handlers";

export const server = {
  listen: () => {
    console.log("MSW Server started");
  },
  resetHandlers: () => {
    console.log("MSW Handlers reset");
  },
  close: () => {
    console.log("MSW Server closed");
  },
  use: (handlers: any[]) => {
    console.log("Mock handlers added");
  },
};
