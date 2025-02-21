import { useEffect, useState } from "react";
import { User } from "../protocol/packets";
import { prot } from "../protocol/client";

export default function useGetUser(id: string) {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    console.log("get");
    prot.send("get_user", { user_id: id }).then((answer) => {
      if (answer.user !== undefined) {
        setUser({
          id: answer.user.id,
          avatar_url: answer.user.avatar_url,
          name: answer.user.name,
          permissions: answer.user.permissions,
        });
      }
    });
  }, []);

  return user;
}
