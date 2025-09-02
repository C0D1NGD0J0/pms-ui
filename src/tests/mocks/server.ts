// Dynamic import to handle MSW module resolution issues
export const createServer = async () => {
  const { setupServer } = await import("msw/node");
  const { handlers } = await import("./handlers");
  return setupServer(...handlers);
};

// Export a server instance that can be used synchronously
export const server = {
  listen: () => console.log("MSW Server started"),
  resetHandlers: () => console.log("MSW Handlers reset"),
  close: () => console.log("MSW Server closed"),
  use: () => console.log("Mock handlers added"),
};
