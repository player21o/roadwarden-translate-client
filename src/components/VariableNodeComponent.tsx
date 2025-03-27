import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

const VariableNodeComponent = () => {
  return (
    <NodeViewWrapper
      as={"span"}
      className="bg-gradient-to-t from-gray-900 to-gray-800 rounded text-white p-1"
    >
      <NodeViewContent as={"span"} />
    </NodeViewWrapper>
  );
};

export default VariableNodeComponent;
