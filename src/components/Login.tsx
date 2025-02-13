import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Spinner from "./Spinner";
import { Link } from "react-router";

const Login = () => {
  const { user, setUser } = useContext(UserContext);

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
};

export default Login;
