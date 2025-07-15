/*
import { memo } from "react";
import IconButton from "./IconButton";

interface Props {
  active_window: boolean;
  hovered: boolean;
  file_name: string;
  card_index: number;
  window_index: number;
  onFocusWindow: (index: number) => void;
  setHoveredWindow: (index: number) => void;
  onCloseWindow: (index: number) => void;
}

export default memo(
  function EditorTab({
    active_window,
    hovered,
    file_name,
    card_index,
    window_index,
    onFocusWindow,
    setHoveredWindow,
    onCloseWindow,
  }: Props) {
    return (
      <div
        onClick={() => onFocusWindow(window_index)}
        onMouseEnter={() => setHoveredWindow(window_index)}
        onMouseLeave={() => setHoveredWindow(-1)}
        className={`${
          active_window
            ? "border-brightpale text-brightpale z-10"
            : "border-chestnut text-chestnut z-0"
        } border-2 p-2 border-b-0 bg-darkdarkblue cursor-pointer relative`}
      >
        {hovered && (
          <IconButton
            btnClassName="align-middle absolute bg-black !white rounded-full scale-75 right-0 top-0 z-50"
            onClick={(event) => {
              onCloseWindow(window_index);
              event.stopPropagation();
            }}
          >
            close
          </IconButton>
        )}
        <p>
          {file_name} - {card_index + 1}
        </p>
      </div>
    );
  },
  (old, n) =>
    old.active_window == n.active_window &&
    old.file_name == n.file_name &&
    old.hovered == n.hovered &&
    n.card_index == old.card_index
);
*/

import { memo } from "react";
import { FileWindow, Window } from "../utils/localstorage";
import IconButton from "./IconButton";

interface Props {
  active_window: boolean;
  hovered: boolean;
  window_index: number;
  window: Window;
  onFocusWindow: (index: number) => void;
  setHoveredWindow: (index: number) => void;
  onCloseWindow: (index: number) => void;
}

export default memo(
  function EditorTab({
    active_window,
    hovered,
    onCloseWindow,
    onFocusWindow,
    setHoveredWindow,
    window_index,
    window,
  }: Props) {
    return (
      <div
        onClick={() => onFocusWindow(window_index)}
        onMouseEnter={() => setHoveredWindow(window_index)}
        onMouseLeave={() => setHoveredWindow(-1)}
        className={`${
          active_window
            ? "border-brightpale text-brightpale z-10"
            : "border-chestnut text-chestnut z-0"
        } border-2 p-2 border-b-0 bg-darkdarkblue cursor-pointer relative`}
      >
        {hovered && (
          <IconButton
            btnClassName="align-middle absolute bg-black !white rounded-full scale-75 right-0 top-0 z-50"
            onClick={(event) => {
              onCloseWindow(window_index);
              event.stopPropagation();
            }}
          >
            close
          </IconButton>
        )}
        <p>
          {window.type == "file" ? `${window.file} - ${window.index + 1}` : "a"}
        </p>
      </div>
    );
  },
  (prev, next) => {
    switch (prev.window.type) {
      case "file": {
        return (
          prev.window.file == (next.window as FileWindow).file &&
          prev.window.index == (next.window as FileWindow).index
        );
      }
      case "search": {
        return false;
      }
    }
  }
);
