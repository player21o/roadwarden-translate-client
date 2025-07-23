import { BubbleMenu, useEditor, EditorContent, Editor } from "@tiptap/react";
import { Gender } from "../nodes/gender_mark";
import { Color } from "../nodes/color_mark";
import { Space } from "../nodes/space_mark";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { VariableNode } from "../nodes/variable_node";
import { ReactNode } from "react";

interface Props {
  editable: boolean;
  content: string;
  className: string;
  width: number;
  height: number;
  colors: string[] | null;
  disabled: boolean;
  onCreate?: (e: Editor) => void;
  onUpdate?: (arg0: string) => void;
}

const BubbleMenuButton = ({
  icon,
  children,
  active,
  onClick,
}: {
  icon?: string;
  children?: ReactNode;
  active?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`z-50 focus:bg-gray-800 ${
        active
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-gray-950 hover:bg-gray-900"
      } active w-10 h-10 hover:cursor-pointer  text-center select-none`}
    >
      {icon && (
        <p className="material-icons align-middle focus:translate-y-1">
          {icon}
        </p>
      )}
      {children}
    </button>
  );
};

const Tiptap = ({
  editable,
  content,
  className,
  width,
  height,
  colors,
  disabled,
  onCreate,
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
      //content: "<p><var>you stupid nigger</var> ssaasd </p>",
      content: content,
      //content: "<p><space>&nbsp;</space></p>",
      editable,
      onUpdate: ({ editor }) => {
        {
          //console.log(editor.getHTML());
          onUpdate?.(editor.getHTML());
        }
      },
      onCreate: onCreate ? (p) => onCreate(p.editor) : undefined,
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
              active={editor.isActive("italic")}
            />
            <BubbleMenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              icon="format_bold"
              active={editor.isActive("bold")}
            />
            <BubbleMenuButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setMark("gender", { type: "male" })
                  .insertContentAt(
                    editor.state.selection.$to.pos,
                    '|<gender type="female">Женщина</gender>'
                  )
                  .run()
              }
              icon="transgender"
            />
            {colors &&
              !disabled &&
              colors.map((color) => (
                <BubbleMenuButton
                  key={color}
                  onClick={() => {
                    console.log(color);
                    editor.chain().focus().toggleMark("color", { color }).run();
                  }}
                  active={editor.isActive("color", { color: color })}
                >
                  <div
                    className={`bg-[${color}] rounded-full w-1/2 h-1/2 mx-auto`}
                    style={{ background: color }}
                  ></div>
                </BubbleMenuButton>
              ))}
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        //key={"editor"}
        editor={editor}
        //contentEditable
        style={{ width, height }}
        className={
          `text-left font-philosopher ${
            !disabled ? "text-pale" : "text-disabled"
          } text-2xl relative leading-7 border-chestnut border-2 overflow-x-auto p-2 ` +
          className
        }
      />
    </div>
  );
};

export default Tiptap;
