export type Windows = {
  dict: boolean;
  code: boolean;
  windows: Window[];
  active: number;
};

export type Window = FileWindow | SearchWindow;

export interface FileWindow {
  type: "file";
  file: string;
  index: number;
}

export interface SearchWindow {
  type: "search";
  query: string;
  files: string[];
  ignore_case: boolean;
  search_translated: boolean;
  search_original: boolean;
  to_replace: string;
}

export type Drafts = { [card: number]: string };

type LcSchema = {
  session: [string];
  windows: Windows;
  drafts: Drafts;
};

type Keys = keyof LcSchema;

export function get_or_default<T extends Keys>(key: T, value: LcSchema[T]) {
  return lc.get(key) != null ? lc.get(key)! : value;
}

export const lc = {
  get<T extends Keys>(key: T): LcSchema[T] | null {
    // Return type will depend on the key
    const data = window.localStorage.getItem(key);

    //type ReturnType = ???
    if (data !== null) {
      return JSON.parse(data) as LcSchema[T];
    }

    //console.error(`localStorage missing object with key ${key}`);
    return null;
  },

  set<T extends Keys>(key: T, value: LcSchema[T]) {
    window.localStorage.setItem(key, JSON.stringify(value) as any);
  },

  remove(key: Keys) {
    window.localStorage.removeItem(key);
  },

  clear() {
    window.localStorage.clear();
  },
};
