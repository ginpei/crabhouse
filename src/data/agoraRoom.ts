import {
  getAgoraConnectionState,
  joinAgoraChannel,
  leaveAgoraChannel,
} from "./agora";
import { appSlice, appStore } from "./appStore";
import { Room } from "./Room";
import { leaveFromSession, participateInSession } from "./RoomParticipantDb";

// TODO remove currentUserId and retrieve from auth
export async function joinRoom(
  currentUserId: string,
  room: Room
): Promise<void> {
  if (getAgoraConnectionState() !== "DISCONNECTED") {
    await leaveRoom(room.id);
  }

  appStore.dispatch(appSlice.actions.setPlayingSession({ room }));
  try {
    const { token } = await participateInSession(room.id);
    await joinAgoraChannel(currentUserId, room, token);
  } catch (error) {
    appStore.dispatch(appSlice.actions.setPlayingSession({ room: null }));
    await leaveFromSession(room.id);
    throw error;
  }
}

export async function leaveRoom(roomId: string): Promise<void> {
  await Promise.all([leaveAgoraChannel(), leaveFromSession(roomId)]);
}
