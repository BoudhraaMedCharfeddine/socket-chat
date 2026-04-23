export interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  members: Set<string>;
}
