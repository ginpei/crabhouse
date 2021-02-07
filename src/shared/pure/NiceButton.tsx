import { DetailedHTMLProps } from "react";
import "./NiceButton.scss";

export const NiceButton: React.FC<
  DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  const wholeClassName = `NiceButton ${className}`;

  return (
    <button className={wholeClassName} {...props}>
      {children}
    </button>
  );
};
