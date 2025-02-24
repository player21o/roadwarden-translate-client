import React from "react";

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
}

const EditorWindow = ({ width, height, x, y }: Props) => {
  return (
    <div
      className="absolute border-chestnut border-2"
      style={{
        width: width,
        height: height,
        top: y - height / 2,
        left: x - width / 2,
      }}
    >
      EditorWindow
    </div>
  );
};

export default EditorWindow;
