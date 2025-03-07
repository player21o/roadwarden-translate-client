import { useContext, useEffect, useState } from "react";
import useWindowDimensions from "../hooks/WindowDimensions";
import EditorWindow from "./EditorWindow";
import FileContext from "../contexts/FileContext";
import { Card } from "../protocol/packets";
import Tiptap from "./Tiptap";

interface Props {
  index: number;
  file: string;
  fetch_file: (arg0: string) => void;
}

const EditorCard = ({ index, file, fetch_file }: Props) => {
  const { files, ids } = useContext(FileContext);
  const [card, setCard] = useState<Card | null>(null);
  const [card_index, setCardIndex] = useState(index);

  const { width, height } = useWindowDimensions();

  const [window_width, window_height] = [width - 800, height - 200];

  const load_card = (c_index: number) => {
    if (c_index + 1 <= files[file].length && c_index >= 0) {
      setCard(files[file][c_index]);
    }
  };

  const go_to_card = (c_index: number, relative?: boolean) => {
    const ind =
      relative != undefined && relative == true
        ? card_index + c_index
        : c_index;

    if (ind >= 0 && ind < files[file].length - 1) {
      setCardIndex(ind);
      load_card(ind);
    }
  };

  useEffect(() => {
    console.log(files);
    fetch_file(file);
    go_to_card(index);
  }, []);

  return (
    <EditorWindow
      width={window_width}
      height={window_height}
      x={width / 2}
      y={height / 2}
    >
      {card && (
        <>
          <div className="h-14">
            <div className="bg-blue-600 hover:bg-blue-500 text-white w-32 h-14 absolute right-0 cursor-pointer">
              <h2 className="top-3 relative">Сохранить</h2>
            </div>
            <h1 className="text-3xl font-bold text-brightpale mt-2">
              {file} <span className="text-gray-400">- карточка #69</span>
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
