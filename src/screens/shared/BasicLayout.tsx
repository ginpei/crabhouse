import { HTMLProps } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { jcn } from "../../misc/misc";
import "./BasicLayout.scss";

export const BasicLayout: React.FC<
  HTMLProps<HTMLDivElement> & { className: string; title: string }
> = ({ className, children, title, ...props }) => {
  return (
    <div {...props} className={jcn(className, "BasicLayout")}>
      <Helmet>
        <title>{title} - Crabhouse</title>
      </Helmet>
      <header className="BasicLayout-header">
        <div className="ui-container">
          <Link to="/">🦀 Crabhouse</Link>
        </div>
      </header>
      <div className="ui-container">{children}</div>
    </div>
  );
};
