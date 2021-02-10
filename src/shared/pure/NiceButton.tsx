import { DetailedHTMLProps } from "react";
import { jcn } from "../../misc/misc";
import "./NiceButton.scss";

export type NiceButtonStyle = "normal" | "danger";

export const NiceButton: React.FC<
  DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { niceStyle?: NiceButtonStyle }
> = ({ children, className, niceStyle = "normal", ...props }) => {
  return (
    <button
      className={jcn(className, "NiceButton")}
      data-nicebutton-style={niceStyle}
      {...props}
    >
      {children}
    </button>
  );
};
