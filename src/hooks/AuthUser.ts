import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { prot } from "../protocol/client";
import { Tracks } from "../protocol/packets";
import { lc } from "../utils/localstorage";
import { useSearchParams } from "react-router";

export function useAuthUser() {
  const { user, setUser } = useContext(UserContext);
  const [status, setStatus] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const session_login = (session: string) => {
      lc.set("session", session);

      prot
        .send({ method: "session", token: session }, Tracks.login)
        .then((answer) => {
          if (answer.ok!) {
            prot.send({ id: answer.user_id! }, Tracks.user).then((usr) => {
              if (usr.ok!) {
                setUser({
                  authenticated: true,
                  id: usr.id!,
                  avatar_url: usr.avatar_url!,
                  name: usr.name!,
                });
                setStatus(200);
              }
            });
          }
        });
    };

    if (!user.authenticated) {
      let session = lc.get("session");

      if (session == null) {
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
              if (answer.ok!) {
                session_login(answer.token!);
              }
            });
        }
      } else {
        session_login(session);
      }
    }
  });

  return status;
}
