import { createContext } from "react";

const EditorWindowSizeContext = createContext({
  window_width: 0,
  window_height: 0,
  screen_width: 0,
  screen_height: 0,
});

export default EditorWindowSizeContext;
