import { decode, encode } from "msgpack-lite";
import { tracks, type FullPacket } from "./packets";
//import { ZodPacket } from "./packets";
import { WsType } from "./ws_type";
import { EventEmitter } from "node:events";
import { z } from "zod";

export interface SendPacketArgs {
  packet: any; // Changed parameter type from Packet to P
  track?: keyof typeof tracks;
  req_id?: number;
}

export class Protocol {
  private resolves: { [key: number]: (packet: any) => void } = {};

  public event_emitter = new EventEmitter();
  //private event_emitter_rate_limits: {
  //  [key in keyof typeof tracks]?: { interval: number; last_packet: number };
  //} = {};

  public send_full_packet(full_packet: FullPacket, ws: WsType) {
    return new Promise<(typeof full_packet)["packet"]["response"]>(
      (resolve) => {
        // Updated return type
        this.resolves[full_packet.req_id] = resolve;
        ws.send(this.encode_packet(full_packet));
      }
    );
  }

  public send_packet<T extends keyof typeof tracks>(
    { packet, req_id, track }: SendPacketArgs,
    ws: WsType
  ): Promise<z.infer<(typeof tracks)[T]["response"]>> {
    // Updated return type
    const full_packet: FullPacket = {
      packet: packet,
      req_id: Math.round(Math.random() * 1000),
    };

    if (track != undefined) {
      full_packet.track_id = track;
    }

    if (req_id != undefined) full_packet.req_id = req_id;

    return this.send_full_packet(full_packet, ws);
  }

  protected receive_packet(packet: Uint8Array, ws: WsType) {
    const decoded_packet: FullPacket = decode(packet);
    //decoded_packet.packet.ok = decoded_packet.packet.status! == Status.success;
    if (decoded_packet.req_id in this.resolves) {
      let resolve = this.resolves[decoded_packet.req_id] as (
        packet: any
      ) => void;

      resolve(decoded_packet.packet);

      delete this.resolves[decoded_packet.req_id];
    } else if (decoded_packet.track_id !== undefined) {
      /*
      if (
        Date.now() >=
        this.event_emitter_rate_limits[decoded_packet.track_id]!.last_packet
      ) {
        this.event_emitter.emit(
          decoded_packet.track_id.toString(),
          built_packet,
          ws
        );

        this.event_emitter_rate_limits[decoded_packet.track_id]!.last_packet =
          Date.now() +
          this.event_emitter_rate_limits[decoded_packet.track_id]!.interval *
            1000;
      } else {
        built_packet.answer!({ status: Status.rate_limit } as Packet);
      }
        */
      if (
        decoded_packet.track_id in tracks &&
        tracks[decoded_packet.track_id]["request"].safeParse(
          decoded_packet.packet
        ).success
      ) {
        this.event_emitter.emit(
          decoded_packet.track_id.toString(),
          {
            data: decoded_packet.packet,
            answer: (pack: any) =>
              this.send_full_packet(
                {
                  packet: pack,
                  req_id: decoded_packet.req_id,
                  track_id: decoded_packet.track_id,
                },
                ws
              ),
          },
          ws
        );
      } else {
        console.log(
          decoded_packet,
          tracks[decoded_packet.track_id]["request"].safeParse(
            decoded_packet.packet
          ).error!
        );
      }
    }
  }

  public listen<T extends keyof typeof tracks>(
    track: T,
    callback: (
      packet: {
        data: z.infer<(typeof tracks)[T]["request"]>;
        answer: (arg0: z.infer<(typeof tracks)[T]["response"]>) => Promise<any>;
      },
      ws: WsType
    ) => any
  ) {
    // The EventEmitter's `on` method is what we want. It adds a listener.
    this.event_emitter.on(track.toString(), callback);
  }

  public off<T extends keyof typeof tracks>(
    track: T,
    callback: (...args: any[]) => void // A generic function type for the listener
  ) {
    // Use `removeListener` for surgical removal, NOT `removeAllListeners`.
    this.event_emitter.removeListener(track.toString(), callback);
  }

  private encode_packet(packet: FullPacket) {
    return encode(packet);
  }
}
