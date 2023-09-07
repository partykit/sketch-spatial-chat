import classNames from "classnames";

export default function Avatar(props: {
  initials: string;
  variant: "normal" | "highlight" | "ghost" | "npc" | "small" | "small-npc";
}) {
  const { initials } = props;
  const { variant } = props || "normal";
  const extraClasses = {
    normal: "w-10 h-10 bg-green-400 outline-green-600 outline-1",
    npc: "w-10 h-10 bg-gray-200 outline-gray-400 outline-1 text-3xl",
    highlight: "w-10 h-10 bg-green-400 outline-green-600 outline-4",
    ghost:
      "w-10 h-10 bg-transparent outline-green-600 outline-2 outline-dashed",
    small: "w-8 h-8 bg-green-400 outline-green-600 outline-1 text-xs",
    "small-npc": "w-8 h-8 bg-gray-200 outline-gray-400 outline-1 text-xl",
  };
  return (
    <div
      className={classNames(
        "outline rounded-full flex justify-center items-center",
        extraClasses[variant],
      )}
    >
      {initials}
    </div>
  );
}
