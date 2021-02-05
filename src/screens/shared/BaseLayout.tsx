import { HTMLProps } from "react";

export const BaseLayout: React.FC<
  HTMLProps<HTMLDivElement> & { className: string }
> = ({ className, children, ...props }) => {
  const rootClassName = `${className} BaseLayout ui-container`;
  return (
    <div {...props} className={rootClassName}>
      {children}
    </div>
  );
};
