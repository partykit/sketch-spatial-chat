"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import AnimatedRoomContainer from "./components/AnimatedRoomContainer";
import Navigator from "./components/Navigator";
import RoomContextProvider from "./providers/room-context";
//import Room from "./room";

//import Avatar from "./avatar";

import { RoomMap, type RoomName, DEFAULT_ROOM } from "@/shared";

// In units

// PaneName is an emum of allowed pane numbers
// PaneMap is a map of PaneName to { top: number, left: number }

const generateRandomId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export default function Page() {
  const [currentRoom, setCurrentRoom] = useState(DEFAULT_ROOM);
  const [previousRoom, setPreviousRoom] = useState(DEFAULT_ROOM);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userId, setUserId] = useState(generateRandomId());

  const handleRoomChange = (transitioningToRoom: RoomName) => {
    setIsTransitioning(true);
    setPreviousRoom(currentRoom);
    setCurrentRoom(transitioningToRoom);
  };

  const custom = { source: previousRoom, destination: currentRoom };

  const initials = userId.slice(-2).toUpperCase();

  return (
    <main className="relative min-h-screen h-screen max-h-screen flex flex-col bg-gray-800">
      <div className="hidden absolute top-0 left-0 p-4 relative prose z-10">
        <h1>Animation test</h1>
        <p>Moving around between panes.</p>
        <p>Active pane: {currentRoom}</p>
        <p>Transitioning: {isTransitioning ? "Yes" : "No"}</p>
      </div>
      {/*<div className="absolute top-0 right-0 p-12 z-10">
        <Avatar initials={initials} variant="highlight" />
  </div>*/}
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
                    userId={userId}
                  >
                    {/*<Room />*/}
                    <h1 className="text-4xl text-white">Room: {roomName}</h1>
                  </RoomContextProvider>
                </AnimatedRoomContainer>
              )
            );
          })
        }
      </AnimatePresence>
    </main>
  );
}
