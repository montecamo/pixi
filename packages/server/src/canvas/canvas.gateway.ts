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
    console.warn('fibers', fibers, roomId);
    client.to(roomId).emit('fibers', fibers);
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    client.join(id);
    client.emit('joined');
  }
}
