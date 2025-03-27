import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import VariableNodeComponent from "../components/VariableNodeComponent";

export const VariableNode = Node.create({
  name: "variable",
  group: "inline",
  inline: true,
  //atom: true,
  selectable: true,
  content: "text*",

  parseHTML() {
    return [
      {
        tag: "var",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["var", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableNodeComponent);
  },
});
