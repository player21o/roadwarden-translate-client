import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import GenderNodeComponent from "../components/GenderNodeComponent";

export interface GenderNodeAttributes {
  male: string;
  female: string;
}

export const GenderNode = Node.create<{
  attributes: GenderNodeAttributes;
}>({
  name: "gender",
  inline: true,
  group: "inline",

  addNodeView() {
    return ReactNodeViewRenderer(GenderNodeComponent);
  },

  addAttributes() {
    return {
      male: { default: "Мужчина" },
      female: { default: "Женщина" },
    };
  },

  parseHTML() {
    return [{ tag: "gender" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["gender", mergeAttributes(HTMLAttributes)];
  },
});
