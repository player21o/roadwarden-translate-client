import { useState } from "react";
import useFetchFile, { Files } from "../hooks/FetchFile";
import { Drafts, FileWindow, get_or_default, lc } from "../utils/localstorage";
import useHandleUpdates from "../hooks/HandleUpdates";
import EditorTabs from "./EditorTabs";
import useWindowDimensions from "../hooks/WindowDimensions";
import { clamp_number } from "../utils/utilities";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";
import IconButton from "./IconButton";
import { useReducer } from "react";
import windows_reducer, { Action } from "../reducers/windows_reducer";
import EditorCard from "./EditorCard";
import commit from "../utils/commit";

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

  const activeWindow = windows.windows[windows.active];
  const activeFileName =
    activeWindow?.type === "file" ? (activeWindow as FileWindow).file : null;
  const file = useFetchFile(activeFileName, files, setFiles);

  return windows.windows.length == 0 ? (
    <IconButton
      onClick={() =>
        dispatchWindows({
          type: "add",
          window: { type: "file", file: "shortcut", index: 0, past_cards: [] },
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
        onCloseWindow={(index) => dispatchWindows({ type: "remove", index })}
        onFocusWindow={(index) => dispatchWindows({ type: "focus", index })}
      />
      {activeWindow?.type === "file" && (
        <EditorCard
          key={windows.windows[windows.active].type + windows.active}
          drafts={drafts}
          file={useFetchFile(
            (windows.windows[windows.active] as FileWindow).file,
            files,
            setFiles
          )}
          cardIndex={(windows.windows[windows.active] as FileWindow).index}
          pastCards={(windows.windows[windows.active] as FileWindow).past_cards}
          setDraft={(id, draft) =>
            setDrafts({
              ...drafts,
              [id]: draft,
            })
          }
          setCardIndexNormal={(ind, file) => {
            if (file == null) return;

            const i =
              ind < 0
                ? 0
                : ind > file.visible_cards.length - 1
                ? file.visible_cards.length - 1
                : ind;

            dispatchWindows({
              type: "set_file_window",
              window_index: windows.active,
              window: { index: i },
            });
          }}
          onCommit={(id, content, cb) => {
            commit({
              cache: [savingCards, setSavingCards],
              card_id: id,
              content: content,
              drafts: [drafts, setDrafts],
              onCommit: cb,
            });
          }}
        />
      )}
    </EditorWindowSizeContext.Provider>
  );
};

export default Editor;

/*
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
        />*/
