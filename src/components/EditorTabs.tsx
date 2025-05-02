import { useContext, useRef } from "react";
import { Windows } from "../utils/localstorage";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";

interface Props {
  windows: Windows;
}

const EditorTabs = ({ windows }: Props) => {
  const { window_width, window_height, screen_width, screen_height } =
    useContext(EditorWindowSizeContext);
  const height = useRef(50);
  const border_thickness = useRef(2);

  return (
    <div
      style={{
        width: window_width,
        height: height.current,
        top:
          (screen_height - window_height) / 2 -
          height.current +
          border_thickness.current,
        left: screen_width / 2 - window_width / 2,
      }}
      className="absolute flex flex-row justify-start items-end"
    >
      {windows.cards.map((window) => (
        <div
          key={window.file + window.index}
          className={`${
            windows.active == windows.cards.indexOf(window)
              ? "border-brightpale text-brightpale"
              : "border-chestnut text-chestnut"
          } border-2 p-2 border-b-0 bg-darkdarkblue`}
        >
          <p>
            {window.file} - {window.index + 1}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
