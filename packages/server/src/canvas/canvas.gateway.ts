import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001)
export class CanvasGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('fibers')
  listenForMessages(
    // @ts-ignore
    @MessageBody() { fibers, roomId }: { fibers: Array; id: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(roomId).emit('fibers', fibers);
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    client.join(id);

    client.on('disconnecting', () => {
      const rooms = Object.keys(client.rooms);

      console.warn('disconnected', rooms);
      rooms.forEach((room) =>
        client.to(room).emit('userDisconnected', client.id),
      );
    });
  }

  @SubscribeMessage('users')
  users(
    @MessageBody()
    {
      position,
      roomId,
    }: { roomId: string; id: string; position: { left: number; top: number } },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(roomId).emit('users', { id: client.id, position });
  }
}
