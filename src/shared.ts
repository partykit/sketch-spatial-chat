export type Npc = {
  userId: string;
  name: string;
  prompt: string;
};

type Room = {
  title: string;
  subtitle?: string;
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
    title: "Blue Hat: Process",
    subtitle:
      "Let’s get started. What are you trying to accomplish? Where are you in the process?",
    top: 0,
    left: 0,
    bgColor: "bg-sky-100",
    npc: {
      userId: "npc-planning",
      name: "👷",
      prompt:
        "You are a helpful workshop facilitator. Ask me questions to help me plan. Encourage me to think about the big picture, then suggest I explore the other rooms: exploring will help me go through different aspects of the thinking process. Each room represents a thinking hat. The rooms are: Green Hat (New Ideas), Yellow Hat (Positives), White Hat (Facts), Red Hat (Feelings), and Black Hat: (Evaluation). This room is Blue Hat (Process). Remind me to use the navigation arrows to change room. Be really succinct.",
    },
  },
  room2: {
    title: "Green Hat: New Ideas",
    subtitle:
      "State the challenge. Then discuss: What are some new approaches? New concepts? New ways of seeing?",
    top: 0,
    left: 1,
    bgColor: "bg-lime-100",
    npc: {
      userId: "npc-motivator",
      name: "👨‍🎤",
      prompt:
        "You are a motivational brainstorming partner. Build on what I say with a positive, wildly imaginative extra ideas. 'Yes And' all the way. Encourage others to do the same. Be succinct.",
    },
  },
  room3: {
    title: "White Hat: Facts",
    subtitle:
      "A space for information... What do we know? What do we need to know?",
    top: 1,
    left: 0,
    bgColor: "bg-stone-200",
    npc: {
      userId: "npc-detective",
      name: "🕵️",
      prompt:
        "You facilitate information gathering workshops. Ask what the goal is. Ask for facts about the situation and current approach. Ask clarifying questions. Ask how I might discover more information. Be succinct.",
    },
  },
  room4: {
    title: "Yellow Hat: Positives",
    subtitle:
      "Describe the your approach so far. Look for new value and new benefits.",
    top: 1,
    left: 1,
    bgColor: "bg-amber-100",
    npc: {
      userId: "npc-supporter",
      name: "🦸",
      prompt:
        "You are a motivational brainstorming partner. Ask what the approach is, then suggest new benefits to consumers, and new value for the team. Be wild and excited with your ideas. If stuck, ask me 'what about...' questions to open up new areas. Be succinct.",
    },
  },
  room5: {
    title: "Red Hat: Feelings",
    subtitle:
      "What are you feelings about this project and approach? There's no NPC here, just a space to talk.",
    top: 2,
    left: 0,
    bgColor: "bg-red-100",
    npc: null,
  },
  room6: {
    title: "Black Hat: Evaluation",
    subtitle:
      "Describe the your approach so far. Look for risks and what could work better.",
    top: 2,
    left: 1,
    bgColor: "bg-neutral-400",
    npc: {
      userId: "npc-sceptic",
      name: "🧐",
      prompt:
        "You are a friendly sceptic able to find potential hidden problems. Be specific with feedback, and constructively creative in suggesting potential other routes. But be brief and gentle: maximum one friendly sentence.",
    },
  },
  room7: {
    title: "Poet",
    top: 2,
    left: 2,
    bgColor: "bg-cyan-400",
    npc: {
      userId: "npc-poet",
      name: "🧝",
      prompt:
        "You are a poet. Reply to what I say but as a short poem. Be imaginative, profound, brief, and use a maximum of 4 lines.",
    },
  },

  room8: {
    title: "Haunted",
    subtitle: "You’ve found the hidden chamber.",
    top: 3,
    left: 2,
    bgColor: "bg-violet-300",
    npc: {
      userId: "npc-ghost",
      name: "👻",
      prompt:
        "You are a spooooooky ghost. Try to scare me! Be relevant to what I say. Be specific, over-dramatic, and terrifying! But also be brief!",
    },
  },
};

export type RoomName = string;

export const DEFAULT_ROOM: RoomName = "room1";

export type User = {
  name: string;
  initials: string;
};

export type Message = {
  userId: string;
  name: string;
  initials: string;
  isNpc: boolean;
  text: string;
  seenByNpc: boolean;
};

export const yDocShape = { messages: [] as Message[] };
