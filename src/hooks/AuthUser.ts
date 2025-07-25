import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { prot } from "../protocol/client";
import { lc } from "../utils/localstorage";
import { useSearchParams } from "react-router";

export function useAuthUser() {
  const { user, setUser } = useContext(UserContext);
  const [status, setStatus] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const session_login = (session: string) => {
      lc.set("session", [session]);

      prot
        .send("login", { method: "session", token: session })
        .then((answer) => {
          if (answer.user_id !== undefined) {
            prot
              .send("get_user", { user_id: answer.user_id })
              .then((user_data) => {
                setUser({
                  id: answer.user_id!,
                  authenticated: true,
                  data: user_data.user!,
                });
                setStatus(200);
              });
          } else {
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
              if ("link" in answer) {
                window.location.href = answer.link;
              }
            });
        } else {
          setTimeout(() => {
            prot
              .send("login", { method: "discord", token: code })
              .then((answer) => {
                if (answer.session_token !== undefined) {
                  session_login(answer.session_token);
                }
              });
          }, 1000);
        }
      } else {
        session_login(session[0]);
      }
    }
  }, []);

  return status;
}
