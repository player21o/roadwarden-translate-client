import { Files } from "./FetchFile";
import useListen from "./Listen";

const useHandleUpdates = (files: Files, setFiles: (arg0: Files) => void) => {
  useListen(
    "update",
    ({ data }) => {
      //console.log(data);
      if (data.type == "card") {
        //card updates
        const card = data.card;
        setFiles({
          ...files,
          [card.file]: {
            ...files[card.file],
            cards: files[card.file].cards.map((c) =>
              c.id == card.id ? card : c
            ),
          },
        });
      }
    },
    [files]
  );
};

export default useHandleUpdates;
