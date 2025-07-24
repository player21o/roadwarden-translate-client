import { useCallback, useEffect, useState } from "react";
import { clamp_number, isNumeric } from "../utils/utilities";
import { File } from "../hooks/FetchFile";

interface Props {
  file: File;
  onJump: (arg0: number) => void;
}

const EditorCardJump = ({ file, onJump }: Props) => {
  const [cardNum, setCardNum] = useState("");

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (isNumeric(event.key)) {
        setCardNum((c) =>
          clamp_number(
            Number(c + event.key),
            1,
            file.visible_cards.length
          ).toString()
        );
      } else if (event.key == "Backspace") {
        setCardNum((c) => c.slice(0, c.length - 1));
      } else if (event.key == "Enter") {
        if (cardNum != "") {
          const index = Number(cardNum) - 1;

          if (index >= 0 && index <= file.visible_cards.length - 1) {
            onJump(index);
          }
        } else {
          onJump(-1);
        }
      } else if (event.key == "ArrowUp") {
        if (Number(cardNum) > 1) setCardNum((Number(cardNum) - 1).toString());
      } else if (event.key == "ArrowDown") {
        if (Number(cardNum) < file.visible_cards.length)
          setCardNum((Number(cardNum) + 1).toString());
      } else if (event.key == "Escape") {
        onJump(-1);
      }
    },
    [cardNum, file.visible_cards.length, onJump]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey, true);

    return () => {
      window.removeEventListener("keydown", handleKey, true); // Match capture phase
    };
  }, [handleKey]); // Only re-run if handleKey changes

  return (
    <div className="backdrop-blur-sm absolute z-50 bg-black/30 w-full h-full pointer-events-auto flex flex-col justify-center  items-center leading-[normal] text-base">
      {cardNum.length > 0 ? (
        <>
          <h2>Вы перейдете к:</h2>
          <h1 className="bg-black rounded-3xl p-4">{cardNum}</h1>
        </>
      ) : (
        <h2>Введите номер карточки к которой хотите перейти.</h2>
      )}
    </div>
  );
};

export default EditorCardJump;
