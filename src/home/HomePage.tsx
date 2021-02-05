import { Dispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { auth } from "../models/firebase";
import { appSlice, AppState } from "../stores/appStore";
import "./HomePage.scss";

const mapState = (state: AppState) => ({
  message: state.xMessage,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setMessage: (message: string) =>
    dispatch(appSlice.actions.setMessage({ message })),
});

const HomePageBase: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({ message, setMessage }) => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUserId(user?.uid ?? "");
    });
  }, []);

  const onMessageClick = () => {
    const newMessage = window.prompt("Message?", message);
    if (newMessage) {
      setMessage(newMessage);
    }
  };

  return (
    <div className="HomePage">
      <div className="ui-container">
        <h1 className="HomePage-heading">Clubroom</h1>
        {userId ? (
          <p>
            <button onClick={() => auth.signOut()}>Log out</button> User ID:{" "}
            {userId}
          </p>
        ) : (
          <p>
            <button
              onClick={() =>
                auth.signInWithEmailAndPassword("test@example.com", "123456")
              }
            >
              Log in
            </button>
          </p>
        )}
        <p>
          Message:{" "}
          <span
            onClick={onMessageClick}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            {message}
          </span>
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa ipsum
          quidem dolorem ut architecto voluptatem placeat quam, aut eum iure
          ullam qui exercitationem doloribus nisi, officiis, eos accusantium
          expedita explicabo?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
          ea ad? Fugiat, accusamus ipsam? Eaque fugiat aliquid et dolorem ea,
          excepturi vel iusto blanditiis unde quasi. Maxime rerum libero soluta.
        </p>
      </div>
    </div>
  );
};

export const HomePage = connect(mapState, mapDispatch)(HomePageBase);
