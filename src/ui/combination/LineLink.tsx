import { Link } from "react-router-dom";
import { jcn } from "../../misc/misc";
import { LineItem } from "./LineItem";
import "./LineLink.scss";

export const LineLink: React.FC<Parameters<Link>[0]> = ({
  className,
  ...props
}) => {
  return (
    <LineItem>
      <Link className={jcn("LineLink", className)} {...props} />
    </LineItem>
  );
};
