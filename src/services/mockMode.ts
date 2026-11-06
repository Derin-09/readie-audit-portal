export const USE_MOCKS =
  String(import.meta.env.VITE_USE_MOCKS ?? "false").toLowerCase() === "true";
