import { HTMLProps } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { jcn } from "../../misc/misc";
import { AppState } from "../../stores/appStore";
import { myPagePath } from "../my/MyPage";
import { BasicHeaderFrame } from "./BasicHeaderFrame";
import "./BasicLayout.scss";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const BasicLayoutBase: React.FC<
  HTMLProps<HTMLDivElement> &
    ReturnType<typeof mapState> & { className: string; title: string }
> = ({ className, children, currentUserId, title, ...props }) => {
  const logoLinkUrl = currentUserId ? myPagePath() : "/";

  return (
    <div {...props} className={jcn(className, "BasicLayout")}>
      <Helmet>
        <title>{title} - Crabhouse</title>
      </Helmet>
      <BasicHeaderFrame>
        <div className="ui-container">
          <Link to={logoLinkUrl}>🦀 Crabhouse</Link>
        </div>
      </BasicHeaderFrame>
      <div className="ui-container">{children}</div>
    </div>
  );
};

export const BasicLayout = connect(mapState)(BasicLayoutBase);
