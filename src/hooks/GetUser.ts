import { useEffect, useState } from "react";
import { Tracks, User } from "../protocol/packets";
import { prot } from "../protocol/client";

export default function useGetUser(id: string) {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    console.log("get");
    prot.send({ id: id }, Tracks.user).then((answer) => {
      if (answer.ok) {
        setUser({
          id: answer.id,
          avatar_url: answer.avatar_url,
          name: answer.name,
          permissions: answer.permissions,
        });
      }
    });
  }, []);

  return user;
}
