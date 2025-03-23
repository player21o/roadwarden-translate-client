import { useEffect, useState } from "react";
import { prot } from "../protocol/client";
import { Card } from "../protocol/packets";

export type File = {
  cards: Card[];
  visible_cards: Card[];
  name: string;
};

export type Files = { [name: string]: File };

const useFetchFile = (
  name: string,
  cache?: Files,
  setCache?: (arg0: Files) => void
) => {
  const [file, setFile] = useState<null | File>(null);

  useEffect(() => {
    if (cache != undefined && name in cache) {
      setFile(cache[name]);
    } else {
      prot.send("get_file", { name: name }).then((p) => {
        if (p.file != undefined) {
          const sorted = p.file.sort(
            ({ line_start: a }, { line_start: b }) => a - b
          );

          const return_file: File = {
            cards: sorted,
            visible_cards: sorted.filter((c) => !c.hidden),
            name: name,
          };

          setFile(return_file);

          console.log(name);

          if (setCache != undefined && cache != undefined)
            setCache({ ...cache, [name]: return_file });
        }
      });
    }
  }, []);

  return file;
};

export default useFetchFile;
