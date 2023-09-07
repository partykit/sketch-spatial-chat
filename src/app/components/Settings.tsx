import { useEffect, useState, useRef } from "react";

export default function Settings({
  name,
  setName,
  dismiss,
}: {
  name: string | null;
  setName: (name: string) => void;
  dismiss: () => void;
}) {
  const [nameInput, setNameInput] = useState("");
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
          className="p-4 text-xl bg-white/80 hover:bg-white text-black"
        >
          Change Name
        </button>
      </form>
      <button onClick={dismiss} className="underline text-white/80">
        Cancel
      </button>
    </div>
  );
}
