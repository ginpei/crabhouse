import { HTMLProps } from "react";
import { Helmet } from "react-helmet";

export const BaseLayout: React.FC<
  HTMLProps<HTMLDivElement> & { className: string; title: string }
> = ({ className, children, title, ...props }) => {
  const rootClassName = `${className} BaseLayout ui-container`;
  return (
    <div {...props} className={rootClassName}>
      <Helmet>
        <title>{title} - Crabhouse</title>
      </Helmet>
      {children}
    </div>
  );
};
