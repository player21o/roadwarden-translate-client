import EditorCard from "./EditorCard";
import { useState } from "react";
import useFetchFile, { Files } from "../hooks/FetchFile";
import { lc, Windows } from "../utils/localstorage";
import { useHotkeys } from "react-hotkeys-hook";

const Editor = () => {
  const [files, setFiles] = useState<Files>({});
  const [windows, setWindowsState] = useState<Windows>(
    lc.get("windows") != null
      ? lc.get("windows")!
      : {
          dict: false,
          code: false,
          cards: [{ file: "beach", index: 0 }],
          active: 0,
        }
  );

  const setWindows = (data: Windows) => {
    setWindowsState(data);
    lc.set("windows", data);
  };

  const go_to_card = (
    ind: number,
    callback: (arg0: number) => void,
    relative?: boolean
  ) => {
    const window = windows.cards[windows.active];

    if (window != undefined) {
      const file = files[window.file];
      console.log(files, window.file);

      if (file != null) {
        const new_ind =
          relative != undefined && relative == true ? window.index + ind : ind;

        if (new_ind >= 0 && new_ind <= file.visible_cards.length - 1) {
          callback(new_ind);
        }
      }
    }
  };

  const set_card_index = (index: number) => {
    if (windows.cards[windows.active] != undefined) {
      setWindows({
        ...windows,
        cards: windows.cards.map((_, i) => {
          if (i == windows.active) {
            return { ...windows.cards[windows.active], index: index };
          } else {
            return windows.cards[windows.active];
          }
        }),
      });
    }
  };

  useHotkeys("ctrl+arrowdown", () =>
    go_to_card(
      1,
      (new_ind) => {
        set_card_index(new_ind);
      },
      true
    )
  );

  useHotkeys("ctrl+arrowup", () =>
    go_to_card(
      -1,
      (new_ind) => {
        set_card_index(new_ind);
      },
      true
    )
  );

  return windows.cards.length == 0 ? (
    <h1>No</h1>
  ) : (
    <EditorCard
      index={windows.cards[windows.active].index}
      file={useFetchFile(windows.cards[windows.active].file, files, setFiles)}
    />
  );
};

export default Editor;
