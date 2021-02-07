import firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../models/firebase";

const uiConfig: firebaseui.auth.Config = {
  callbacks: {
    signInSuccessWithAuthResult() {
      return false;
    },
  },
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

export const LoginForm: React.FC = () => {
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />;
};
