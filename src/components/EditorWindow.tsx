interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
  children: React.ReactNode;
  resizable?: boolean;
}

const EditorWindow = ({ width, height, x, y, children }: Props) => {
  return (
    <div
      className="absolute border-chestnut border-2 shadow-2xl bg-darkdarkblue flex-col gap-0 flex"
      style={{
        width: width,
        height: height,
        top: y - height / 2,
        left: x - width / 2,
        fontSize: "0px",
        lineHeight: "0px",
        padding: "0px",
      }}
    >
      {children}
    </div>
  );
};

export default EditorWindow;
