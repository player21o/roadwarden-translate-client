import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { GenderNodeAttributes } from "../utils/gender_node";

const GenderNodeComponent = ({ node: { attrs } }: NodeViewProps) => {
  const { male, female } = attrs as GenderNodeAttributes;

  return (
    <NodeViewWrapper>
      <p>
        <span style={{}} className="bg-blue-400">
          {male}
        </span>{" "}
        {female}
      </p>
    </NodeViewWrapper>
  );
};

export default GenderNodeComponent;
