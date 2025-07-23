/*
import EditorWindow from "./EditorWindow";
import Tiptap from "./Tiptap";
import { File } from "../hooks/FetchFile";
import { Card } from "../protocol/packets";
import { Drafts } from "../utils/localstorage";
import { ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import {
  convert_html_to_tags,
  convert_tags_to_html,
} from "../utils/schema_converter";
import Spinner from "./Spinner";
import IconButton from "./IconButton";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";
import { useHotkeys } from "react-hotkeys-hook";
import { clamp_number } from "../utils/utilities";

interface Props {
  index: number;
  file: File | null;
  drafts: Drafts;
  allowed: boolean;
  saving: boolean;
  children?: ReactNode;
  history: number[];
  onChange?: (arg0: Card, arg1: string) => void;
  onCommit?: (arg0: Card, arg1: string) => void;
  onJump: () => void;
  goToCard: (ind: number) => void;
  revertToHistory: (ind: number) => void;
  onSlider: (ind: number) => void;
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
  history,
  onJump,
  goToCard,
  revertToHistory,
  onSlider,
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
    "mod+s",
    (_e) => {
      if (file != null && onCommit != undefined)
        onCommit(
          file.visible_cards[index],
          convert_html_to_tags(
            drafts[file.visible_cards[index].id],
            file.visible_cards[index].original.search("(disabled)") == -1
          )
        );
    },
    { enableOnContentEditable: true, preventDefault: true }
  );

  useHotkeys("mod+o", onJump, {
    enableOnContentEditable: true,
    preventDefault: true,
  });

  const slider = useRef(null);

  function dragElement(elmnt: HTMLElement) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e: MouseEvent) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      const top = clamp_number(elmnt.offsetTop - pos2, 0, window_height - 14);
      elmnt.style.top = top + "px";

      const card_index = Math.round(
        file!.visible_cards.length * (top / (window_height - 14))
      );

      onSlider(card_index);
      //elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  useEffect(() => {
    if (slider.current != null)
      dragElement(slider.current as any as HTMLElement);

    return () => {
      if (slider.current != null)
        (slider.current as any).onmousedown = undefined;
    };
  }, [slider.current, file]);

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
                      file.visible_cards[index],
                      convert_html_to_tags(
                        drafts[file.visible_cards[index].id],
                        file.visible_cards[index].original.search(
                          "(disabled)"
                        ) == -1
                      )
                    );
                }}
                disabled={!(file.visible_cards[index].id in drafts) || saving}
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
              className="text-4xl!"
              tooltip="Искать в файле... (Ctrl + F)"
              placement="bottom"
              onClick={onJump}
            >
              search
            </IconButton>
            <IconButton
              className="text-4xl!"
              tooltip="Вставить переменную (Ctrl + V)"
              placement="bottom"
              onClick={onJump}
            >
              segment
            </IconButton>
          </div>
          <div className="">
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 160}
              content={convert_tags_to_html(file.cards[index].original)}
              className="float-left ml-4"
              editable={false}
              colors={[]}
              disabled={file.cards[index].original.search("(disabled)") != -1}
            />
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 160}
              content={translation}
              className="float-right mr-4"
              onUpdate={(content) => {
                if (onChange != undefined)
                  onChange(file.visible_cards[index], content);
              }}
              colors={
                [
                  ...new Set(file.cards[index].original.match(/#....../g)),
                ] as string[]
              }
              disabled={file.cards[index].original.search("(disabled)") != -1}
              editable
            />
          </div>
          <div
            className="text-xl flex justify-center items-center"
            style={{ height: "7%" }}
          >
            <div className="relative flex">
              {history.length > 0 && history.indexOf(index) != 0 && (
                <p
                  className="w-max mr-2 cursor-pointer absolute right-full top-1/2 -translate-y-1/2 pr-2 whitespace-nowrap"
                  onClick={() =>
                    revertToHistory(
                      history.indexOf(index) == -1
                        ? history.length - 1
                        : history.indexOf(index) - 1
                    )
                  }
                >
                  {`<<назад к к. ${
                    history.indexOf(index) == -1
                      ? history[history.length - 1] + 1
                      : history[history.indexOf(index) - 1] + 1
                  }`}
                </p>
              )}
              <IconButton
                className="text-4xl! m-0!"
                tooltip="Предыдущая карточка (Ctrl + ↑)"
                placement="bottom"
                btnClassName="m-0!"
                onClick={() => goToCard(-1)}
              >
                move_up
              </IconButton>
              <IconButton
                className="text-4xl! m-0!"
                tooltip="Перейти к карточке... (Ctrl + O)"
                placement="bottom"
                btnClassName="m-0!"
                onClick={(e) => {
                  (e.target as any).blur();
                  (e.currentTarget as any).blur();
                  onJump();
                }}
              >
                swap_horiz
              </IconButton>
              <IconButton
                className="text-4xl! m-0!"
                tooltip="Следующая карточка (Ctrl + ↓)"
                placement="bottom"
                btnClassName="m-0!"
                onClick={() => goToCard(1)}
              >
                move_down
              </IconButton>
              {history.indexOf(index) != -1 &&
                history.indexOf(index) < history.length - 1 && (
                  <p
                    className="w-max ml-2 absolute left-full top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => revertToHistory(history.indexOf(index) + 1)}
                  >
                    {`вперед к к. ${history[history.indexOf(index) + 1] + 1}>>`}
                  </p>
                )}
            </div>
          </div>
          <div
            style={{ height: "calc(100% - 10px)", width: "10px" }}
            className="absolute right-0"
          >
            <div
              key={"slider"}
              style={{
                width: "10px",
                height: "10px",
                top: (window_height - 14) * (index / file.visible_cards.length),
              }}
              className="bg-chestnut hover:bg-brightpale absolute z-50"
              ref={slider}
            />
            {Object.keys(drafts).map((idString) => {
              const cardId = parseInt(idString);

              if (!file!.card_ids[cardId]) {
                return null;
              }

              const visibleIndex = file.visible_cards.findIndex(
                (c) => c.id === cardId
              );

              if (visibleIndex === -1) {
                return null;
              }

              return (
                <div
                  key={cardId}
                  onClick={() => onSlider(visibleIndex)}
                  style={{
                    width: "10px",
                    height: "5px",
                    cursor: "pointer",
                    top:
                      (window_height - 14) *
                      (visibleIndex / file.visible_cards.length),
                  }}
                  className="bg-red-500 absolute z-40"
                />
              );
            })}
          </div>
        </>
      )}
    </EditorWindow>
  );
};

export default EditorCard;
*/

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { File } from "../hooks/FetchFile";
import EditorWindow from "./EditorWindow";
import EditorWindowSizeContext from "../contexts/EditorWindowSize";
import EditorCardJump from "./EditorCardJump";
import UserContext from "../contexts/UserContext";
import { UserPermission } from "../protocol/packets";
import {
  convert_html_to_tags,
  convert_tags_to_html,
} from "../utils/schema_converter";
import Spinner from "./Spinner";
import IconButton from "./IconButton";
import Tiptap from "./Tiptap";
import { clamp_number } from "../utils/utilities";
import { Drafts } from "../utils/localstorage";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  cardIndex: number;
  file: File | null;
  drafts: Drafts;
  pastCards: number[];
  setCardIndexNormal: (index: number, file: File | null) => void;
  setDraft: (id: number, draft: string) => void;
  onCommit: (id: number, content: string, cb: () => any) => void;
  //setPastCards: number[];
}

const EditorCard = ({
  drafts,
  cardIndex,
  file,
  pastCards,
  onCommit,
  setDraft,
  setCardIndexNormal,
}: Props) => {
  const { window_width, window_height, screen_width, screen_height } =
    useContext(EditorWindowSizeContext);

  const { user } = useContext(UserContext);
  const me = user.data;

  const [saving, setSaving] = useState(false);
  const [jump, setJump] = useState(false);
  const card = file != null ? file.visible_cards[cardIndex] : undefined;

  const allowed =
    me != null && file != null
      ? me.permissions.filter(
          (val) => val[0] == UserPermission.file && val[1] == file.name
        ).length > 0 ||
        me.permissions.filter(
          (val) => val[0] == UserPermission.file && val[1] == "all"
        ).length > 0
      : false;

  const translation = useMemo<string | undefined>(() => {
    if (file != null && card != undefined) {
      return card.id.toString() in drafts
        ? drafts[card.id]
        : convert_tags_to_html(card.translation);
    }
  }, [cardIndex, file]);

  const slider = useRef(null);

  const setCardIndex = (ind: number) => {
    if (file == null) return;

    const i =
      ind < 0
        ? 0
        : ind > file.visible_cards.length - 1
        ? file.visible_cards.length - 1
        : ind;

    setCardIndexNormal(i, file);
  };

  function dragElement(elmnt: HTMLElement) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e: MouseEvent) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      const top = clamp_number(elmnt.offsetTop - pos2, 0, window_height - 14);
      elmnt.style.top = top + "px";

      const card_index = Math.round(
        file!.visible_cards.length * (top / (window_height - 14))
      );

      setCardIndex(card_index);
      //elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  useEffect(() => {
    if (slider.current != null)
      dragElement(slider.current as any as HTMLElement);

    return () => {
      if (slider.current != null)
        (slider.current as any).onmousedown = undefined;
    };
  }, [slider.current, file]);

  useHotkeys(
    "mod+arrowdown",
    () => setCardIndex(cardIndex + 1),

    {
      enableOnContentEditable: true,
    }
  );

  useHotkeys("mod+arrowup", () => setCardIndex(cardIndex - 1), {
    enableOnContentEditable: true,
  });

  useHotkeys("mod+o", () => setJump(jump ? false : true), {
    preventDefault: true,
  });

  useHotkeys(
    "mod+s",
    () => {
      if (card == undefined) return;

      setSaving(true);
      onCommit(
        card.id,
        convert_html_to_tags(
          drafts[card.id],
          card.original.search("(disabled)") == -1
        ),
        () => setSaving(false)
      );
    },
    {
      enableOnContentEditable: true,
      preventDefault: true,
    }
  );

  return (
    <EditorWindow
      width={window_width}
      height={window_height}
      x={screen_width / 2}
      y={screen_height / 2}
    >
      {jump && file && (
        <EditorCardJump
          onJump={(ind) => {
            setJump(false);
            if (ind != -1) {
              setCardIndex(ind);
            }
          }}
          file={file}
        />
      )}
      {file && card && (
        <>
          <div className="h-14">
            {allowed && (
              <button
                onClick={() => {
                  setSaving(true);
                  onCommit(
                    card.id,
                    convert_html_to_tags(
                      drafts[card.id],
                      card.original.search("(disabled)") != -1
                    ),
                    () => setSaving(false)
                  );
                }}
                disabled={!(card.id in drafts) || saving}
                className="bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600 w-32 h-14 absolute right-0 enabled:cursor-pointer"
              >
                {saving ? <Spinner /> : <h2 className="relative">Сохранить</h2>}
              </button>
            )}
            <h1 className="text-3xl font-bold text-brightpale mt-2">
              {file.name}{" "}
              <span className="text-gray-400">- карточка #{cardIndex + 1}</span>
            </h1>
          </div>
          <hr className="border-chestnut" />
          <div>
            <IconButton
              className="text-4xl!"
              tooltip="Искать в файле... (Ctrl + F)"
              placement="bottom"
              onClick={() => setJump(true)}
            >
              search
            </IconButton>
            <IconButton
              className="text-4xl!"
              tooltip="Вставить переменную (Ctrl + V)"
              placement="bottom"
              onClick={() => setJump(true)}
            >
              segment
            </IconButton>
          </div>
          <div className="">
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 160}
              content={convert_tags_to_html(card.original)}
              className="float-left ml-4"
              editable={false}
              colors={[]}
              disabled={card.original.search("(disabled)") != -1}
            />
            <Tiptap
              width={window_width / 2 - 16 - 10}
              height={window_height - 160}
              content={translation!}
              className="float-right mr-4"
              onUpdate={(content) => setDraft(card.id, content)}
              colors={[...new Set(card.original.match(/#....../g))] as string[]}
              disabled={card.original.search("(disabled)") != -1}
              onCreate={(e) => e.commands.focus(999, {})}
              editable
            />
          </div>
          <div
            className="text-xl flex justify-center items-center"
            style={{ height: "7%" }}
          >
            <div className="relative flex">
              {pastCards.length > 0 && pastCards.indexOf(cardIndex) != 0 && (
                <p
                  className="w-max mr-2 cursor-pointer absolute right-full top-1/2 -translate-y-1/2 pr-2 whitespace-nowrap"
                  onClick={() =>
                    setCardIndex(
                      pastCards.indexOf(cardIndex) == -1
                        ? pastCards.length - 1
                        : pastCards.indexOf(cardIndex) - 1
                    )
                  }
                >
                  {`<<назад к к. ${
                    pastCards.indexOf(cardIndex) == -1
                      ? pastCards[pastCards.length - 1] + 1
                      : pastCards[pastCards.indexOf(cardIndex) - 1] + 1
                  }`}
                </p>
              )}
              <IconButton
                className="text-4xl! m-0!"
                tooltip="Предыдущая карточка (Ctrl + ↑)"
                placement="bottom"
                btnClassName="m-0!"
                onClick={() => setCardIndex(cardIndex - 1)}
              >
                move_up
              </IconButton>
              <IconButton
                className="text-4xl! m-0!"
                tooltip="Перейти к карточке... (Ctrl + O)"
                placement="bottom"
                btnClassName="m-0!"
                onClick={(e) => {
                  (e.target as any).blur();
                  (e.currentTarget as any).blur();
                  setJump(true);
                }}
              >
                swap_horiz
              </IconButton>
              <IconButton
                className="text-4xl! m-0!"
                tooltip="Следующая карточка (Ctrl + ↓)"
                placement="bottom"
                btnClassName="m-0!"
                onClick={() => setCardIndex(cardIndex + 1)}
              >
                move_down
              </IconButton>
              {pastCards.indexOf(cardIndex) != -1 &&
                pastCards.indexOf(cardIndex) < pastCards.length - 1 && (
                  <p
                    className="w-max ml-2 absolute left-full top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setCardIndex(pastCards.indexOf(cardIndex) + 1)
                    }
                  >
                    {`вперед к к. ${
                      pastCards[pastCards.indexOf(cardIndex) + 1] + 1
                    }>>`}
                  </p>
                )}
            </div>
          </div>
          <div
            style={{ height: "calc(100% - 10px)", width: "10px" }}
            className="absolute right-0"
          >
            <div
              key={"slider"}
              style={{
                width: "10px",
                height: "10px",
                top:
                  (window_height - 14) *
                  (cardIndex / file.visible_cards.length),
              }}
              className="bg-chestnut hover:bg-brightpale absolute z-50"
              ref={slider}
            />
            {Object.keys(drafts).map((idString) => {
              const cardId = parseInt(idString);

              if (!file!.card_ids[cardId]) {
                return null;
              }

              const visibleIndex = file.visible_cards.findIndex(
                (c) => c.id === cardId
              );

              if (visibleIndex === -1) {
                return null;
              }

              return (
                <div
                  key={cardId}
                  onClick={() => setCardIndex(visibleIndex)}
                  style={{
                    width: "10px",
                    height: "5px",
                    cursor: "pointer",
                    top:
                      (window_height - 14) *
                      (visibleIndex / file.visible_cards.length),
                  }}
                  className="bg-red-500 absolute z-40"
                />
              );
            })}
          </div>
        </>
      )}
    </EditorWindow>
  );
};

export default EditorCard;
