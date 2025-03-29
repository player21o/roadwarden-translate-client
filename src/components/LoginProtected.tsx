import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Login from "./Login";

interface Props {
  children: React.ReactNode;
}

const LoginProtected = ({ children }: Props) => {
  const { user } = useContext(UserContext);

  return user.authenticated ? children : <Login redirect={false}></Login>;
};

export default LoginProtected;
