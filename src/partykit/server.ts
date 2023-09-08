import type {
  Party,
  PartyServer,
  PartyConnection,
  PartyRequest,
} from "partykit/server";
import type { Doc as YDoc } from "yjs";
import { onConnect } from "y-partykit";
import { YPartyKitStorage } from "y-partykit/storage";
import { yDocShape, type Message, RoomMap, type Npc } from "@/shared";
import { syncedStore } from "@syncedstore/core";
import { getChatCompletionResponse, AIMessage } from "./utils/openai";

const DEFAULT_NPC_MESSAGE = "...";

export default class SpatialChatServer implements PartyServer {
  constructor(readonly party: Party) {}

  async onConnect(ws: PartyConnection) {
    return onConnect(ws, this.party, {
      persist: true,
      callback: {
        handler: (ydoc) => {
          try {
            this.handleYDocChange(ydoc);
          } catch (e) {
            console.error("Error in ydoc update handler", e);
          }
        },
      },
    });
  }

  // For debug, dump the current state of the yDoc
  // When run locally, this can be seen at http://127.0.0.1:1999/party/room
  async onRequest(req: PartyRequest) {
    const roomStorage = new YPartyKitStorage(this.party.storage);
    const ydoc = await roomStorage.getYDoc(this.party.id);

    if (req.method === "GET") {
      if (!ydoc) {
        return new Response("No ydoc yet", { status: 404 });
      }
      const messages = ydoc.getArray("messages");
      return new Response(JSON.stringify(messages, null, 2));
    }

    return new Response("Unsupported method", { status: 400 });
  }

  /** Run when the Y.js document changes */
  async handleYDocChange(ydoc: YDoc) {
    // find out which room we're in and make sure there's an NPC in it
    const chatRoom = RoomMap[this.party.id] ?? null;
    if (!chatRoom.npc) return;

    console.log("Handling ydoc change", chatRoom);

    // find the last message in the room
    const store = syncedStore(yDocShape, ydoc);
    const finalMessage = store.messages[store.messages.length - 1] as Message;

    // if it hasn't yet been handled
    if (!finalMessage.seenByNpc) {
      // time to generate a response from the room's NPC
      finalMessage.seenByNpc = true;
      store.messages.push({
        userId: chatRoom.npc.userId,
        name: chatRoom.npc.name,
        initials: chatRoom.npc.name,
        isNpc: true,
        text: DEFAULT_NPC_MESSAGE,
        seenByNpc: true,
      } as Message);

      await this.generateLLMResponse(chatRoom.npc, store.messages);
    }
  }

  async generateLLMResponse(npc: Npc, messages: Message[]) {
    console.log("Generating response", npc);
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
    await getChatCompletionResponse({
      env: this.party.env,
      messages: [prompt, ...transcript],
      onStartCallback: () => {},
      onTokenCallback: (token) => {
        text += token;
        npcMessage.text = text;
      },
    });
  }
}
