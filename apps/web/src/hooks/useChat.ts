import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import type { Message, Room, SystemEvent } from '../types';

type ChatItem = { kind: 'message'; data: Message } | { kind: 'event'; data: SystemEvent };

export function useChat(username: string) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [chatItems, setChatItems] = useState<Record<string, ChatItem[]>>({});
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [connected, setConnected] = useState(false);
  const prevRoomRef = useRef<string | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('rooms', (data: Room[]) => setRooms(data));

    socket.on('room:history', ({ roomId, messages }: { roomId: string; messages: Message[] }) => {
      setChatItems((prev) => ({
        ...prev,
        [roomId]: messages.map((m) => ({ kind: 'message', data: m })),
      }));
    });

    socket.on('message:received', (msg: Message) => {
      setChatItems((prev) => ({
        ...prev,
        [msg.roomId]: [...(prev[msg.roomId] ?? []), { kind: 'message', data: msg }],
      }));
    });

    socket.on('user:joined', (event: SystemEvent) => {
      setChatItems((prev) => ({
        ...prev,
        [event.roomId]: [...(prev[event.roomId] ?? []), { kind: 'event', data: { ...event, type: 'joined' } }],
      }));
      setMemberCounts((prev) => ({ ...prev, [event.roomId]: event.memberCount }));
    });

    socket.on('user:left', (event: SystemEvent) => {
      setChatItems((prev) => ({
        ...prev,
        [event.roomId]: [...(prev[event.roomId] ?? []), { kind: 'event', data: { ...event, type: 'left' } }],
      }));
      setMemberCounts((prev) => ({ ...prev, [event.roomId]: event.memberCount }));
    });

    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
      socket.off('rooms');
      socket.off('room:history');
      socket.off('message:received');
      socket.off('user:joined');
      socket.off('user:left');
    };
  }, []);

  const joinRoom = (roomId: string) => {
    if (prevRoomRef.current && prevRoomRef.current !== roomId) {
      socket.emit('room:leave', { roomId: prevRoomRef.current });
    }
    prevRoomRef.current = roomId;
    setActiveRoom(roomId);
    socket.emit('room:join', { roomId, username });
  };

  const sendMessage = (content: string) => {
    if (!activeRoom || !content.trim()) return;
    socket.emit('message:send', { roomId: activeRoom, content });
  };

  const items = activeRoom ? (chatItems[activeRoom] ?? []) : [];

  return { rooms, activeRoom, items, memberCounts, connected, joinRoom, sendMessage };
}
