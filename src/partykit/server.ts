import {
  PartyKitServer,
  Party,
  PartyConnection,
  PartyConnectionContext,
} from "partykit/server";
import { onConnect } from "y-partykit";
import { YPartyKitStorage } from "y-partykit/storage";
import { yDocShape, type Message, RoomMap, type Npc } from "@/shared";
import { syncedStore } from "@syncedstore/core";
import { getChatCompletionResponse, AIMessage } from "./utils/openai";

const DEFAULT_NPC_MESSAGE = "...";

function generate(env: Party["env"], npc: Npc, messages: Message[]) {
  // This is the message we're updating
  const npcMessage = messages[messages.length - 1];
  if (!npcMessage.isNpc && npcMessage.text === DEFAULT_NPC_MESSAGE) {
    // Something's gone wrong, we're not updating the right message
    return;
  }

  const prompt = {
    role: "system",
    content: npc.prompt,
  } as AIMessage;

  // transcript is the most recent 10 messages, in the form:
  // { role: "user" | "assistant", text: string }
  // It needs to be creates from messages, which is an array of Message,
  // and may be any length. It is an assisant message is isNpc is true,
  // and a user message otherwise.
  const transcript = messages
    .map((message) => {
      return {
        role: message.isNpc ? "assistant" : "user",
        content: message.text,
      } as AIMessage;
    })
    .slice(-10);

  let text = "";
  getChatCompletionResponse({
    env: env,
    messages: [prompt, ...transcript],
    onStartCallback: () => {},
    onTokenCallback: (token) => {
      text += token;
      npcMessage.text = text;
    },
  });
}

export default {
  onConnect(ws, room) {
    const chatRoom = RoomMap[room.id] ?? null;
    return onConnect(ws, room, {
      persist: true,
      callback: {
        async handler(ydoc) {
          if (!chatRoom.npc) return;
          const store = syncedStore(yDocShape, ydoc);
          const finalMessage = store.messages[
            store.messages.length - 1
          ] as Message;
          if (!finalMessage.seenByNpc) {
            // Time to generate a response from the room's NPC, if any
            finalMessage.seenByNpc = true;
            store.messages.push({
              userId: chatRoom.npc.userId,
              name: chatRoom.npc.name,
              initials: chatRoom.npc.name,
              isNpc: true,
              text: DEFAULT_NPC_MESSAGE,
              seenByNpc: true,
            } as Message);

            generate(room.env, chatRoom.npc, store.messages);
          }
        },
      },
    });
  },
  // For debug, dump the current state of the yDoc
  // When run locally, this can be seen at http://127.0.0.1:1999/party/room1
  async onRequest(req, room) {
    const roomStorage = new YPartyKitStorage(room.storage);
    const ydoc = await roomStorage.getYDoc(room.id);

    if (req.method === "GET") {
      if (!ydoc) {
        return new Response("No ydoc yet", { status: 404 });
      }
      const messages = ydoc.getArray("messages");
      return new Response(JSON.stringify(messages, null, 2));
    }

    return new Response("Unsupported method", { status: 400 });
  },
} satisfies PartyKitServer;
