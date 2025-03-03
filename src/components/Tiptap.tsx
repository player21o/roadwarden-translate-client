import { BubbleMenu, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// define your extension array
const extensions = [StarterKit];

interface Props {
  editable?: boolean;
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
    <div
      onClick={onClick}
      className="bg-gray-950 focus:bg-gray-600 w-10 h-10 hover:cursor-pointer hover:bg-gray-900 text-center select-none"
    >
      <p className="material-icons mt-[25%]">{icon}</p>
    </div>
  );
};

const Tiptap = ({ editable, content, className, width, height }: Props) => {
  const editor = useEditor({
    extensions,
    content,
    editable,
  });

  return (
    <>
      <EditorContent
        key={"editor"}
        editor={editor}
        //contentEditable
        style={{ width, height }}
        className={
          "text-left font-philosopher text-2xl relative leading-none border-chestnut border-2 rounded overflow-x-auto p-2 " +
          className
        }
      />
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ appendTo: document.body, duration: 100, delay: 0 }}
        >
          <div className="rounded flex flex-row">
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
    </>
  );
};

export default Tiptap;
