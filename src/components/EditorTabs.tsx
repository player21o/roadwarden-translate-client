import { useContext, useRef, useState } from "react";
import { Windows } from "../utils/localstorage";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";
import IconButton from "./IconButton";

interface Props {
  windows: Windows;
  onNewWindow: () => void;
  onFocusWindow: (arg0: number) => void;
}

const EditorTabs = ({ windows, onNewWindow, onFocusWindow }: Props) => {
  const { window_width, window_height, screen_width, screen_height } =
    useContext(EditorWindowSizeContext);
  const height = useRef(45);
  const border_thickness = useRef(2);
  const [hoveredWindow, setHoveredWindow] = useState(-1);

  return (
    <div
      style={{
        width: window_width,
        height: height.current,
        top:
          (screen_height - window_height) / 2 -
          height.current +
          border_thickness.current,
        left: screen_width / 2 - window_width / 2 + 10,
      }}
      className="absolute flex flex-row justify-start items-center gap-2 overflow-auto"
    >
      {windows.cards.map((window, i) => (
        <div
          key={window.file + window.index + i}
          className={`${
            windows.active == windows.cards.indexOf(window)
              ? "border-brightpale text-brightpale"
              : "border-chestnut text-chestnut"
          } border-2 p-2 border-b-0 bg-darkdarkblue cursor-pointer`}
          onClick={() => onFocusWindow(i)}
          onMouseEnter={() => setHoveredWindow(i)}
          onMouseLeave={() => setHoveredWindow(-1)}
        >
          <IconButton
            btnClassName={`align-middle absolute bg-black !white rounded-full scale-75 -left-4 ${
              hoveredWindow == i ? "block" : "hidden"
            }`}
          >
            close
          </IconButton>
          <p>
            {window.file} - {window.index + 1}
          </p>
        </div>
      ))}
      <IconButton
        btnClassName="m-0 align-middle"
        tooltip="Открыть карточку"
        onClick={onNewWindow}
      >
        add
      </IconButton>
    </div>
  );
};

export default EditorTabs;
