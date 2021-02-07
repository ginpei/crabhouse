import { LoginForm } from "../../shared/LoginForm";
import { BasicLayout } from "../shared/BasicLayout";

export const LoginPage: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <BasicLayout className="LoginPage" title={title || "Login"}>
      <h1>Login</h1>
      <LoginForm />
    </BasicLayout>
  );
};
