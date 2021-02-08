import { HTMLProps } from "react";
import { Helmet } from "react-helmet-async";
import { jcn } from "../../misc/misc";

export const BasicLayout: React.FC<
  HTMLProps<HTMLDivElement> & { className: string; title: string }
> = ({ className, children, title, ...props }) => {
  return (
    <div {...props} className={jcn(className, "BasicLayout ui-container")}>
      <Helmet>
        <title>{title} - Crabhouse</title>
      </Helmet>
      {children}
    </div>
  );
};
