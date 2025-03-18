import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { GenderNodeAttributes } from "../utils/gender_node";

const GenderNodeComponent = ({ node: { attrs } }: NodeViewProps) => {
  const { type } = attrs as GenderNodeAttributes;

  return (
    <NodeViewWrapper>
      <NodeViewContent
        className={`bg-opacity-45 ${
          type == "male" ? "bg-blue-500" : "bg-pink-500"
        }`}
      />
    </NodeViewWrapper>
  );
};

export default GenderNodeComponent;
