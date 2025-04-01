import { z } from "zod";

/*
export const enum Tracks {
  login,
  logout,
  info,
  user,
  orfile,
  file,
  discordlink,
  stats,
}

export type TrackToPacketMap = {
  [Tracks.login]: MakeLoginPacket;
  [Tracks.logout]: LogoutPacket;
  [Tracks.info]: GetInfoPacket;
  [Tracks.user]: GetUserPacket;
  [Tracks.orfile]: GetOriginalFilePacket;
  [Tracks.file]: GetFilePacket;
  [Tracks.discordlink]: GetDiscordAuthLink;
  [Tracks.stats]: GetStatsPacket;
};

export type OkPacket<Data, AnswerType = any> = Packet<AnswerType> &
  (
    | ({
        ok: true;
      } & Data)
    | ({
        ok?: false | undefined;
      } & Partial<Data>)
  );

export interface PacketDate {
  year: number;
  month: number;
  day: number;
}

export type TrackToPacket<T extends Tracks> = TrackToPacketMap[T];

export type extractGeneric<Type> = Type extends Packet<infer X> ? X : never;



export interface Packet<AnswerType = any> {
  status?: Status;
  answer?: (p: AnswerType) => Promise<Packet>; // Changed 'this' to 'Packet'
  ok?: boolean;
}

export interface MakeLoginPacket extends Packet<LoginPacket> {
  method: "session" | "discord";
  token: string;
}

export type LoginPacket = OkPacket<{ token: string; user_id: string }>;

export interface LogoutPacket extends Packet<LogoutPacket> {}

export interface GetUserPacket extends Packet<UserPacket> {
  id: string;
}

//export type UserPacket = Packet & Partial<User>;
export type UserPacket = OkPacket<User>;

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

export interface GetStatsPacket extends Packet<StatsPacket> {
  start: PacketDate;
  end: PacketDate;
}

export type StatsPacket = OkPacket<{ data: number[] }>;
*/

export type FullPacket = {
  req_id: number;
  track_id?: keyof typeof tracks;
  packet: any;
};

export enum Status {
  success = 200,
  failure = 400,
  rate_limit = 429,
}

export enum UserPermission {
  file,
  admin,
}

const Response = z.object({
  status: z.nativeEnum(Status),
});

const Login = {
  request: z.object({
    method: z.union([z.literal("discord"), z.literal("session")]),
    token: z.string(),
  }),
  response: Response.extend({
    session_token: z.string().optional(),
    user_id: z.string().optional(),
  }),
};

const GetInfo = {
  request: z.object({
    type: z.union([
      z.literal("discord_auth_link"),
      z.literal("translation_stats"),
    ]),
  }),
  response: Response.extend({}).and(
    z
      .object({
        translation_stats: z
          .object({
            all: z.number(),
            translated: z.number(),
          })
          .optional(),
      })
      .or(
        z
          .object({
            link: z.string(),
          })
          .optional()
      )
  ),
};

const User = z.object({
  name: z.string(),
  id: z.string(),
  avatar_url: z.string(),
  permissions: z
    .tuple([z.nativeEnum(UserPermission)])
    .rest(z.any())
    .array(),
});

export type User = z.infer<typeof User>;

//

const GetUser = {
  request: z.object({
    user_id: z.string(),
  }),
  response: Response.extend({
    user: User.optional(),
  }),
};

const GetStats = {
  request: z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  }),
  response: Response.extend({
    data: z.number().array(),
  }),
};

const Card = z.object({
  id: z.number(),
  original: z.string(),
  translation: z.string(),
  search_original: z.string().array(),
  search_translation: z.string().array(),
  hidden: z.boolean(),
  line_start: z.number(),
  line_end: z.number(),
  file: z.string(),
});

export type Card = z.infer<typeof Card>;

const GetFile = {
  request: z.object({
    name: z.string(),
  }),
  response: Response.extend({
    file: z.array(Card).optional(),
    original_file: z.string().optional(),
  }),
};

const Commit = {
  request: z.object({
    card_id: z.number(),
    content: z.string(),
  }),
  response: Response,
};

const DictEntry = z.object({
  id: z.number(),
  original: z.array(z.string()),
  translation: z.array(z.string()),
  context: z.string(),
  author: z.string(),
});

type DictEntry = z.infer<typeof DictEntry>;

const Dict = z.record(z.number(), DictEntry);

type Dict = z.infer<typeof Dict>;

const GetDict = {
  request: z.object({}),
  response: Response.extend({
    dict: Dict,
  }),
};

const Bullet = <T extends z.ZodTypeAny>(data: T) => ({
  request: data,
  response: data,
});

const Update = Bullet(
  z
    .object({
      type: z.literal("card"),
      card: Card,
    })
    .or(
      z.object({
        type: z.literal("dict"),
        operation: z.literal("alter").or(z.literal("delete")),
        entry: DictEntry,
      })
    )
);

export const tracks = {
  //bidirectional
  login: Login,
  get_info: GetInfo,
  get_user: GetUser,
  get_stats: GetStats,
  get_file: GetFile,
  commit: Commit,
  get_dict: GetDict,

  //server-to-client
  update: Update,
};
