import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v1 as uuidv1 } from 'uuid';
import { CanvasService } from './canvas.service';
import { random } from '../utils/random';
import type { Fibers } from './types';

const ROOM_CODE_LENGTH = 4;

@WebSocketGateway(3001)
export class CanvasGateway {
  constructor(private canvasService: CanvasService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('fibers')
  listenForMessages(
    @MessageBody() { fibers, roomId }: { fibers: Fibers; roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.canvasService.updateCanvas(roomId, fibers);

    client.to(roomId).emit('fibers', fibers);
  }

  async joinRoom(client: Socket, roomId: string) {
    const canvas = await this.canvasService.getCanvas(roomId);

    if (canvas) {
      client.emit('roomJoined', roomId);

      client.emit('fibers', canvas.fibers);

      client.join(roomId);

      client.to(roomId).emit('userConnected', client.id);

      client.on('disconnecting', () => {
        const rooms = Object.keys(client.rooms);

        rooms.forEach((room) =>
          client.to(room).emit('userDisconnected', client.id),
        );
      });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const canvas = await this.canvasService.getCanvas(roomId);

    if (canvas) {
      this.joinRoom(client, roomId);
    } else {
      this.createRoom(client, roomId);
    }
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(@ConnectedSocket() client: Socket) {
    this.createRoom(client);
  }

  createRoom(client: Socket, id = random(ROOM_CODE_LENGTH)) {
    this.canvasService.create({ id: id, fibers: [] });

    client.emit('roomCreated', id);
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
