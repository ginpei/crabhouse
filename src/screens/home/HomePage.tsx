import { Dispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from "../../models/firebase";
import { createRoom, Room } from "../../models/Room";
import { getRoomCollection } from "../../models/RoomDb";
import { LoginForm } from "../../shared/LoginForm";
import { AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";
import { myProfileEditPagePath } from "../my-profile/edit/MyProfileEditPage";
import { roomCreatePagePath } from "../rooms/create/RoomCreatePage";
import { roomViewPagePath } from "../rooms/view/RoomViewPage";
import { userViewPagePath } from "../users/UserViewPage";
import "./HomePage.scss";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const mapDispatch = (dispatch: Dispatch) => ({});

const HomePageBase: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({ currentUserId }) => {
  const [userRooms, setUserRooms] = useState<Room[] | null>(null);
  useCurrentUserStore();

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
      <Helmet>
        <title>Crabhouse 🦀 カニヤシキ</title>
      </Helmet>
      <div className="ui-container">
        <h1 className="HomePage-heading">Clubroom</h1>
        {currentUserId ? (
          <div>
            <p>
              <Link to={userViewPagePath(currentUserId)}>User page</Link>
            </p>
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
          <LoginForm />
        )}
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
