"use client";

import { useState } from "react";
import { useRoomContext } from "@/app/providers/room-context";
import { useSyncedStore } from "@syncedstore/react";
import { getYjsValue } from "@syncedstore/core";
import * as Y from "yjs";
import { type Message } from "@/shared";

export default function ClearRoom() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { store } = useRoomContext();
  const state = useSyncedStore(store);

  const handleClearRoom = () => {
    console.log("Clearing room");
    const messages = getYjsValue(state.messages) as Y.Array<Message>;
    if (!messages) return;
    messages.delete(0, messages.length);
    setShowConfirmation(false);
  };

  return (
    <>
      {showConfirmation && (
        <div className="flex flex-wrap gap-2 justify-start items-center">
          <button
            className="outline outline-1 outline-red-400 rounded-full px-3 py-1 text-red-400 text-sm hover:bg-red-200 hover:text-red-500 whitespace-nowrap"
            onClick={handleClearRoom}
          >
            I’m sure! Clear all messages for everyone!
          </button>
          <button
            className="outline outline-1 outline-black/40 rounded-full px-3 py-1 text-black/40 text-sm hover:bg-white/40 hover:text-black/50 whitespace-nowrap"
            onClick={() => setShowConfirmation(false)}
          >
            No, don’t clear
          </button>
        </div>
      )}
      {!showConfirmation && (
        <button
          className="outline outline-1 outline-black/40 rounded-full px-3 py-1 text-black/40 text-sm hover:bg-white/40 hover:text-black/50 whitespace-nowrap"
          onClick={() => setShowConfirmation(true)}
        >
          Clear all messages
        </button>
      )}
    </>
  );
}
