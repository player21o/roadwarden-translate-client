import { useEditor, EditorContent, Editor } from "@tiptap/react";
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
import { isNumeric } from "../utils/utilities";
import { BubbleMenu } from "@tiptap/react/menus";

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
        <p className="material-icons align-middle focus:translate-y-1 text-white">
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

  const toggleItalic = () => editor!.chain().focus().toggleItalic().run();
  const toggleBold = () => editor!.chain().focus().toggleBold().run();
  const toggleGender = () =>
    editor!
      .chain()
      .focus()
      .setMark("gender", { type: "male" })
      .insertContentAt(
        editor!.state.selection.$to.pos,
        '|<gender type="female">Женщина</gender>'
      )
      .run();
  const toggleColor = (color: string) => () =>
    editor!.chain().focus().toggleMark("color", { color }).run();

  const bubbleMenuKeys: (() => void)[] = [
    toggleItalic,
    toggleBold,
    toggleGender,
    ...(colors != undefined ? colors.map((col) => toggleColor(col)) : []),
  ];

  return (
    <div>
      {editor && (
        <BubbleMenu editor={editor}>
          <div className="flex flex-row first:rounded-l-2xl last:rounded-r-2xl">
            <BubbleMenuButton
              onClick={toggleItalic}
              icon="format_italic"
              active={editor.isActive("italic")}
            />
            <BubbleMenuButton
              onClick={toggleBold}
              icon="format_bold"
              active={editor.isActive("bold")}
            />
            <BubbleMenuButton onClick={toggleGender} icon="transgender" />
            {colors &&
              !disabled &&
              colors.map((color) => (
                <BubbleMenuButton
                  key={color}
                  onClick={toggleColor(color)}
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
        onKeyDown={(e) => {
          if (!editor?.state.selection.empty) {
            if (
              isNumeric(e.key) &&
              parseInt(e.key) - 1 <= bubbleMenuKeys.length - 1
            ) {
              e.preventDefault();
              bubbleMenuKeys[parseInt(e.key) - 1]();
            }
          }
        }}
      />
    </div>
  );
};

export default Tiptap;
