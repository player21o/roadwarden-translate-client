import { createContext } from "react";
import { User } from "../protocol/packets";

const UserContext = createContext<{
  user: { id: string; authenticated: boolean; data: User };
  setUser: (arg0: { id: string; authenticated: boolean; data: User }) => any;
}>({
  user: {
    authenticated: false,
    id: "-1",
    data: { id: "-1", avatar_url: "", name: "", permissions: [] },
  },
  setUser: () => {},
});

export default UserContext;
