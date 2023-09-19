import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Settings({
  name,
  setName,
  dismiss,
}: {
  name: string | null;
  setName: (name: string) => void;
  dismiss: () => void;
}) {
  const [nameInput, setNameInput] = useState(name ?? "");
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const keyListener = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      dismiss();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameInput) return;
    setName(nameInput);
    window.localStorage.setItem("spatial-chat:name", nameInput);
    setNameInput("");
    dismiss();
  };

  return (
    <div className="z-20 backdrop-blur-sm flex flex-col gap-8 items-center justify-center w-full h-full bg-black/50 text-white font-4xl">
      <form className="flex flex-row gap-4" onSubmit={handleSubmit}>
        <input
          ref={nameInputRef}
          type="text"
          className="text-xl text-black p-4"
          value={nameInput}
          onKeyDown={(e) => keyListener(e)}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button
          type="submit"
          className="p-4 text-xl bg-green-300/90 hover:bg-white text-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 disabled:hover:text-gray-400"
          disabled={nameInput === ""}
        >
          Change Name
        </button>
      </form>
      <button onClick={dismiss} className="underline text-white/80">
        Cancel
      </button>
      <div className="fixed bottom-0 left-0 w-full">
        <div className="flex flex-row justify-center pb-8 gap-6 text-white/80">
          <div>
            Made with{" "}
            <Link className="underline" href="https://partykit.io">
              PartyKit
            </Link>
          </div>
          <div>
            <Link
              className="underline"
              href="https://github.com/partykit/sketch-spatial-chat"
            >
              GitHub
            </Link>
          </div>
          <div>
            <Link
              className="underline"
              href="https://blog.partykit.io/posts/thinking-hats-and-spatial-chat"
            >
              More info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
