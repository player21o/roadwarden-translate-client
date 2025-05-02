import { useHotkeys } from "react-hotkeys-hook";
import useFetchFile, { Files } from "../hooks/FetchFile";
import { Drafts, Windows } from "../utils/localstorage";
import EditorCard from "./EditorCard";
import commit from "../utils/commit";
import { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import useGetUser from "../hooks/GetUser";
import { UserPermission } from "../protocol/packets";
import EditorCardJump from "./EditorCardJump";

interface Props {
  windows: Windows;
  setWindows: (arg0: Windows) => void;
  files: Files;
  setFiles: (arg0: Files) => void;
  drafts: Drafts;
  setDrafts: (arg0: Drafts) => void;
  savingCards: number[];
  setSavingCards: (arg0: number[]) => void;
}

const EditorCardController = ({
  windows,
  setWindows,
  files,
  setFiles,
  drafts,
  setDrafts,
  savingCards,
  setSavingCards,
}: Props) => {
  const { user } = useContext(UserContext);
  const me = useGetUser(user.id);

  const window = windows.cards[windows.active];

  const [jump, setJump] = useState(false);

  const toggle_jump = () => (jump ? setJump(false) : setJump(true));

  const go_to_card = (
    ind: number,
    callback: (arg0: number) => void,
    relative?: boolean
  ) => {
    const file = files[window.file];

    if (file != null) {
      const new_ind =
        relative != undefined && relative == true ? window.index + ind : ind;

      if (new_ind >= 0 && new_ind <= file.visible_cards.length - 1) {
        callback(new_ind);
      }
    }
  };

  const set_card_index = (index: number) => {
    setWindows({
      ...windows,
      cards: windows.cards.map((_, i) => {
        if (i == windows.active) {
          return { ...window, index: index };
        } else {
          return window;
        }
      }),
    });
  };

  useHotkeys(
    "ctrl+arrowdown",
    () =>
      !jump &&
      go_to_card(
        1,
        (new_ind) => {
          set_card_index(new_ind);
        },
        true
      )
  );

  useHotkeys(
    "ctrl+arrowup",
    () =>
      !jump &&
      go_to_card(
        -1,
        (new_ind) => {
          set_card_index(new_ind);
        },
        true
      )
  );

  useHotkeys("ctrl+j", (event) => {
    toggle_jump();
    event.preventDefault();
  });

  return (
    <EditorCard
      index={window.index}
      file={useFetchFile(window.file, files, setFiles)}
      drafts={drafts}
      onChange={(card, content) => setDrafts({ ...drafts, [card.id]: content })}
      onCommit={(card, content) => {
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
              (val) => val[0] == UserPermission.file && val[1] == window.file
            ).length > 0 ||
            me.permissions.filter(
              (val) => val[0] == UserPermission.file && val[1] == "all"
            ).length > 0
          : false
      }
      onJump={() => toggle_jump()}
    >
      {jump && (
        <EditorCardJump
          onJump={(ind) => {
            setJump(false);
            if (ind != -1) {
              go_to_card(
                ind,
                (new_ind) => {
                  set_card_index(new_ind);
                },
                false
              );
            }
          }}
          file={files[window.file]}
        />
      )}
    </EditorCard>
  );
};

export default EditorCardController;
