import AgoraRTC, { ConnectionState, IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { noop } from "../misc/misc";

export function useAgoraClient(): IAgoraRTCClient | null {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  useEffect(() => {
    const newClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setClient(newClient);
    return () => {
      newClient.leave();
    };
  }, []);

  return client;
}

export function useAgoraConnectionState(
  client: IAgoraRTCClient | null
): ConnectionState | "" {
  const [state, setState] = useState<ConnectionState | "">("");

  useEffect(() => {
    setState("");
    if (!client) {
      return noop;
    }

    const listener = (newState: ConnectionState) => {
      setState(newState);
    };
    client.on("connection-state-change", listener);
    return () => client.off("connection-state-change", listener);
  }, [client]);

  return state;
}
