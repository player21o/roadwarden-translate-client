import { useState } from "react";
import { Files } from "../hooks/FetchFile";
import { Drafts, get_or_default, lc, Windows } from "../utils/localstorage";
import useHandleUpdates from "../hooks/HandleUpdates";
import EditorCardController from "./EditorCardController";
import EditorTabs from "./EditorTabs";
import useWindowDimensions from "../hooks/WindowDimensions";
import { clamp_number } from "../utils/utilities";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";
import IconButton from "./IconButton";

const Editor = () => {
  const { width, height } = useWindowDimensions();
  const [window_width, window_height] = [
    clamp_number(width - 600, 600, 1000),
    height - 200,
  ];

  const [files, setFiles] = useState<Files>({});
  const [savingCards, setSavingCards] = useState<number[]>([]);

  useHandleUpdates(files, setFiles);

  const [windows, setWindowsState] = useState(
    get_or_default("windows", {
      dict: false,
      code: false,
      cards: [{ file: "prologue", index: 0 }],
      active: 0,
    })
  );

  const [drafts, setDraftsState] = useState(get_or_default("drafts", {}));

  const setWindows = (data: Windows) => {
    setWindowsState(data);
    lc.set("windows", data);
  };

  const setDrafts = (data: Drafts) => {
    setDraftsState(data);
    lc.set("drafts", data);
  };

  return windows.cards.length == 0 ? (
    <IconButton
      onClick={() =>
        setWindows({
          ...windows,
          cards: [...windows.cards, { file: "prologue", index: 0 }],
        })
      }
    >
      add
    </IconButton>
  ) : (
    <EditorWindowSizeContext.Provider
      value={{
        window_width: window_width,
        window_height: window_height,
        screen_height: height,
        screen_width: width,
      }}
    >
      <EditorTabs
        windows={windows}
        onNewWindow={() =>
          setWindows({
            ...windows,
            cards: [...windows.cards, { file: "prologue", index: 0 }],
          })
        }
        onCloseWindow={(index) =>
          setWindows({
            ...windows,
            cards: windows.cards.filter((_, i) => i != index),
            active: windows.active > 0 ? windows.active - 1 : 0,
          })
        }
        onFocusWindow={(i) => setWindows({ ...windows, active: i })}
      />
      <EditorCardController
        drafts={drafts}
        files={files}
        savingCards={savingCards}
        setDrafts={setDrafts}
        setFiles={setFiles}
        setSavingCards={setSavingCards}
        setWindows={setWindows}
        windows={windows}
      />
    </EditorWindowSizeContext.Provider>
  );
};

export default Editor;
