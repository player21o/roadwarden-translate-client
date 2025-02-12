import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <>
      {user.authenticated ? "logged" : "not logged"}
      <button
        onClick={() => {
          setUser({ authenticated: true });
        }}
      >
        log in
      </button>
    </>
  );
};

export default Login;
