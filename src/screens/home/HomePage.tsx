import { Dispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from "../../models/firebase";
import { createRoom, Room } from "../../models/Room";
import { getRoomCollection } from "../../models/RoomDb";
import { appSlice, AppState } from "../../stores/appStore";
import { useCurrentUserIdStore } from "../../stores/currentUser";
import { myProfileEditPagePath } from "../my-profile/edit/MyProfileEditPage";
import { roomCreatePagePath } from "../rooms/create/RoomCreatePage";
import { roomViewPagePath } from "../rooms/view/RoomViewPage";
import "./HomePage.scss";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
  message: state.xMessage,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setMessage: (message: string) =>
    dispatch(appSlice.actions.setMessage({ message })),
});

const HomePageBase: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({ currentUserId, message, setMessage }) => {
  const [userRooms, setUserRooms] = useState<Room[] | null>(null);
  useCurrentUserIdStore();

  const onMessageClick = () => {
    const newMessage = window.prompt("Message?", message);
    if (newMessage) {
      setMessage(newMessage);
    }
  };

  // TODO remove these temporary room list
  useEffect(() => {
    setUserRooms(null);

    if (!currentUserId) {
      return;
    }

    const coll = getRoomCollection().where("userId", "==", currentUserId);
    coll.get().then((ssRooms) => {
      const newRooms = ssRooms.docs.map((v) =>
        createRoom({ ...v.data(), id: v.id })
      );
      setUserRooms(newRooms);
    });
  }, [currentUserId]);

  if (currentUserId === null) {
    return null;
  }

  return (
    <div className="HomePage">
      <div className="ui-container">
        <h1 className="HomePage-heading">Clubroom</h1>
        {currentUserId ? (
          <div>
            <p>
              <Link to={roomCreatePagePath()}>Create a room</Link>
              <br />
              <Link to={myProfileEditPagePath()}>Edit my profile</Link>
              <br />
              <button onClick={() => auth.signOut()}>Log out</button> User ID:{" "}
              {currentUserId}
            </p>
            <ul>
              {userRooms ? (
                userRooms.map((room) => (
                  <li key={room.id}>
                    <Link to={roomViewPagePath(room.id)}>{room.name}</Link>
                  </li>
                ))
              ) : (
                <li>...</li>
              )}
            </ul>
          </div>
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