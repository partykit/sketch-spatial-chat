"use client";

import { useState, useEffect, createContext, useContext, useMemo } from "react";

import YPartyKitProvider from "y-partykit/provider";
import { syncedStore } from "@syncedstore/core";
import { Doc } from "yjs";
import { type User } from "@/shared";

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

export default function RoomContextProvider(props: {
  name: string;
  user: User | null;
  children: React.ReactNode;
}) {
  const { name, user } = props;
  const [loading, setLoading] = useState(true);
  const [doc] = useState(new Doc());
  /*const [provider, setProvider] = useState<YPartyKitProvider>(
    new YPartyKitProvider("localhost:1999", name, doc, { connect: false })
  );*/

  const provider = useMemo(() => {
    return new YPartyKitProvider("localhost:1999", name, doc, {
      connect: false,
    });
  }, [name, doc]);

  const [store, setStore] = useState(
    syncedStore({ messages: [] as Message[] }, doc)
  );

  const onConnect = () => {
    setLoading(false);
  };

  const onDisconnect = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (user && provider) {
      provider.awareness.setLocalState(user);
    }
  }, [user, provider]);

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
