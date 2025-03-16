import { BubbleMenu, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { GenderNode } from "../utils/gender_node";

interface Props {
  editable: boolean;
  content: string;
  className: string;
  width: number;
  height: number;
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

const Tiptap = ({ editable, content, className, width, height }: Props) => {
  const editor = useEditor(
    {
      extensions: [StarterKit, GenderNode],
      //content,
      content: '<gender male="male" female="female">asdasd</gender>',
      editable,
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
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        //key={"editor"}
        editor={editor}
        //contentEditable
        style={{ width, height }}
        className={
          "text-left font-philosopher text-pale text-2xl relative leading-none border-chestnut border-2 rounded overflow-x-auto p-2 " +
          className
        }
      />
    </div>
  );
};

export default Tiptap;
