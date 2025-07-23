import { z } from "zod";
import { tracks } from "../protocol/packets";
import { WsType } from "../protocol/ws_type";
import { useEffect, useCallback } from "react";
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
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    prot.listen(track, memoizedCallback);
    return () => prot.off(track, memoizedCallback);
  }, [track, memoizedCallback]);
};

export default useListen;
