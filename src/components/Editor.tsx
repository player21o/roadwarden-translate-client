import EditorCard from "./EditorCard";
import { useContext, useState } from "react";
import useFetchFile, { Files } from "../hooks/FetchFile";
import { Drafts, get_or_default, lc, Windows } from "../utils/localstorage";
import { useHotkeys } from "react-hotkeys-hook";
import { UserContext } from "../contexts/UserContext";
import useGetUser from "../hooks/GetUser";
import { UserPermission } from "../protocol/packets";
import useHandleUpdates from "../hooks/HandleUpdates";
import commit from "../utils/commit";

const Editor = () => {
  const { user } = useContext(UserContext);
  const me = useGetUser(user.id);

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

  const go_to_card = (
    ind: number,
    callback: (arg0: number) => void,
    relative?: boolean
  ) => {
    const window = windows.cards[windows.active];

    if (window != undefined) {
      const file = files[window.file];
      //console.log(files, window.file);

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
      drafts={drafts}
      onChange={(card, content) => setDrafts({ ...drafts, [card.id]: content })}
      onCommit={(card, content) => {
        console.log(content);
        commit({
          cache: [savingCards, setSavingCards],
          card_id: card.id,
          content: content,
          drafts: [drafts, setDrafts],
        });
      }}
      saving={false}
      allowed={
        me != null
          ? me.permissions.filter(
              (val) =>
                val[0] == UserPermission.file &&
                val[1] == windows.cards[windows.active].file
            ).length > 0 ||
            me.permissions.filter(
              (val) => val[0] == UserPermission.file && val[1] == "all"
            ).length > 0
          : false
      }
    />
  );
};

export default Editor;
