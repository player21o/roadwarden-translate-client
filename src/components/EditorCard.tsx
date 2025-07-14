import EditorWindow from "./EditorWindow";
import Tiptap from "./Tiptap";
import { File } from "../hooks/FetchFile";
import { Card } from "../protocol/packets";
import { Drafts } from "../utils/localstorage";
import { ReactNode, useContext, useMemo } from "react";
import {
  convert_html_to_tags,
  convert_tags_to_html,
} from "../utils/schema_converter";
import Spinner from "./Spinner";
import IconButton from "./IconButton";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  index: number;
  file: File | null;
  drafts: Drafts;
  allowed: boolean;
  saving: boolean;
  children?: ReactNode;
  onChange?: (arg0: Card, arg1: string) => void;
  onCommit?: (arg0: Card, arg1: string) => void;
  onJump: () => void;
}

const EditorCard = ({
  index,
  file,
  onChange,
  onCommit,
  drafts,
  allowed,
  saving,
  children,
  onJump,
}: Props) => {
  const { window_width, window_height, screen_width, screen_height } =
    useContext(EditorWindowSizeContext);

  const translation = useMemo<string | undefined>(() => {
    if (file != null) {
      return file.cards[index].id.toString() in drafts
        ? drafts[file.cards[index].id]
        : convert_tags_to_html(file.cards[index].translation);
    }
  }, [index, file]);

  useHotkeys(
    "ctrl+s",
    (_e) => {
      if (file != null && onCommit != undefined)
        onCommit(
          file.cards[index],
          convert_html_to_tags(drafts[file.cards[index].id])
        );
    },
    { enableOnContentEditable: true, preventDefault: true }
  );

  return (
    <EditorWindow
      width={window_width}
      height={window_height}
      x={screen_width / 2}
      y={screen_height / 2}
    >
      {children}
      {file && translation != undefined && (
        <>
          <div className="h-14">
            {allowed && (
              <button
                onClick={() => {
                  if (onCommit != undefined)
                    onCommit(
                      file.cards[index],
                      convert_html_to_tags(drafts[file.cards[index].id])
                    );
                }}
                disabled={!(file.cards[index].id in drafts) || saving}
                className="bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600 w-32 h-14 absolute right-0 enabled:cursor-pointer"
              >
                {saving ? <Spinner /> : <h2 className="relative">Сохранить</h2>}
              </button>
            )}
            <h1 className="text-3xl font-bold text-brightpale mt-2">
              {file.name}{" "}
              <span className="text-gray-400">- карточка #{index + 1}</span>
            </h1>
          </div>
          <hr className="border-chestnut" />
          <div>
            <IconButton
              className="text-5xl"
              tooltip="Перейти к карточке..."
              placement="bottom"
              onClick={onJump}
            >
              swap_horiz
            </IconButton>
          </div>
          <div className="">
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 130}
              content={convert_tags_to_html(file.cards[index].original)}
              className="float-left ml-4"
              editable={false}
              colors={[]}
            />
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 130}
              content={translation}
              className="float-right mr-4"
              onUpdate={(content) => {
                if (onChange != undefined) onChange(file.cards[index], content);
              }}
              colors={
                [
                  ...new Set(file.cards[index].original.match(/#....../g)),
                ] as string[]
              }
              editable
            />
          </div>
        </>
      )}
    </EditorWindow>
  );
};

export default EditorCard;
