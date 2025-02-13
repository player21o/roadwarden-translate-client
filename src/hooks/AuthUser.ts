import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { prot } from "../protocol/client";
import { Tracks } from "../protocol/packets";
import { lc } from "../utils/localstorage";
import { useSearchParams } from "react-router";

export function useAuthUser() {
  const { user, setUser } = useContext(UserContext);
  const [status, setStatus] = useState(0);
  const [searchParams] = useSearchParams();

  if (!user.authenticated) {
    if (lc.get("session") == null) {
      let code = searchParams.get("code");

      if (code == null) {
        prot.send({}, Tracks.discordlink).then((answer) => {
          //console.log(answer);
          setStatus(answer.status!);
          //localStorage.setItem("session", "ss");
          //lc.set("session", "ss");
          if (answer.ok!) window.location.href = answer.url!;
        });
      } else {
        prot
          .send({ method: "discord", token: code }, Tracks.login)
          .then((answer) => {
            console.log(answer);
          });
      }
    } else {
    }
  }

  return status;
}
