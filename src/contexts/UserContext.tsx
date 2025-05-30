import { createContext } from "react";

const UserContext = createContext<{
  user: { id: string; authenticated: boolean };
  setUser: (arg0: { id: string; authenticated: boolean }) => any;
}>({ user: { authenticated: false, id: "-1" }, setUser: () => {} });

export default UserContext;
