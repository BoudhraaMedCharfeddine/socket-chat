import { socket } from '../socket';
import { useChat } from '../hooks/useChat';
import RoomList from './RoomList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Props {
  username: string;
}

export default function Chat({ username }: Props) {
  const { rooms, activeRoom, items, memberCounts, connected, joinRoom, sendMessage } = useChat(username);
  const currentUserId = socket.id ?? '';

  return (
    <div className="flex h-full bg-gray-950 text-white">
      <RoomList
        rooms={rooms}
        activeRoom={activeRoom}
        memberCounts={memberCounts}
        username={username}
        onSelect={joinRoom}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900 shrink-0">
          <div>
            {activeRoom ? (
              <h2 className="font-semibold">
                #{rooms.find((r) => r.id === activeRoom)?.name ?? activeRoom}
              </h2>
            ) : (
              <h2 className="text-gray-500">Sélectionnez un salon</h2>
            )}
          </div>
          <span
            className={`text-xs flex items-center gap-1.5 ${connected ? 'text-green-400' : 'text-red-400'}`}
          >
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            {connected ? 'Connecté' : 'Déconnecté'}
          </span>
        </header>

        {/* Messages */}
        {activeRoom ? (
          <>
            <MessageList items={items} currentUserId={currentUserId} />
            <MessageInput onSend={sendMessage} disabled={!connected} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            Choisissez un salon dans la barre latérale pour commencer à discuter.
          </div>
        )}
      </div>
    </div>
  );
}
