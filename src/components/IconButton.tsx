import Tippy from "@tippyjs/react";
import { ReactNode } from "react";
import { Placement } from "tippy.js";

interface Props {
  children: string;
  tooltip?: string | ReactNode;
  className?: string;
  placement?: Placement;
}

const IconButton = ({ children, tooltip, className, placement }: Props) => {
  return tooltip ? (
    <Tippy content={tooltip} placement={placement} className="bg-black">
      <button className="align-bottom m-auto text-darkpale hover:text-brightpale">
        <span
          className={`!${
            className == undefined ? "" : className
          } material-icons align-bottom`}
        >
          {children}
        </span>
      </button>
    </Tippy>
  ) : (
    <button className="align-bottom m-auto text-darkpale hover:text-brightpale">
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
