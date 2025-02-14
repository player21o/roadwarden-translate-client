import { Tracks, TrackToPacket } from "./packets";
import { Protocol } from "./protocol";
import { WsType } from "./ws_type";

class ClientProtocol extends Protocol {
  private ws: WsType = new WsType("ws://localhost:3000");

  public constructor() {
    super();

    this.ws.ws.onmessage = (event) => {
      const data: Blob = event.data;

      data.arrayBuffer().then((buffer) => {
        const arr = new Uint8Array(buffer);
        this.receive_packet(arr, this.ws);
      });
    };
  }

  public send<T extends Tracks>(packet: TrackToPacket<T>, track: T) {
    return this.send_packet({ packet: packet, track: track }, this.ws);
  }
}

export let prot = new ClientProtocol();
