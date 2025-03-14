import useWindowDimensions from "../hooks/WindowDimensions";
import EditorWindow from "./EditorWindow";
import Tiptap from "./Tiptap";
import { File } from "../contexts/FetchFile";
import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState } from "react";
import { Card } from "../protocol/packets";

interface Props {
  start_index: number;
  file: File | null;
}

const EditorCard = ({ start_index, file }: Props) => {
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(start_index);
  const [card, setCard] = useState<Card | null>(null);

  const [window_width, window_height] = [width - 800, height - 200];

  useHotkeys("ctrl+arrowdown", () => go_to_card(1, true));
  useHotkeys("ctrl+arrowup", () => go_to_card(-1, true));

  useEffect(() => {
    if (file != undefined) setCard(file!.visible_cards[index]);
  }, [file]);

  const go_to_card = (ind: number, relative?: boolean) => {
    if (file != null) {
      const new_ind =
        relative != undefined && relative == true ? index + ind : ind;

      if (new_ind >= 0 && new_ind <= file.visible_cards.length - 1) {
        setIndex(new_ind);
        setCard(file.visible_cards[index]);
      }
    }
  };

  return (
    <EditorWindow
      width={window_width}
      height={window_height}
      x={width / 2}
      y={height / 2}
    >
      {file && card && (
        <>
          <div className="h-14">
            <div className="bg-blue-600 hover:bg-blue-500 text-white w-32 h-14 absolute right-0 cursor-pointer">
              <h2 className="top-3 relative">Сохранить</h2>
            </div>
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
              content={card.original}
              className="float-left ml-4"
              editable={false}
            />
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 130}
              content={card.translation}
              className="float-right mr-4"
              editable
            />
          </div>
        </>
      )}
    </EditorWindow>
  );
};

export default EditorCard;
