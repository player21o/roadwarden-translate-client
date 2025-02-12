import { createContext } from "react";
import { User } from "../protocol/packets";

export type ContextUser = Partial<User> & {
  authenticated: boolean;
};

export const UserContext = createContext<{
  user: ContextUser;
  setUser: (arg0: ContextUser) => any;
}>({ user: { authenticated: false }, setUser: () => {} });
