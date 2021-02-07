import { LoginForm } from "../../shared/LoginForm";
import { BaseLayout } from "../shared/BaseLayout";

export const LoginPage: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <BaseLayout className="LoginPage" title={title || "Login"}>
      <h1>Login</h1>
      <LoginForm />
    </BaseLayout>
  );
};
