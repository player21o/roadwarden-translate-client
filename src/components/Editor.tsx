import useWindowDimensions from "../hooks/WindowDimensions";
import EditorWindow from "./EditorWindow";

const Editor = () => {
  const { width, height } = useWindowDimensions();

  return (
    <EditorWindow
      width={width - 200}
      height={height - 200}
      x={width / 2}
      y={height / 2}
    />
  );
};

export default Editor;
