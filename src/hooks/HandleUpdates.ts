import { Files } from "./FetchFile";
import useListen from "./Listen";

const useHandleUpdates = (
  setFiles: (updater: (prevFiles: Files) => Files) => void
) => {
  useListen(
    "update",
    ({ data }) => {
      if (data.type === "card") {
        const card = data.card;

        setFiles((prevFiles) => {
          console.log(prevFiles, card.id);
          if (!prevFiles[card.file]) {
            return prevFiles;
          }
          return {
            ...prevFiles,
            [card.file]: {
              ...prevFiles[card.file],
              cards: prevFiles[card.file].cards.map((c) =>
                c.id === card.id ? card : c
              ),
              card_ids: { ...prevFiles[card.file].card_ids, [card.id]: card },
              visible_cards: prevFiles[card.file].visible_cards
                .map((c) => (c.id === card.id ? card : c))
                .filter((c) => !c.hidden),
            },
          };
        });
      }
    },
    [setFiles]
  );
};

export default useHandleUpdates;
