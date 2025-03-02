import EditorCard from "./EditorCard";
import FileContext, { default_files } from "../contexts/FileContext";
import { useState } from "react";

const Editor = () => {
  const [files, setFiles] = useState(default_files);

  return (
    <FileContext.Provider value={files}>
      <EditorCard
        file="Nigger"
        card_id={1}
        get_card={() => ({ id: 1, original: "ss", translation: "ss" })}
      />
    </FileContext.Provider>
  );
};

export default Editor;
