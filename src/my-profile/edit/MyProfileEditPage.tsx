import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppError } from "../../models/AppError";
import { createUser, User } from "../../models/User";
import { getUser, saveUser } from "../../models/UserDb";
import { useErrorLog } from "../../shared/misc/misc";
import { BaseLayout } from "../../shared/screens/BaseLayout";
import { AppState } from "../../stores/appStore";
import { useCurrentUserIdStore } from "../../stores/currentUser";

export function myProfileEditPagePath(): string {
  return "/my-profile/edit";
}

const MyProfileEditPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  useCurrentUserIdStore();
  const [user, setUser] = useState<User | null>(null);
  const [userError, setUserError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  useErrorLog(userError);

  const onNewUserSubmit = async (newUser: User) => {
    if (!currentUserId) {
      throw new Error("User must have logged in");
    }

    setSaving(true);
    try {
      await saveUser(newUser);
      const latestUser = await getUser(currentUserId);
      setUser(latestUser);
    } catch (error) {
      setUserError(error);
    } finally {
      setSaving(false);
    }
  };

  const onNewUserChange = (newUser: User) => {
    setUser(newUser);
  };

  useEffect(() => {
    setUser(null);
    setUserError(null);

    // loading
    if (currentUserId === null) {
      return;
    }

    // not logged in
    if (currentUserId === "") {
      setUserError(new Error("User must have logged in"));
      return;
    }

    getUser(currentUserId)
      .then((latestUser) => {
        setUser(latestUser);
      })
      .catch((error) => {
        // TODO prepare a function to check
        if (error instanceof AppError && error.code === "document-not-found") {
          const emptyUser = createUser({ id: currentUserId || "" });
          setUser(emptyUser);
          return;
        }
        setUserError(error);
      });
  }, [currentUserId]);

  if (userError) {
    return <div>Error {userError.message}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <BaseLayout className="MyProfileEditPage">
      <h1>MyProfileEditPage</h1>
      <UserForm
        disabled={saving}
        onChange={onNewUserChange}
        onSubmit={onNewUserSubmit}
        user={user}
      />
    </BaseLayout>
  );
};

const UserForm: React.FC<{
  disabled: boolean;
  onChange: (user: User) => void;
  onSubmit: (user: User) => void;
  user: User;
}> = ({ disabled, onChange, onSubmit, user }) => {
  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(user);
  };

  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === "name") {
      onChange({ ...user, name: value });
    } else {
      throw new Error(`Unknown input "${name}"`);
    }
  };

  return (
    <form className="UserForm" onSubmit={onFormSubmit}>
      <p>
        ID: <span style={{ fontFamily: "monospace" }}>{user.id}</span>
      </p>
      <p>
        <label>
          Name:{" "}
          <input
            disabled={disabled}
            name="name"
            onChange={onValueChange}
            type="text"
            value={user.name}
          />
        </label>
      </p>
      <p>
        <button disabled={disabled}>OK</button>
      </p>
    </form>
  );
};

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

export const MyProfileEditPage = connect(mapState)(MyProfileEditPageBase);
