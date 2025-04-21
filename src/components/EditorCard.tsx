import useWindowDimensions from "../hooks/WindowDimensions";
import EditorWindow from "./EditorWindow";
import Tiptap from "./Tiptap";
import { File } from "../hooks/FetchFile";
import { Card } from "../protocol/packets";
import { Drafts } from "../utils/localstorage";
import { useMemo } from "react";
import {
  convert_html_to_tags,
  convert_tags_to_html,
} from "../utils/schema_converter";
import Spinner from "./Spinner";
import { clamp_number } from "../utils/utilities";
import Tippy from "@tippyjs/react";

interface Props {
  index: number;
  file: File | null;
  drafts: Drafts;
  allowed: boolean;
  saving: boolean;
  onChange?: (arg0: Card, arg1: string) => void;
  onCommit?: (arg0: Card, arg1: string) => void;
}

const EditorCard = ({
  index,
  file,
  onChange,
  onCommit,
  drafts,
  allowed,
  saving,
}: Props) => {
  const { width, height } = useWindowDimensions();

  const [window_width, window_height] = [
    clamp_number(width - 600, 600, 1000),
    height - 200,
  ];

  const translation = useMemo<string | undefined>(() => {
    if (file != null) {
      return file.cards[index].id.toString() in drafts
        ? drafts[file.cards[index].id]
        : convert_tags_to_html(file.cards[index].translation);
    }
  }, [index, file]);

  return (
    <EditorWindow
      width={window_width}
      height={window_height}
      x={width / 2}
      y={height / 2}
    >
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
            <Tippy
              content={"Перейти к карточке..."}
              placement="bottom"
              className="bg-black"
            >
              <button className="align-bottom m-auto text-darkpale hover:text-brightpale">
                <span className="!text-5xl material-icons align-bottom">
                  swap_horiz
                </span>
              </button>
            </Tippy>
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
              colors={file.cards[index].original.match(/#....../g) as string[]}
              editable
            />
          </div>
        </>
      )}
    </EditorWindow>
  );
};

export default EditorCard;
