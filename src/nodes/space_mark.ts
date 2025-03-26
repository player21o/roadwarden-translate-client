import { mergeAttributes, Mark } from "@tiptap/react";

export const Space = Mark.create({
  name: "space",
  inclusive: false,
  exitable: true,

  parseHTML() {
    return [{ tag: "space" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["space", mergeAttributes(HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      Space: () => this.editor.commands.insertContent("<space>&nbsp;</space>"),
    };
  },

  //addInputRules() {
  //  return [markInputRule({ find: / /, type: this.type })];
  //},
});
