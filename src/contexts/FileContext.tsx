import { createContext } from "react";
import { Card } from "../protocol/packets";

export const default_files = { files: {}, ids: {} };

const FileContext = createContext<{
  files: { [file_name: string]: Card[] };
  ids: { [id: number]: Card[] };
}>(default_files);

export default FileContext;
