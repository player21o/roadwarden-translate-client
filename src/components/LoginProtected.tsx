import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Navigate } from "react-router";

interface Props {
  children: React.ReactNode;
}

const LoginProtected = ({ children }: Props) => {
  const { user } = useContext(UserContext);

  return user.authenticated ? children : <Navigate to="/login" />;
};

export default LoginProtected;
