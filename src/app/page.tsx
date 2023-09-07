"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

import AnimatedRoomContainer from "./components/AnimatedRoomContainer";
import Navigator from "./components/Navigator";
import RoomContextProvider from "./providers/room-context";
import Room from "./components/Room";
import Settings from "./components/Settings";
import Avatar from "./components/Avatar";
import SettingsCTA from "./components/SettingsCTA";

import { RoomMap, type RoomName, DEFAULT_ROOM, type User } from "@/shared";

// In units

// PaneName is an emum of allowed pane numbers
// PaneMap is a map of PaneName to { top: number, left: number }

const generateRandomId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const makeInitials = (name: string) => {
  const words = name.split(" ");
  switch (words.length) {
    case 0:
      return "";
    case 1:
      return words[0].slice(0, 1).toUpperCase();
    default:
      return (
        words[0].slice(0, 1).toUpperCase() +
        words[words.length - 1].slice(0, 1).toUpperCase()
      );
  }
};

const makeUser = (name: string) => {
  return {
    name: name,
    initials: makeInitials(name),
  } as User;
};

export default function Page() {
  const [currentRoom, setCurrentRoom] = useState(DEFAULT_ROOM);
  const [previousRoom, setPreviousRoom] = useState(DEFAULT_ROOM);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleRoomChange = (transitioningToRoom: RoomName) => {
    setIsTransitioning(true);
    setPreviousRoom(currentRoom);
    setCurrentRoom(transitioningToRoom);
  };

  const custom = { source: previousRoom, destination: currentRoom };

  return (
    <main className="relative min-h-screen h-screen max-h-screen flex flex-col bg-gray-800">
      {showSettings && (
        <Settings
          name={user?.name ?? null}
          setName={(name) => setUser(makeUser(name))}
          dismiss={() => setShowSettings(false)}
        />
      )}
      <div
        className={showSettings ? "pointer-events-none overscroll-none" : ""}
      >
        {!user && <SettingsCTA showSettings={() => setShowSettings(true)} />}
        <div className="absolute top-0 right-0 p-12 z-10">
          <div onClick={() => setShowSettings(true)} className="cursor-pointer">
            {user !== null ? (
              <Avatar initials={user.initials} variant="highlight" />
            ) : (
              <Avatar initials="" variant="ghost" />
            )}
          </div>
        </div>
        <Navigator
          currentRoom={currentRoom}
          handleRoomChange={handleRoomChange}
          disabled={isTransitioning}
        />
        <AnimatePresence
          custom={custom}
          onExitComplete={() => setIsTransitioning(false)}
        >
          {
            // Iterate over PaneMap getting the pane name and details object
            Object.entries(RoomMap).map(([roomName, _]) => {
              return (
                currentRoom === roomName && (
                  <AnimatedRoomContainer
                    key={roomName}
                    name={roomName as RoomName}
                    custom={custom}
                  >
                    <RoomContextProvider
                      name={roomName as RoomName}
                      currentUser={user}
                    >
                      <Room />
                    </RoomContextProvider>
                  </AnimatedRoomContainer>
                )
              );
            })
          }
        </AnimatePresence>
      </div>
    </main>
  );
}
