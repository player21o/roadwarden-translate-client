import { BubbleMenu, useEditor, EditorContent } from "@tiptap/react";
import { Gender } from "../nodes/gender_mark";
import { Color } from "../nodes/color_mark";
import { Space } from "../nodes/space_mark";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { VariableNode } from "../nodes/variable_node";
//import Color from "@tiptap/extension-color";

interface Props {
  editable: boolean;
  content: string;
  className: string;
  width: number;
  height: number;
  onUpdate?: (arg0: string) => void;
}

const BubbleMenuButton = ({
  icon,
  onClick,
}: {
  icon: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-950 z-50 focus:bg-gray-800 w-10 h-10 hover:cursor-pointer hover:bg-gray-900 text-center select-none"
    >
      <p className="material-icons align-middle focus:translate-y-1">{icon}</p>
    </button>
  );
};

const Tiptap = ({
  editable,
  content,
  className,
  width,
  height,
  onUpdate,
}: Props) => {
  const editor = useEditor(
    {
      extensions: [
        Document,
        Text,
        Paragraph,
        Bold,
        Italic,
        Gender,
        Color,
        Space,
        VariableNode,
      ],
      //content,
      //content:
      content: "<p><var>you stupid nigger</var> ssaasd </p>",
      //content: content,
      //content: "<p><space>&nbsp;</space></p>",
      editable,
      onUpdate: ({ editor }) => {
        if (onUpdate != undefined) onUpdate(editor.getHTML());
      },
    },
    [content]
  );

  return (
    <div>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            //appendTo: document.body,
            duration: 100,
            delay: 0,
            //interactive: true,
          }}
        >
          <div className="flex flex-row first:rounded-l-2xl last:rounded-r-2xl">
            <BubbleMenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              icon="format_italic"
            />
            <BubbleMenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              icon="format_bold"
            />
            <BubbleMenuButton
              //onClick={() => editor.chain().focus().appendGender().run()}
              onClick={() => {}}
              icon="transgender"
            />
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        //key={"editor"}
        editor={editor}
        //contentEditable
        style={{ width, height }}
        className={
          "text-left font-philosopher text-pale text-2xl relative leading-7 border-chestnut border-2 rounded overflow-x-auto p-2 " +
          className
        }
      />
    </div>
  );
};

export default Tiptap;
