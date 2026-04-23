import { Injectable } from '@nestjs/common';
import { Message, Room } from './types';
import { randomUUID } from 'crypto';

@Injectable()
export class ChatService {
  private rooms = new Map<string, Room>([
    ['general', { id: 'general', name: 'Général', members: new Set() }],
    ['tech', { id: 'tech', name: 'Tech', members: new Set() }],
    ['random', { id: 'random', name: 'Random', members: new Set() }],
  ]);

  private messages = new Map<string, Message[]>();

  getRooms(): Omit<Room, 'members'>[] {
    return Array.from(this.rooms.values()).map(({ id, name }) => ({ id, name }));
  }

  getMessages(roomId: string): Message[] {
    return this.messages.get(roomId) ?? [];
  }

  addMessage(roomId: string, userId: string, username: string, content: string): Message {
    const message: Message = {
      id: randomUUID(),
      roomId,
      userId,
      username,
      content,
      createdAt: new Date(),
    };
    const msgs = this.messages.get(roomId) ?? [];
    msgs.push(message);
    this.messages.set(roomId, msgs);
    return message;
  }

  joinRoom(roomId: string, socketId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.members.add(socketId);
    return true;
  }

  leaveRoom(roomId: string, socketId: string): void {
    this.rooms.get(roomId)?.members.delete(socketId);
  }

  leaveAllRooms(socketId: string): void {
    for (const room of this.rooms.values()) {
      room.members.delete(socketId);
    }
  }

  getMemberCount(roomId: string): number {
    return this.rooms.get(roomId)?.members.size ?? 0;
  }
}
