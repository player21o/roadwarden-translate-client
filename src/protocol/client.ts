import { Tracks, TrackToPacket } from "./packets";
import { Protocol } from "./protocol";
import { WsType } from "./ws_type";

class ClientProtocol extends Protocol {
  private url: string = "ws://localhost:3000";
  public closing_func: () => void = () => {};
  private ws!: WsType;

  public constructor() {
    super();

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

  public send<T extends Tracks>(packet: TrackToPacket<T>, track: T) {
    return this.send_packet({ packet: packet, track: track }, this.ws);
  }
}

export let prot = new ClientProtocol();
