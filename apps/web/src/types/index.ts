export interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface SystemEvent {
  type: 'joined' | 'left';
  username: string;
  roomId: string;
  memberCount: number;
}
