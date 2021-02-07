import { Link } from "react-router-dom";
import { BasicLayout } from "../../screens/shared/BasicLayout";

export const NotFoundPage: React.FC<{ targetName?: string }> = ({
  targetName,
}) => {
  const title = targetName ? `${targetName} not found` : "Not found";

  return (
    <BasicLayout className="NotFoundPage" title={title}>
      <h1>{title}</h1>
      <p>🥺</p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </BasicLayout>
  );
};
