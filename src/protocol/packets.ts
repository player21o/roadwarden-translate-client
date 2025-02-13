export const enum Status {
  success = 200,
  failure = 400,
  rate_limit = 429,
}

export const enum Tracks {
  login,
  logout,
  info,
  user,
  orfile,
  file,
  discordlink,
}

export type TrackToPacketMap = {
  [Tracks.login]: MakeLoginPacket;
  [Tracks.logout]: LogoutPacket;
  [Tracks.info]: GetInfoPacket;
  [Tracks.user]: GetUserPacket;
  [Tracks.orfile]: GetOriginalFilePacket;
  [Tracks.file]: GetFilePacket;
  [Tracks.discordlink]: GetDiscordAuthLink;
};

export type TrackToPacket<T extends Tracks> = TrackToPacketMap[T];

export type extractGeneric<Type> = Type extends Packet<infer X> ? X : never;

export type FullPacket<T extends Packet = Packet> = {
  req_id: number;
  track_id?: Tracks;
  packet: T;
};

export interface Packet<AnswerType = any> {
  status?: Status;
  answer?: (p: AnswerType) => Promise<Packet>; // Changed 'this' to 'Packet'
  ok?: boolean;
}

export interface MakeLoginPacket extends Packet<LoginPacket> {
  method: "session" | "discord";
  token?: string;
}

export interface LoginPacket extends Packet<any> {
  token?: string;
  user_id?: string;
}

export interface LogoutPacket extends Packet<LogoutPacket> {}

export interface GetUserPacket extends Packet<UserPacket> {
  id: string;
}

export type User = {
  name: string;
  id: number;
  avatar_url: string;
};

export type UserPacket = Packet & Partial<User>;

export interface GetInfoPacket extends Packet<InfoPacket> {}

export interface InfoPacket extends Packet {
  user: User;
  stats: {
    translated: number;
    overall: number;
  };
  files: string[];
}

export interface GetOriginalFilePacket extends Packet<OriginalFilePacket> {
  name: string;
}

export interface OriginalFilePacket extends Packet {
  name: string;
  contents?: string;
}

export interface GetFilePacket extends Packet<FilePacket> {
  name: string;
}

export interface FilePacket extends Packet {
  //to be implemented
}

export interface ExitPacket extends Packet {
  exit: string;
}

export interface GetDiscordAuthLink extends Packet<GetDiscordAuthLink> {
  url?: string;
}
