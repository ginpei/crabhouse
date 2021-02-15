import { Link } from "react-router-dom";
import { User } from "../models/User";
import { userViewPagePath } from "../screens/users/UserViewPage";
import "./UserOneLine.scss";

export const UserOneLine: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="UserOneLine">
      <Link to={userViewPagePath(user.id)}>{user.name}</Link>
    </div>
  );
};
