import { Window, Windows } from "../utils/localstorage";

export type Action =
  | {
      type: "add";
      window: Window;
    }
  | { type: "remove"; index: number }
  | { type: "focus"; index: number }
  | { type: "set_file_index"; window_index: number; file_index: number };

export default function windows_reducer(windows: Windows, action: Action) {
  switch (action.type) {
    case "add": {
      return { ...windows, windows: [...windows.windows, action.window] };
    }
    case "remove": {
      return {
        ...windows,
        active: windows.active > 0 ? windows.active - 1 : 0,
        windows: windows.windows.filter((_, i) => i != action.index),
      };
    }
    case "focus": {
      return { ...windows, active: action.index };
    }
    case "set_file_index": {
      return {
        ...windows,
        windows: windows.windows.map((w, i) => {
          if (i == action.window_index && w.type == "file") {
            return { ...w, index: action.file_index };
          } else {
            return w;
          }
        }),
      };
    }
  }
}
