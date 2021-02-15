import { BasicHeaderFrame } from "../screens/shared/BasicHeaderFrame";
import "./LoadingScreen.scss";

export const LoadingScreen: React.FC = () => {
  return (
    <BasicHeaderFrame>
      <div className="LoadingScreen-bar"></div>
    </BasicHeaderFrame>
  );
};
