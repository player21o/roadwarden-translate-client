import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

const VariableNodeComponent = () => {
  return (
    <NodeViewWrapper
      as={"span"}
      className="bg-linear-to-t from-gray-900 to-gray-800 rounded text-white cursor-pointer p-1"
      contentEditable={false} // Blocks editing
      style={
        {
          //userSelect: "none", // Blocks text selection
          //pointerEvents: "none", // Blocks clicks (optional)
        }
      }
    >
      <NodeViewContent as={"span"} />
    </NodeViewWrapper>
  );
};

export default VariableNodeComponent;
