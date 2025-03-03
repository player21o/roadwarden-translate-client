import {
  FloatingMenu,
  BubbleMenu,
  useEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// define your extension array
const extensions = [StarterKit];

const content = "<p>Hello World!</p>";

interface Props {
  color?: string;
}

const Tiptap = ({ color }: Props) => {
  const editor = useEditor({
    extensions: extensions,
    content: content,
    editorProps: {
      attributes: {
        class:
          "text-left font-philosopher text-2xl relative leading-none w-96 h-96 border-chestnut border-2 rounded overflow-x-auto p-2",
      },
    },
  });

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor} tippyOptions={{ appendTo: document.body }}>
        This is the bubble menu
      </BubbleMenu>
    </>
  );
};

export default Tiptap;
