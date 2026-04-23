import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173', credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private usernames = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    client.emit('rooms', this.chatService.getRooms());
  }

  handleDisconnect(client: Socket) {
    const username = this.usernames.get(client.id);
    this.chatService.leaveAllRooms(client.id);
    this.usernames.delete(client.id);

    for (const roomId of Array.from(client.rooms)) {
      if (roomId !== client.id) {
        this.server.to(roomId).emit('user:left', {
          username,
          roomId,
          memberCount: this.chatService.getMemberCount(roomId),
        });
      }
    }
  }

  @SubscribeMessage('room:join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; username: string },
  ) {
    const { roomId, username } = payload;
    this.usernames.set(client.id, username);
    client.join(roomId);
    this.chatService.joinRoom(roomId, client.id);

    const history = this.chatService.getMessages(roomId);
    client.emit('room:history', { roomId, messages: history });

    this.server.to(roomId).emit('user:joined', {
      username,
      roomId,
      memberCount: this.chatService.getMemberCount(roomId),
    });
  }

  @SubscribeMessage('room:leave')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    const { roomId } = payload;
    const username = this.usernames.get(client.id);
    client.leave(roomId);
    this.chatService.leaveRoom(roomId, client.id);

    this.server.to(roomId).emit('user:left', {
      username,
      roomId,
      memberCount: this.chatService.getMemberCount(roomId),
    });
  }

  @SubscribeMessage('message:send')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; content: string },
  ) {
    const { roomId, content } = payload;
    const username = this.usernames.get(client.id) ?? 'Anonyme';

    if (!content.trim()) return;

    const message = this.chatService.addMessage(roomId, client.id, username, content.trim());
    this.server.to(roomId).emit('message:received', message);
  }
}
