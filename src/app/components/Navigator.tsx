import classNames from "classnames";

import { RoomMap, type RoomName } from "@/shared";

export enum Direction {
  up = "up",
  down = "down",
  left = "left",
  right = "right",
}

function roomInDirection(currentRoom: RoomName, direction: Direction) {
  // Returns true if the direction is disabled
  const translation = {
    up: { top: -1, left: 0 },
    down: { top: 1, left: 0 },
    left: { top: 0, left: -1 },
    right: { top: 0, left: 1 },
  };
  const newTop = RoomMap[currentRoom].top + translation[direction].top;
  const newLeft = RoomMap[currentRoom].left + translation[direction].left;
  const newPane = Object.keys(RoomMap).find(
    (key) =>
      RoomMap[key as RoomName].top === newTop &&
      RoomMap[key as RoomName].left === newLeft
  );
  return newPane;
}

function Button(props: {
  direction: Direction;
  currentRoom: RoomName;
  handleRoomChange: (newRoom: RoomName) => void;
  disabled: boolean;
}) {
  const { direction, currentRoom, handleRoomChange, disabled } = props;
  const newPane = roomInDirection(currentRoom, direction);
  const directionDisabled = newPane === undefined || disabled;
  const extraClasses = {
    up: "rounded-t-lg",
    down: "rounded-b-lg",
    left: "rounded-l-lg",
    right: "rounded-r-lg",
  };
  const content = {
    up: <>&uarr;</>,
    down: <>&darr;</>,
    left: <>&lt;-</>,
    right: <>-&gt;</>,
  };
  const baseClasses =
    "w-10 h-10 bg-white shadow-md hover:bg-black hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 disabled:hover:text-gray-400 flex items-center justify-center text-2xl";
  return (
    <button
      className={classNames(baseClasses, extraClasses[direction])}
      disabled={directionDisabled}
      onClick={() => {
        handleRoomChange(newPane as RoomName);
      }}
    >
      {content[direction]}
    </button>
  );
}

export default function Navigator(props: {
  currentRoom: RoomName;
  handleRoomChange: (newPane: RoomName) => void;
  disabled: boolean;
}) {
  const { currentRoom, handleRoomChange, disabled } = props;

  const baseClasses =
    "w-10 h-10 bg-white shadow-md hover:bg-black hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 disabled:hover:text-gray-400 flex items-center justify-center text-2xl";

  return (
    <div className="absolute bottom-0 right-0 p-4 z-10">
      <div className="grid grid-cols-3 grid-rows-3 place-content-center">
        <div></div>
        <Button
          direction={Direction.up}
          currentRoom={currentRoom}
          handleRoomChange={handleRoomChange}
          disabled={disabled}
        />
        <div></div>

        <Button
          direction={Direction.left}
          currentRoom={currentRoom}
          handleRoomChange={handleRoomChange}
          disabled={disabled}
        />
        <div
          className={classNames(
            "w-10 h-10 z-20",
            disabled ? "bg-gray-200" : "bg-white"
          )}
        />
        <Button
          direction={Direction.right}
          currentRoom={currentRoom}
          handleRoomChange={handleRoomChange}
          disabled={disabled}
        />

        <div></div>
        <Button
          direction={Direction.down}
          currentRoom={currentRoom}
          handleRoomChange={handleRoomChange}
          disabled={disabled}
        />
        <div></div>
      </div>
    </div>
  );
}
