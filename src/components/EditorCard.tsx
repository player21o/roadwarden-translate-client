import { useContext, useEffect, useState } from "react";
import useWindowDimensions from "../hooks/WindowDimensions";
import EditorWindow from "./EditorWindow";
import FileContext from "../contexts/FileContext";
import { Card } from "../protocol/packets";
import Tiptap from "./Tiptap";

interface Props {
  card_id: number;
  file: string;
  get_card: (arg0: string, arg1: number) => null | Card;
}

const EditorCard = ({ card_id, file, get_card }: Props) => {
  const { files, ids } = useContext(FileContext);
  const [card, setCard] = useState<Card | null>(null);

  const { width, height } = useWindowDimensions();

  //useEffect(() => {
  //  setCard(get_card(file, card_id));
  //});

  return (
    <EditorWindow
      width={width - 800}
      height={height - 200}
      x={width / 2}
      y={height / 2}
    >
      <div className="h-12">
        <div className="bg-blue-600 hover:bg-blue-500 text-white w-32 h-12 absolute right-0 cursor-pointer">
          <h2 className="top-2 relative">Сохранить</h2>
        </div>
        <h1 className="text-3xl font-bold text-brightpale mt-2">
          {file} <span className="text-gray-400">- карточка #69</span>
        </h1>
      </div>
      <hr className="" />
      <div className="mt-12">
        <Tiptap />
      </div>
    </EditorWindow>
  );
};

export default EditorCard;
