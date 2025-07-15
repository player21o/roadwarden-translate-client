import { useState } from "react";
import { Files } from "../hooks/FetchFile";
import { Drafts, FileWindow, get_or_default, lc } from "../utils/localstorage";
import useHandleUpdates from "../hooks/HandleUpdates";
import EditorCardController from "./EditorCardController";
import EditorTabs from "./EditorTabs";
import useWindowDimensions from "../hooks/WindowDimensions";
import { clamp_number } from "../utils/utilities";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";
import IconButton from "./IconButton";
import { useReducer } from "react";
import windows_reducer, { Action } from "../reducers/windows_reducer";

const Editor = () => {
  const { width, height } = useWindowDimensions();
  const [window_width, window_height] = [
    clamp_number(width - 600, 600, 1000),
    height - 200,
  ];

  const [files, setFiles] = useState<Files>({});
  const [savingCards, setSavingCards] = useState<number[]>([]);

  useHandleUpdates(files, setFiles);

  const [windows, dispatchWindowsState] = useReducer(
    windows_reducer,
    get_or_default("windows", {
      dict: false,
      code: false,
      windows: [{ type: "file", file: "prologue", index: 0, past_cards: [] }],
      active: 0,
    })
  );

  const [drafts, setDraftsState] = useState(get_or_default("drafts", {}));

  const dispatchWindows = (action: Action) => {
    dispatchWindowsState(action);
    lc.set("windows", windows_reducer(windows, action));
  };

  const setDrafts = (data: Drafts) => {
    setDraftsState(data);
    lc.set("drafts", data);
  };

  return windows.windows.length == 0 ? (
    <IconButton
      onClick={() =>
        //setWindows({
        //  ...windows,
        //  windows: [
        //    ...windows.windows,
        //    { type: "file", file: "prologue", index: 0 },
        //  ],
        //})
        dispatchWindows({
          type: "add",
          window: { type: "file", file: "prologue", index: 0, past_cards: [] },
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
          //setWindows({
          //  ...windows,
          //  cards: [...windows.cards, { file: "prologue", index: 0 }],
          //})
          dispatchWindows({
            type: "add",
            window: {
              type: "file",
              file: "prologue",
              index: 0,
              past_cards: [],
            },
          })
        }
        onCloseWindow={(index) =>
          //setWindows({
          //  ...windows,
          ////  cards: windows.cards.filter((_, i) => i != index),
          //  active: windows.active > 0 ? windows.active - 1 : 0,
          //})
          dispatchWindows({ type: "remove", index })
        }
        onFocusWindow={(index) => dispatchWindows({ type: "focus", index })}
      />
      {windows.windows[windows.active].type == "file" ? (
        <EditorCardController
          drafts={drafts}
          files={files}
          savingCards={savingCards}
          setDrafts={setDrafts}
          setFiles={setFiles}
          setSavingCards={setSavingCards}
          setCardIndex={(index: number, past: boolean | "clear") => {
            if (past == true) {
              dispatchWindows({
                type: "set_file_window",
                window: {
                  index,
                  past_cards: [
                    ...(windows.windows[windows.active] as FileWindow)
                      .past_cards,
                    (windows.windows[windows.active] as FileWindow).index,
                  ],
                },
                window_index: windows.active,
              });
            } else if (past == false) {
              dispatchWindows({
                type: "set_file_window",
                window: {
                  index,
                },
                window_index: windows.active,
              });
            } else if (past == "clear") {
              dispatchWindows({
                type: "set_file_window",
                window: {
                  index,
                  past_cards: [],
                },
                window_index: windows.active,
              });
            }
          }}
          window={windows.windows[windows.active] as FileWindow}
        />
      ) : null}
    </EditorWindowSizeContext.Provider>
  );
};

export default Editor;
