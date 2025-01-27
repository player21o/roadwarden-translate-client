import { useEffect, useState } from "react";
import "./App.css";
import { prot } from "./protocol/client";
import { GetUserPacket, Tracks } from "./protocol/packets";

function App() {
  const [status, setStatus] = useState(0);

  const packet: GetUserPacket = { id: 0 };

  useEffect(() => {
    prot.send({ packet: packet, track: Tracks.user }).then((p) => {
      setStatus(p.status!);
    });
  });

  return (
    <>
      <p className="font-bold">{status}</p>
    </>
  );
}

export default App;
