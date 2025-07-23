import { useEffect, useState } from "react";
import { prot } from "../protocol/client";
import { Card } from "../protocol/packets";

export type File = {
  cards: Card[];
  visible_cards: Card[];
  name: string;
  original: string;
  card_ids: { [id: number]: Card };
};

export type Files = { [name: string]: File };

// in hooks/FetchFile.ts

const useFetchFile = (
  name: string | null | undefined,
  cache?: Files,
  setCache?: (arg0: Files) => void
) => {
  const [file, setFile] = useState<null | File>(() => {
    if (!name) return null;
    return cache?.[name] ?? null;
  });

  useEffect(() => {
    if (!name) {
      return;
    }

    if (cache?.[name]) {
      setFile(cache[name]);
      return;
    } else {
      setFile(null);
    }

    let isMounted = true;
    prot.send("get_file", { name: name }).then((p) => {
      if (!isMounted) return;

      if (p.file != undefined && p.original_file != undefined) {
        const return_file: File = {
          cards: p.file,
          visible_cards: p.file.filter((c) => !c.hidden),
          name: name,
          original: p.original_file,
          card_ids: Object.fromEntries(p.file.map((s) => [s.id, s])),
        };

        setFile(return_file);
        setCache?.({ ...cache, [name]: return_file });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [name, cache, setCache]);

  if (name !== file?.name) {
    return null;
  }

  return file;
};

export default useFetchFile;
