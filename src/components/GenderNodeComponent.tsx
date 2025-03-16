import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { GenderNodeAttributes } from "../utils/gender_node";

const GenderNodeComponent = ({ node: { attrs } }: NodeViewProps) => {
  const { male, female } = attrs as GenderNodeAttributes;

  return (
    <NodeViewWrapper>
      <p contentEditable={false}>
        <span style={{}} className="bg-blue-500 bg-opacity-45">
          {male}
        </span>{" "}
        <span style={{}} className="bg-pink-500 bg-opacity-45">
          {female}
        </span>
      </p>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export default GenderNodeComponent;
