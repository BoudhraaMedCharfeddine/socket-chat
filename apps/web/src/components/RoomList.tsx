import type { Room } from '../types';

interface Props {
  rooms: Room[];
  activeRoom: string | null;
  memberCounts: Record<string, number>;
  username: string;
  onSelect: (roomId: string) => void;
}

export default function RoomList({ rooms, activeRoom, memberCounts, username, onSelect }: Props) {
  return (
    <aside className="w-56 bg-gray-900 flex flex-col shrink-0">
      <div className="px-4 py-4 border-b border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Connecté en tant que</p>
        <p className="text-white font-semibold truncate">{username}</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <p className="px-4 py-2 text-xs text-gray-500 uppercase tracking-widest">Salons</p>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={`w-full text-left px-4 py-2 flex items-center justify-between transition ${
              activeRoom === room.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span># {room.name}</span>
            {memberCounts[room.id] !== undefined && (
              <span className="text-xs opacity-60">{memberCounts[room.id]}</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
