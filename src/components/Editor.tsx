import EditorCard from "./EditorCard";
import FileContext, { default_files } from "../contexts/FileContext";
import { useState } from "react";
import { prot } from "../protocol/client";

const Editor = () => {
  const [files, setFiles] = useState(default_files);

  const fetch_file = (file_name: string) => {
    prot.send("get_file", { name: file_name }).then(({ file }) => {
      if (file != undefined) {
        setFiles({ files: { [file_name]: file }, ids: [] });
        console.log({ files: { [file_name]: file }, ids: [] });
      }
    });
  };

  return (
    <FileContext.Provider value={files}>
      <EditorCard file="beach" index={0} fetch_file={fetch_file} />
    </FileContext.Provider>
  );
};

export default Editor;
