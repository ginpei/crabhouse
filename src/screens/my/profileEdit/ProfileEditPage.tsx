import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { isAppErrorOf } from "../../../data/AppError";
import { AppState } from "../../../data/appStore";
import { useCurrentUserStore } from "../../../data/currentUser";
import { createUser, User } from "../../../data/User";
import { getUser, saveUser } from "../../../data/UserDb";
import { useErrorLog } from "../../../misc/misc";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { NiceButton } from "../../../shared/pure/NiceButton";
import { LoginScreen } from "../../../shared/screens/LoginScreen";
import { BasicLayout } from "../../shared/BasicLayout";
import { userViewPagePath } from "../../users/UserViewPage";

export function profileEditPagePath(): string {
  return "/my/editProfile/";
}

const ProfileEditPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  useCurrentUserStore();
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

    // not logged in (login page appears)
    if (currentUserId === "") {
      return;
    }

    getUser(currentUserId)
      .then((latestUser) => {
        setUser(latestUser);
      })
      .catch((error) => {
        if (isAppErrorOf(error, "document-not-found")) {
          const emptyUser = createUser({ id: currentUserId || "" });
          setUser(emptyUser);
          return;
        }
        setUserError(error);
      });
  }, [currentUserId]);

  if (currentUserId === "") {
    return <LoginScreen />;
  }

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <BasicLayout className="MyProfileEditPage" title="Edit profile">
      <p>
        <Link to={userViewPagePath(user.id)}>{user.name}</Link>
      </p>
      <h1>Edit profile</h1>
      {userError && (
        <p style={{ color: "tomato" }}>[Bug] {userError.message}</p>
      )}
      <UserForm
        disabled={saving}
        onChange={onNewUserChange}
        onSubmit={onNewUserSubmit}
        user={user}
      />
    </BasicLayout>
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

  const onValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    if (name === "name") {
      onChange({ ...user, name: value });
    } else if (name === "bio") {
      onChange({ ...user, bio: value });
    } else if (name === "twitter") {
      onChange({ ...user, twitter: value });
    } else if (name === "website") {
      onChange({ ...user, website: value });
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
        <label>
          Bio:{" "}
          <textarea
            disabled={disabled}
            name="bio"
            onChange={onValueChange}
            value={user.bio}
          />
        </label>
      </p>
      <p>
        <label>
          Twitter: @
          <input
            disabled={disabled}
            name="twitter"
            onChange={onValueChange}
            type="text"
            value={user.twitter}
          />
        </label>
      </p>
      <p>
        <label>
          Website:{" "}
          <input
            disabled={disabled}
            name="website"
            onChange={onValueChange}
            type="text"
            value={user.website}
          />
        </label>
      </p>
      <p>
        <NiceButton disabled={disabled}>OK</NiceButton>
      </p>
    </form>
  );
};

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

export const ProfileEditPage = connect(mapState)(ProfileEditPageBase);
