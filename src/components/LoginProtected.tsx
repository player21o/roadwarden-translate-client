import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Navigate } from "react-router";

interface Props {
  children: React.ReactNode;
}

const LoginProtected = ({ children }: Props) => {
  const { user, setUser } = useContext(UserContext);

  return user.authenticated ? children : <Navigate to="/" />;
};

export default LoginProtected;
