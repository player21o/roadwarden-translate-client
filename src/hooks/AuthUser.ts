import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { prot } from "../protocol/client";
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
        .send("login", { method: "session", token: session })
        .then((answer) => {
          if (answer.user_id !== undefined) {
            setStatus(200);

            setUser({ id: answer.user_id, authenticated: true });
            console.log("success");
          } else {
            console.log("error");
            lc.remove("session");
            setStatus(400);
          }
        });
    };

    if (!user.authenticated) {
      let session = lc.get("session");

      if (session == null) {
        let code = searchParams.get("code");

        if (code == null) {
          prot
            .send("get_info", { type: "discord_auth_link" })
            .then((answer) => {
              //console.log(answer);
              //setStatus(answer.status!);
              //localStorage.setItem("session", "ss");
              //lc.set("session", "ss");
              if ("link" in answer) {
                window.location.href = answer.link;
              }
            });
        } else {
          prot
            .send("login", { method: "discord", token: code })
            .then((answer) => {
              if (answer.user_id !== undefined) {
                session_login(answer.session_token);
              }
            });
        }
      } else {
        session_login(session);
      }
    }
  }, []);

  return status;
}
