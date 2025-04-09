import { z } from "zod";
import { tracks } from "./packets";
import { Protocol } from "./protocol";
import { WsType } from "./ws_type";

class ClientProtocol extends Protocol {
  private url: string = "ws://localhost:3000";
  public closing_func: () => void = () => {};
  private ws!: WsType;

  public constructor() {
    super();

    this.event_emitter.setMaxListeners(0);

    this.connect();
  }

  public connect() {
    this.ws = new WsType(this.url);
    console.log(this.ws);

    this.ws.ws.onmessage = (event) => {
      const data: Blob = event.data;

      data.arrayBuffer().then((buffer) => {
        const arr = new Uint8Array(buffer);
        this.receive_packet(arr, this.ws);
      });
    };

    this.set_closing_function();

    //
  }

  public set_closing_function() {
    this.ws.ws.onclose = this.closing_func;
  }

  public send<T extends keyof typeof tracks>(
    track: T,
    packet: z.infer<(typeof tracks)[T]["request"]>
  ) {
    return this.send_packet<T>({ packet: packet, track: track }, this.ws);
  }
}

export let prot = new ClientProtocol();
