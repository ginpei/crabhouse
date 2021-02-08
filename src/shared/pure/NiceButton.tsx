import { DetailedHTMLProps } from "react";
import { jcn } from "../../misc/misc";
import "./NiceButton.scss";

export const NiceButton: React.FC<
  DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  return (
    <button className={jcn(className, "NiceButton")} {...props}>
      {children}
    </button>
  );
};
