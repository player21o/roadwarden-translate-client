import useWindowDimensions from "../hooks/WindowDimensions";
import EditorWindow from "./EditorWindow";
import Tiptap from "./Tiptap";
import { File } from "../hooks/FetchFile";
import { Card } from "../protocol/packets";
import { Drafts } from "../utils/localstorage";
import { useMemo } from "react";
import { convert_html_to_tags } from "../utils/schema_converter";

interface Props {
  index: number;
  file: File | null;
  drafts: Drafts;
  onChange?: (arg0: Card, arg1: string) => void;
  onCommit?: (arg0: Card, arg1: string) => void;
}

const EditorCard = ({ index, file, onChange, onCommit, drafts }: Props) => {
  const { width, height } = useWindowDimensions();
  /*
  const [index, setIndex] = useState(start_index);
  const [card, setCard] = useState<Card | null>(null);
  */

  const [window_width, window_height] = [width - 800, height - 200];

  /*
  useHotkeys("ctrl+arrowdown", () => go_to_card(1, true));
  useHotkeys("ctrl+arrowup", () => go_to_card(-1, true));

  useEffect(() => {
    if (file != undefined) setCard(file.visible_cards[index]);
  }, [file]);

  useEffect(() => {
    if (file != undefined) setCard(file.visible_cards[index]);
  }, [index]);

  const go_to_card = (ind: number, relative?: boolean) => {
    if (file != null) {
      const new_ind =
        relative != undefined && relative == true ? index + ind : ind;

      if (new_ind >= 0 && new_ind <= file.visible_cards.length - 1) {
        setIndex(new_ind);
      }
    }
  };
  */

  const translation = useMemo<string | undefined>(() => {
    if (file != null) {
      return file.cards[index].id.toString() in drafts
        ? drafts[file.cards[index].id]
        : file.cards[index].translation;
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
            <button
              onClick={() => {
                if (onCommit != undefined)
                  onCommit(
                    file.cards[index],
                    convert_html_to_tags(drafts[file.cards[index].id])
                  );
              }}
              disabled={!(file.cards[index].id in drafts)}
              className="bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600 w-32 h-14 absolute right-0 enabled:cursor-pointer"
            >
              <h2 className="relative">Сохранить</h2>
            </button>
            <h1 className="text-3xl font-bold text-brightpale mt-2">
              {file.name}{" "}
              <span className="text-gray-400">- карточка #{index + 1}</span>
            </h1>
          </div>
          <hr className="border-chestnut" />
          <div className="mt-12">
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 130}
              content={file.cards[index].original}
              className="float-left ml-4"
              editable={false}
            />
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 130}
              content={translation}
              className="float-right mr-4"
              onUpdate={(content) => {
                if (onChange != undefined) onChange(file.cards[index], content);
              }}
              editable
            />
          </div>
        </>
      )}
    </EditorWindow>
  );
};

export default EditorCard;
