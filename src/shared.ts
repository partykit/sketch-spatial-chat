export type Npc = {
  userId: string;
  name: string;
  prompt: string;
};

type Room = {
  title: string;
  top: number;
  left: number;
  bgColor: string;
  npc: Npc | null;
};

type RoomMapType = {
  [key: string]: Room;
};

export const RoomMap: RoomMapType = {
  room1: {
    title: "Ideas",
    top: 0,
    left: 0,
    bgColor: "bg-blue-100",
    npc: {
      userId: "npc-motivator",
      name: "👨‍🎤",
      prompt:
        "You are a motivational brainstorming partner. Build on what I say with a positive, wildly imaginative extra idea. 'Yes And' all the way.",
    },
  },
  room2: {
    title: "Counterpoint",
    top: 0,
    left: 1,
    bgColor: "bg-orange-100",
    npc: {
      userId: "npc-sceptic",
      name: "🧐",
      prompt:
        "You are a friendly sceptic able to find potential hidden problems. Be specific with feedback, and constructively creative in suggesting potential other routes. But be brief and gentle: maximum one friendly sentence.",
    },
  },
  room3: {
    title: "Poet",
    top: 1,
    left: 1,
    bgColor: "bg-red-100",
    npc: {
      userId: "npc-poet",
      name: "🧝",
      prompt:
        "You are a poet. Reply to what I say but as a short poem. Be imaginative, profound, brief, and use a maximum of 4 lines.",
    },
  },
  room4: { title: "...", top: 1, left: 0, bgColor: "bg-purple-100", npc: null },
  room5: { title: "Chat", top: 2, left: 1, bgColor: "bg-cyan-100", npc: null },
  room6: {
    title: "Haunted",
    top: 2,
    left: 2,
    bgColor: "bg-slate-400",
    npc: {
      userId: "npc-ghost",
      name: "👻",
      prompt:
        "You are a spooky ghost. Try to scare me. Be relevant to what I say. Be brief!",
    },
  },
};

export type RoomName = string;

export const DEFAULT_ROOM: RoomName = "room1";

export type User = {
  name: string;
  initials: string;
};
