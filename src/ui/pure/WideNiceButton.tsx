import { jcn } from "../../misc/misc";
import { NiceButton } from "./NiceButton";
import "./WideNiceButton.scss";

export const WideNiceButton: typeof NiceButton = ({ className, ...props }) => {
  return <NiceButton {...props} className={jcn("WideNiceButton", className)} />;
};
