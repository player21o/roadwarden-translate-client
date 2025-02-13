import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import Spinner from "./Spinner";
import { prot } from "../protocol/client";
import { Tracks } from "../protocol/packets";

const Login = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    prot.send({ token: "sss" }, Tracks.login).then((answer) => {
      console.log(answer);
    });
  });

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

  return <Spinner />;
};

export default Login;
