import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import Spinner from "./Spinner";
import { prot } from "../protocol/client";
import { Tracks } from "../protocol/packets";
import { useNavigate } from "react-router";

const Login = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    prot.send({}, Tracks.discordlink).then((answer) => {
      console.log(answer);
      if (answer.ok!) window.location.href = answer.url!;
    });

    //prot.send({ token: "sss" }, Tracks.login).then((answer) => {
    //  console.log(answer.ok);
    //});
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
