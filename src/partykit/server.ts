import {
  PartyKitServer,
  Party,
  PartyConnection,
  PartyConnectionContext,
} from "partykit/server";
import { onConnect } from "y-partykit";
import { YPartyKitStorage } from "y-partykit/storage";

export default {
  onConnect(ws, room) {
    return onConnect(ws, room, {
      persist: true,
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
      return new Response(JSON.stringify(messages.toJSON(), null, 2));
    }

    return new Response("Unsupported method", { status: 400 });
  },
} satisfies PartyKitServer;
