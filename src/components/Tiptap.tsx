import { BubbleMenu, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Gender } from "../utils/gender_node";
import { convert_tags_to_html } from "../utils/schema_converter";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

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
      extensions: [StarterKit, Gender, TextStyle, Color],
      //content,
      //content:
      //  '<p><gender type="male">amle</gender>|<gender type="female">female</gender></p>',
      content: convert_tags_to_html(content),
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
