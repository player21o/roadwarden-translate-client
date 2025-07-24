import { MouseEventHandler, ReactNode, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useTransitionStyles,
} from "@floating-ui/react";

interface Props {
  children: string;
  tooltip?: ReactNode;
  className?: string;
  btnClassName?: string;
  placement?: "top" | "bottom" | "left" | "right";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton = ({
  children,
  placement = "bottom",
  className,
  btnClassName,
  tooltip,
  onClick,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <button
        onClick={onClick}
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`${
          btnClassName == undefined ? "" : btnClassName
        } align-bottom m-auto text-darkpale hover:text-brightpale cursor-pointer`}
      >
        <span
          className={`${
            className == undefined ? "" : className
          } material-icons align-bottom`}
        >
          {children}
        </span>
      </button>
      <FloatingPortal>
        {isOpen && isMounted && tooltip && (
          <div
            className="Tooltip bg-black p-1 rounded transition-opacity ease-in duration-700 z-50"
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...styles }}
            {...getFloatingProps()}
          >
            {tooltip}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default IconButton;
