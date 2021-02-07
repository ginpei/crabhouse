import { HTMLProps } from "react";
import { Helmet } from "react-helmet-async";

export const BasicLayout: React.FC<
  HTMLProps<HTMLDivElement> & { className: string; title: string }
> = ({ className, children, title, ...props }) => {
  const rootClassName = `${className} BasicLayout ui-container`;
  return (
    <div {...props} className={rootClassName}>
      <Helmet>
        <title>{title} - Crabhouse</title>
      </Helmet>
      {children}
    </div>
  );
};
