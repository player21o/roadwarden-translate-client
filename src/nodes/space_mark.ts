import { mergeAttributes, Mark } from "@tiptap/react";

export const Space = Mark.create({
  name: "space",

  parseHTML() {
    return [{ tag: "space" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["color", mergeAttributes(HTMLAttributes), 0];
  },
});
