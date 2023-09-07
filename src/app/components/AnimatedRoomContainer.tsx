import { motion } from "framer-motion";

import { RoomMap, type RoomName } from "@/shared";

function relativePosition(thisRoom: RoomName, relativeTo: RoomName) {
  const top = RoomMap[thisRoom].top - RoomMap[relativeTo].top;
  const left = RoomMap[thisRoom].left - RoomMap[relativeTo].left;
  return { top: `${top * 100}%`, left: `${left * 100}%` };
}

export default function AnimatedRoomContainer(props: {
  name: RoomName;
  children?: React.ReactNode;
  custom: any;
}) {
  const { name, children, custom } = props;

  const variants = {
    animate: { top: 0, left: 0 },
    initial: (custom: { source: RoomName; destination: RoomName }) =>
      relativePosition(name, custom.source),
    exit: (custom: { source: RoomName; destination: RoomName }) =>
      relativePosition(name, custom.destination),
  };

  const bgColor = RoomMap[name].bgColor;

  return (
    <motion.div
      className={`absolute inset-0 flex flex-col justify-center items-center p-8 bg-gray-800 w-full h-screen max-h-screen`}
      animate="animate"
      initial="initial"
      exit="exit"
      variants={variants}
      custom={custom}
      transition={{ duration: 1.5 }}
    >
      <div
        className={`relative rounded-lg w-full h-full max-h-full ${bgColor}`}
      >
        {children}
      </div>
    </motion.div>
  );
}
