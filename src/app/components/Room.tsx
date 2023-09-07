import classNames from "classnames";
import { useEffect, useState, useRef } from "react";
import { useRoomContext } from "@/app/providers/room-context";
import { RoomMap, Message } from "@/shared";
import { useUsers, useSelf } from "y-presence";
import Avatar from "./Avatar";
import ClearRoom from "./ClearRoom";
import { useSyncedStore } from "@syncedstore/react";

export default function Room() {
  const {
    provider,
    name,
    store: globalStore,
    currentUserId,
  } = useRoomContext();
  const [messageInput, setMessageInput] = useState("");
  const store = useSyncedStore(globalStore);
  const [doReply, setDoReply] = useState(false);
  const chatListRef = useRef(null);

  const users = useUsers(provider!.awareness);
  const self = useSelf(provider!.awareness);
  // Get room details
  const room = RoomMap[name];
  const npc = room?.npc;
  const title = room?.title;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!self) return;
    if (!messageInput) return;

    const message = {
      userId: currentUserId,
      name: self.name,
      initials: self.initials,
      text: messageInput,
      isNpc: false,
      seenByNpc: false,
    } as Message;

    store.messages.push(message);
    setMessageInput("");
  };

  useEffect(() => {
    if (chatListRef.current) {
      // Scroll to bottom
      const element = chatListRef.current as unknown as HTMLDivElement;
      element.scrollTop = element.scrollHeight;
    }
  }, [store.messages]);

  if (!provider) return null;
  if (!room) return null;

  return (
    <div className="h-full max-h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-4 justify-end flex flex-row -space-x-2">
        {npc && <Avatar initials={npc.name} variant="npc" />}
        {Array.from(users.entries())
          .sort()
          .map(([key, value]) => {
            const isMe = currentUserId === key.toString();
            if (isMe) return null;
            return (
              <Avatar key={key} initials={value.initials} variant="normal" />
            );
          })}
        <Avatar initials="" variant="ghost" />
      </div>
      <div className="p-4 flex gap-4 justify-start items-center">
        <div className="prose">
          <h1>{title}</h1>
        </div>
        {self?.name && <ClearRoom />}
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
                const isMe = currentUserId === message.userId;
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
                        initials={message.initials}
                        variant={message.isNpc ? "small-npc" : "small"}
                      />
                    </div>
                    <div className="px-3 py-1 bg-white rounded-2xl flex flex-col">
                      {message.text
                        .split("\n")
                        .map((line: string, index: number) => {
                          return <span key={index}>{line}</span>;
                        })}
                    </div>
                    <div className="grow-0 w-3"></div>
                  </li>
                );
              })}
          </ul>
        </div>
        {self?.name && (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-row space-x-2"
          >
            <input
              type="text"
              value={messageInput}
              className="p-1 w-full"
              onChange={(e) => {
                setMessageInput(e.target.value);
              }}
            />
            <button
              type="submit"
              className="px-2 py-1 bg-white/60 hover:bg-white"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
