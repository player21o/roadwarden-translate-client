import { createContext } from "react";

export const UserContext = createContext<{
  user: { id: number; authenticated: boolean };
  setUser: (arg0: { id: number; authenticated: boolean }) => any;
}>({ user: { authenticated: false, id: -1 }, setUser: () => {} });
