import { useEffect } from "react";
import { prot } from "../protocol/client";

interface Props {
  children: React.ReactNode;
}

const ConnectionManager = ({ children }: Props) => {
  useEffect(() => {
    prot.closing_func = () => {
      console.log("disconnected");

      setTimeout(() => prot.connect(), 1000);
    };

    prot.set_closing_function();
  });

  return children;
};

export default ConnectionManager;
