export default function SettingsCTA({
  showSettings,
}: {
  showSettings: () => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 p-12 z-10">
      <div className="w-min drop-shadow flex flex-row space-x-2 bg-red-200 p-2 rounded justify-between">
        <div className="p-1 whitespace-nowrap">
          You need to set your name to chat
        </div>
        <button
          onClick={() => showSettings()}
          className="px-2 py-1 bg-white/60 hover:bg-white whitespace-nowrap"
        >
          Open Settings
        </button>
      </div>
    </div>
  );
}
