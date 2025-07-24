import { useContext, useMemo, useRef, useState } from "react";
import { Windows } from "../utils/localstorage";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";
import IconButton from "./IconButton";
import EditorTab from "./EditorTab";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  windows: Windows;
  onNewWindow: () => void;
  onFocusWindow: (index: number) => void;
  onCloseWindow: (index: number) => void;
}

const EditorTabs = ({
  windows,
  onNewWindow,
  onFocusWindow,
  onCloseWindow,
}: Props) => {
  const { window_width, window_height, screen_width, screen_height } =
    useContext(EditorWindowSizeContext);
  const height = useRef(45);
  const border_thickness = useRef(3);
  const [hoveredWindow, setHoveredWindow] = useState(-1);
  const tabsContainer = useRef<null | HTMLDivElement>(null);

  const addWindowButton = useMemo(
    () => (
      <IconButton
        btnClassName="m-0! align-middle"
        tooltip="Открыть карточку"
        onClick={onNewWindow}
      >
        add
      </IconButton>
    ),
    [onNewWindow]
  );

  useHotkeys(
    ["alt+arrowright", "alt+arrowdown"],
    () => {
      onFocusWindow(
        windows.active != windows.windows.length - 1
          ? windows.active + 1
          : windows.active
      );

      setTimeout(
        () =>
          tabsContainer.current != null &&
          tabsContainer.current.children[windows.active + 1].scrollIntoView(),
        30
      );
    },
    {
      enableOnContentEditable: true,
      preventDefault: true,
    }
  );

  useHotkeys(
    ["alt+arrowleft", "alt+arrowup"],
    () => {
      onFocusWindow(windows.active != 0 ? windows.active - 1 : windows.active);
      setTimeout(
        () =>
          tabsContainer.current != null &&
          tabsContainer.current.children[windows.active - 1].scrollIntoView(),
        30
      );
    },
    {
      enableOnContentEditable: true,
      preventDefault: true,
    }
  );

  useHotkeys(
    "alt+n",
    () => {
      onNewWindow();
      onFocusWindow(windows.windows.length);

      setTimeout(
        () =>
          tabsContainer.current != null &&
          tabsContainer.current.children[
            windows.windows.length
          ].scrollIntoView(),
        30
      );
    },
    {
      enableOnContentEditable: true,
      preventDefault: true,
    }
  );

  useHotkeys("alt+w", () => onCloseWindow(windows.active), {
    enableOnContentEditable: true,
    preventDefault: true,
  });

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
      className="absolute flex flex-row justify-start items-center gap-2 overflow-auto flex-wrap"
      ref={tabsContainer}
    >
      {windows.windows.map((window, i) => (
        <EditorTab
          active_window={windows.active == i}
          hovered={hoveredWindow == i}
          window={window}
          window_index={i}
          key={window.type + i}
          onFocusWindow={onFocusWindow}
          setHoveredWindow={setHoveredWindow}
          onCloseWindow={onCloseWindow}
        />
      ))}
      {addWindowButton}
    </div>
  );
};

export default EditorTabs;
