import { prot } from "../protocol/client";
import { Status } from "../protocol/packets";
import { Drafts } from "./localstorage";

const commit = ({
  cache: [cache, setCache],
  drafts: [drafts, setDrafts],
  card_id,
  content,
  onCommit,
}: {
  cache: [number[], (arg0: number[]) => void];
  drafts: [Drafts, (arg0: Drafts) => void];
  card_id: number;
  content: string;
  onCommit?: () => void;
}) => {
  setCache([...cache, card_id]);

  console.log("commiting...");

  prot
    .send("commit", { card_id: card_id, content: content })
    .then(({ status }) => {
      console.log("received answer!");
      setCache(cache.filter((v) => v != card_id));

      if (status == Status.success) {
        const mod = { ...drafts };
        delete mod[card_id];
        setDrafts({ ...mod });
      }

      if (onCommit != undefined) onCommit();
    });
};

export default commit;
