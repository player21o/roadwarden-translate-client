import { z } from "zod";
import { tracks } from "../protocol/packets";
import { WsType } from "../protocol/ws_type";
import { useEffect } from "react";
import { prot } from "../protocol/client";

const useListen = <T extends keyof typeof tracks>(
  track: T,
  callback: (
    packet: {
      data: z.infer<(typeof tracks)[T]["request"]>;
      answer: (arg0: z.infer<(typeof tracks)[T]["response"]>) => Promise<any>;
    },
    ws: WsType
  ) => any,
  deps: any[]
) => {
  useEffect(() => {
    prot.listen(track, callback);
  }, deps);
};

export default useListen;
