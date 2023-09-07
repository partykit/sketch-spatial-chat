import classNames from "classnames";
import { useEffect, useState, useRef } from "react";
import { useRoomContext, Message } from "@/app/providers/room-context";
import { RoomMap } from "@/shared";
import { useUsers, useSelf } from "y-presence";
import Avatar from "./Avatar";
import { useSyncedStore } from "@syncedstore/react";

export default function Room() {
  const { provider, name, store: globalStore } = useRoomContext();
  const [newMessage, setNewMessage] = useState("");
  const store = useSyncedStore(globalStore);
  const [doReply, setDoReply] = useState(false);
  const chatListRef = useRef(null);

  if (!provider) return null;
  console.log("room: got provider", provider);
  const users = useUsers(provider.awareness);
  const self = useSelf(provider.awareness);

  // Get room details
  const room = RoomMap[name];
  if (!room) return null;
  const npc = room.npc;
  const title = room.title;

  // users is a Map of clientId => metadata. Get a list of metadata objects
  const metadata = Array.from(users.values());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const initials = self?.id.slice(-2).toUpperCase();
    store.messages.push({
      userId: self?.id,
      name: initials,
      text: newMessage,
      isNpc: false,
    });
    setNewMessage("");
    setDoReply(true);
  };

  useEffect(() => {
    // If a new message comes in from the current user, reverse it and
    // push it to the list
    console.log("doReply: ", doReply);
    if (doReply) {
      const latestMessage = store.messages[store.messages.length - 1];
      if (latestMessage?.userId === self?.id) {
        if (npc) {
          //trigger({ prompt: npc.prompt, userMessage: latestMessage.text})
          console.log("Does nothing");
        }
      }
      setDoReply(false);
    }
  }, [doReply, store.messages]);

  /*useEffect(() => {
        // A message from the NPC!
        if (data && npc) {
            store.messages.push({ userId: npc.userId, name: npc.name, text: data.completion, isNpc: true })
        }
    }, [data])*/

  useEffect(() => {
    if (chatListRef.current) {
      // Scroll to bottom
      const element = chatListRef.current as unknown as HTMLDivElement;
      element.scrollTop = element.scrollHeight;
    }
  }, [store.messages]);

  return (
    <div className="h-full max-h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-4 justify-end flex flex-row -space-x-2">
        {npc && <Avatar initials={npc.name} variant="npc" />}
        {Array.from(users.entries())
          .sort()
          .map(([key, value]) => {
            // The initials are the last two characters of value.id, uppercased
            const isMe = self?.id === value.id;
            if (isMe) return null;
            const initials = value.id.slice(-2).toUpperCase();
            return <Avatar key={key} initials={initials} variant="normal" />;
          })}
        <Avatar initials="" variant="ghost" />
      </div>
      <div className="prose p-4">
        <h1>{title}</h1>
      </div>
      <div
        id="chat"
        className="h-full max-h-full overflow-hidden w-3/4 px-4 pb-4 flex flex-col gap-6 justify-between items-stretch"
      >
        <div
          ref={chatListRef}
          className="grow h-full max-h-full overflow-y-scroll"
        >
          <ul className="flex flex-col-reverse h-full gap-y-2 justify-end p-1">
            {store.messages
              .toReversed()
              .map((message: Message, index: number) => {
                const isMe = self?.id === message.userId;
                return (
                  <li
                    key={index}
                    className={classNames(
                      "flex justify-start items-end gap-2",
                      isMe ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className="grow-0">
                      <Avatar
                        initials={message.name}
                        variant={message.isNpc ? "small-npc" : "small"}
                      />
                    </div>
                    <div className="px-3 py-1 bg-white rounded-2xl flex flex-col">
                      {message.text.split("\n").map((line, index) => {
                        return <span key={index}>{line}</span>;
                      })}
                    </div>
                    <div className="grow-0 w-3"></div>
                  </li>
                );
              })}
          </ul>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-row space-x-2"
        >
          <input
            type="text"
            value={newMessage}
            className="p-1 w-full"
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
          <button
            type="submit"
            className="px-2 py-1 bg-white/60 hover:bg-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
