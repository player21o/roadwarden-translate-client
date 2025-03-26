import { mergeAttributes, Mark } from "@tiptap/react";

export interface GenderNodeAttributes {
  type: "male" | "female";
}

export const Gender = Mark.create<GenderNodeAttributes>({
  name: "gender",
  //marks: "_",

  addAttributes() {
    return {
      type: { default: "male" },
    };
  },

  parseHTML() {
    return [{ tag: "gender" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "gender",
      mergeAttributes(
        {
          class: `bg-opacity-45 ${
            HTMLAttributes.type == "male" ? "bg-blue-500" : "bg-pink-500"
          }`,
        },
        HTMLAttributes
      ),
      0,
    ];
  },

  addCommand() {
    return {
      appendGender: () => () => {
        return this.editor.commands.insertContent(
          '<gender type="male">Мужчина</gender>|<gender type="female">Женщина</gender>'
        );
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Shift-|": () =>
        this.editor.commands.insertContent(
          '<gender type="male">Мужчина</gender>|<gender type="female">Женщина</gender>'
        ),
    };
  },
});
