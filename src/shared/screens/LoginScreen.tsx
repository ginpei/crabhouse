import { LoginForm } from "../LoginForm";
import { BasicLayout } from "../../screens/shared/BasicLayout";

export const LoginScreen: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <BasicLayout className="LoginScreen" title={title || "Login"}>
      <h1>Login</h1>
      <LoginForm />
    </BasicLayout>
  );
};
