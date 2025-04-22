import { useState } from "react";
import { Files } from "../hooks/FetchFile";
import { Drafts, get_or_default, lc, Windows } from "../utils/localstorage";
import useHandleUpdates from "../hooks/HandleUpdates";
import EditorCardController from "./EditorCardController";

const Editor = () => {
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
    <h1>No</h1>
  ) : (
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
  );
};

export default Editor;
