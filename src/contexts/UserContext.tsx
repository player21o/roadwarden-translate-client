import { createContext } from "react";
import { User } from "../protocol/packets";

export type ContextUser =
  | ({ authenticated: true } & User)
  | ({ authenticated: false } & Partial<User>);

export const UserContext = createContext<{
  user: ContextUser;
  setUser: (arg0: ContextUser) => any;
}>({ user: { authenticated: false }, setUser: () => {} });
