import { BaseLayout } from "../../shared/screens/BaseLayout";

export function myProfileEditPagePath(): string {
  return "/my-profile/edit";
}

export const MyProfileEditPage: React.FC = () => {
  return (
    <BaseLayout className="MyProfileEditPage">
      <h1>MyProfileEditPage</h1>
    </BaseLayout>
  );
};
