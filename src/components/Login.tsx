import Spinner from "./Spinner";
import { useAuthUser } from "../hooks/AuthUser";
import { Navigate } from "react-router";

const Login = ({ redirect }: { redirect?: boolean }) => {
  const auth = useAuthUser();

  return auth != 200 ? (
    auth != 400 ? (
      <Spinner />
    ) : (
      <Navigate to="/" />
    )
  ) : redirect == true || redirect == undefined ? (
    <Navigate to={"/home"} />
  ) : null;
};

export default Login;
