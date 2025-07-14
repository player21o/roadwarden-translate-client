import Tippy from "@tippyjs/react";
import { MouseEventHandler, ReactNode } from "react";
import { Placement } from "tippy.js";

interface Props {
  children: string;
  tooltip?: string | ReactNode;
  className?: string;
  btnClassName?: string;
  placement?: Placement;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton = ({
  children,
  tooltip,
  className,
  btnClassName,
  placement,
  onClick,
}: Props) => {
  return tooltip ? (
    <Tippy
      content={tooltip}
      placement={placement}
      className="bg-black p-1 rounded"
    >
      <button
        tabIndex={-1}
        className={`${
          btnClassName == undefined ? "" : btnClassName
        } align-bottom m-auto text-darkpale hover:text-brightpale`}
        //onClick={onClick}
        onClick={onClick}
      >
        <span
          className={`${
            className == undefined ? "" : className
          } material-icons align-bottom`}
        >
          {children}
        </span>
      </button>
    </Tippy>
  ) : (
    <button
      tabIndex={-1}
      className={`${
        btnClassName == undefined ? "" : btnClassName
      } align-bottom m-auto text-darkpale hover:text-brightpale`}
      onClick={onClick}
    >
      <span
        className={`!${
          className == undefined ? "" : className
        } material-icons align-bottom`}
      >
        {children}
      </span>
    </button>
  );
};

export default IconButton;
