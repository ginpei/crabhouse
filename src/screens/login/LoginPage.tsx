import { useState } from "react";
import { auth } from "../../models/firebase";
import { BaseLayout } from "../shared/BaseLayout";

export const LoginPage: React.FC<{ title?: string }> = ({ title = "" }) => {
  const [loggingError, setLoggingError] = useState<Error | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const onLogInClick = async () => {
    setLoggingIn(true);
    setLoggingError(null);
    try {
      await auth.signInWithEmailAndPassword("test@example.com", "123456");
    } catch (error) {
      setLoggingIn(false);
      setLoggingError(error);
    }
  };

  return (
    <BaseLayout className="LoginPage" title={title || "Login"}>
      <h1>Login</h1>
      {loggingError && (
        <p style={{ color: "tomato" }}>{loggingError.message}</p>
      )}
      <p>
        <button disabled={loggingIn} onClick={onLogInClick}>
          Log in
        </button>
      </p>
    </BaseLayout>
  );
};
