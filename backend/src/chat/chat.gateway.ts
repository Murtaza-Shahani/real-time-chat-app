import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // ✅ 1. Store userId -> socketId
  private users = new Map<number, string>();

  // ✅ On connect
  handleConnection(socket: Socket) {
    const userId = Number(socket.handshake.query.userId);

    if (userId) {
      this.users.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ${socket.id}`);
    }
  }

  // ✅ On disconnect
  handleDisconnect(socket: Socket) {
    for (const [userId, sockId] of this.users.entries()) {
      if (sockId === socket.id) {
        this.users.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  // ✅ Handle message
  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const { senderId, receiverId } = data;

    console.log('Message received:', data);

    // ✅ Find receiver socket
    const receiverSocketId = this.users.get(receiverId);

    // ✅ Send to receiver ONLY
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', data);
    }

    // ✅ Send back to sender (important for UI sync)
    socket.emit('receive_message', data);
  }
}