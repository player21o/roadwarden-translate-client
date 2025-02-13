import Spinner from "./Spinner";
import { useAuthUser } from "../hooks/AuthUser";

const Login = () => {
  const auth = useAuthUser();

  /*
  return (
    <>
      {user.authenticated ? "logged" : "not logged"}
      <button
        onClick={() => {
          setUser({ ...user, authenticated: true });
        }}
      >
        log in
      </button>
      <Spinner />
      <Link to="/home">home</Link>
    </>
  );
  */

  return auth != 200 ? <Spinner /> : null;
};

export default Login;
