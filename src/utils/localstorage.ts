type LcSchema = {
  session: string;
};

type Keys = keyof LcSchema;

export const lc = {
  get<T extends Keys>(key: T): LcSchema[T] | null {
    // Return type will depend on the key
    const data = window.localStorage.getItem(key);

    //type ReturnType = ???
    if (data !== null) {
      return data as LcSchema[T];
    }

    //console.error(`localStorage missing object with key ${key}`);
    return null;
  },

  set<T extends Keys>(key: T, value: LcSchema[T]) {
    window.localStorage.setItem(key, value as any);
  },

  remove(key: Keys) {
    window.localStorage.removeItem(key);
  },

  clear() {
    window.localStorage.clear();
  },
};
