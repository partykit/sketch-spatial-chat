"use client";

import { useState, useEffect, createContext, useContext, useMemo } from "react";

import YPartyKitProvider from "y-partykit/provider";
import { syncedStore, getYjsDoc } from "@syncedstore/core";

import {
  useUsers as yPresenceUseUsers,
  useSelf as yPresenceUseSelf,
} from "y-presence";

interface RoomContextType {
  provider: YPartyKitProvider | null;
  name: string;
  store: any | null;
}

export const RoomContext = createContext<RoomContextType>({
  provider: null,
  name: "",
  store: null,
});

export function useRoomContext() {
  return useContext(RoomContext);
}

export type Message = {
  userId: string;
  name: string;
  text: string;
  isNpc: boolean;
};

const generateRandomId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

//const doc = new Doc()

const yDocShape = { messages: [] as Message[] };
const store = syncedStore(yDocShape);
const ydoc = getYjsDoc(store);

export default function RoomContextProvider(props: {
  name: string;
  userId: string;
  children: React.ReactNode;
}) {
  const { name, userId } = props;
  const [loading, setLoading] = useState(true);

  const provider = useMemo(
    () =>
      new YPartyKitProvider(
        process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
        name,
        ydoc,
        {
          connect: false,
        }
      ),
    []
  );

  const onConnect = () => {
    setLoading(false);
    provider.awareness.setLocalState({ id: userId });
  };

  const onDisconnect = () => {
    setLoading(true);
  };

  useEffect(() => {
    const onSync = (connected: boolean) => {
      connected ? onConnect() : onDisconnect();
    };
    provider.on("sync", onSync);
    provider.connect();
    return () => {
      provider.disconnect();
      provider.off("sync", onSync);
    };
  }, [provider]);

  return (
    <RoomContext.Provider
      value={{ provider: provider, name: name, store: store }}
    >
      {loading && <p>Loading...</p>}
      {!loading && props.children}
    </RoomContext.Provider>
  );
}