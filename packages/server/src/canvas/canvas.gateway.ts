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
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.warn('message', data);
    client.broadcast.emit('fibers', data);
    // this.server.sockets.emit('fibers', data);
  }
}
