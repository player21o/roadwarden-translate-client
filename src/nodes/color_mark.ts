import { mergeAttributes, Mark } from "@tiptap/react";

export const Color = Mark.create<{ color: string }>({
  name: "color",

  addAttributes() {
    return {
      color: {
        default: "#f6d6bd",
        renderHTML: ({ color }) => {
          return {
            style: `color: ${color}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "color" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["color", mergeAttributes(HTMLAttributes), 0];
  },
});
