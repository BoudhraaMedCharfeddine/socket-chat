import { useEffect, useRef } from 'react';
import type { Message, SystemEvent } from '../types';

type ChatItem = { kind: 'message'; data: Message } | { kind: 'event'; data: SystemEvent };

interface Props {
  items: ChatItem[];
  currentUserId: string;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageList({ items, currentUserId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
        Aucun message. Soyez le premier à écrire !
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
      {items.map((item, i) => {
        if (item.kind === 'event') {
          const ev = item.data;
          return (
            <p key={i} className="text-center text-xs text-gray-600 py-1">
              {ev.username}{' '}
              {ev.type === 'joined' ? 'a rejoint le salon' : 'a quitté le salon'}
            </p>
          );
        }

        const msg = item.data;
        const isMine = msg.userId === currentUserId;

        return (
          <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
            {!isMine && (
              <span className="text-xs text-indigo-400 mb-0.5 px-1">{msg.username}</span>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm break-words ${
                isMine
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-gray-800 text-gray-100 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
            <span className="text-xs text-gray-600 mt-0.5 px-1">
              {formatTime(msg.createdAt)}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
