import EditorCard from "./EditorCard";
import { useState } from "react";
import useFetchFile, { Files } from "../contexts/FetchFile";

const Editor = () => {
  const [files, setFiles] = useState<Files>({});

  return (
    <EditorCard start_index={0} file={useFetchFile("beach", files, setFiles)} />
  );
};

export default Editor;
