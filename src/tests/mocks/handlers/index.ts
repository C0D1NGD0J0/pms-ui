import { authHandlers } from "./auth";
import { subscriptionHandlers } from "./subscription";

export const handlers = [...authHandlers, ...subscriptionHandlers];
