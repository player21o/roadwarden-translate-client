import { decode, encode } from "msgpack-lite";
import {
  extractGeneric,
  Tracks,
  TrackToPacket,
  type FullPacket,
  type Packet,
} from "./packets";
import { WsType } from "./ws_type";
import { EventEmitter } from "node:events";

export interface SendPacketArgs<T extends Packet> {
  packet: T; // Changed parameter type from Packet to P
  track?: Tracks;
  req_id?: number;
}

export class Protocol {
  private resolves: { [key: number]: (packet: any) => void } = {};

  private event_emitter = new EventEmitter();

  private send_full_packet<P extends Packet>(
    full_packet: FullPacket<P>,
    ws: WsType
  ) {
    return new Promise<extractGeneric<P>>((resolve) => {
      // Updated return type
      this.resolves[full_packet.req_id] = resolve;
      ws.send(this.encode_packet(full_packet));
    });
  }

  protected send_packet<P extends Packet>(
    { packet, req_id, track }: SendPacketArgs<P>,
    ws: WsType
  ): Promise<extractGeneric<P>> {
    // Updated return type
    const full_packet: FullPacket<P> = {
      packet: packet,
      req_id: Math.round(Math.random() * 1000),
    };

    if (track) {
      full_packet.track_id = track;
    }

    if (req_id) full_packet.req_id = req_id;

    return this.send_full_packet(full_packet, ws);
  }

  protected receive_packet(packet: Uint8Array, ws: WsType) {
    const decoded_packet: FullPacket = decode(packet);
    const built_packet = this.build_packet(decoded_packet, ws);
    if (decoded_packet.req_id in this.resolves) {
      let resolve = this.resolves[decoded_packet.req_id] as (
        packet: Packet
      ) => void;

      resolve(built_packet);

      delete this.resolves[decoded_packet.req_id];
    } else if (decoded_packet.track_id !== undefined) {
      this.event_emitter.emit(
        decoded_packet.track_id.toString(),
        built_packet,
        ws
      );
    }
  }

  public listen<T extends Tracks>(
    track_num: T,
    callback: (packet: TrackToPacket<T>, ws: WsType) => any
  ) {
    return this.event_emitter.on(track_num.toString(), callback);
  }

  private encode_packet(packet: FullPacket) {
    return encode(packet);
  }

  private build_packet({ req_id, packet }: FullPacket, ws: WsType) {
    //first number - req_id, second - track_id, third - Packet data
    packet.answer = (p: Packet) => {
      return this.send_full_packet(
        { req_id: req_id, packet: p },
        ws
      ) as Promise<any>;
    };
    return packet;
  }
}
