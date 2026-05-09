import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessagesService } from '../messages/messages.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messageService: MessagesService) {}
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
      //send online status to all users
      this.server.emit("online_users", [...this.users.keys()]);
      //notify everyone that user is online
      this.server.emit('user_online', userId);
      

    }
  }

  // ✅ On disconnect
  handleDisconnect(socket: Socket) {
    for (const [userId, sockId] of this.users.entries()) {
      if (sockId === socket.id) {
        this.users.delete(userId);
        console.log(`User ${userId} disconnected`);
        //notify everyone user went offline
        this.server.emit('user_offline',userId);
        break;
      }
    }
  }

  // ✅ Handle message
  @SubscribeMessage('send_message')
async handleMessage(
  @MessageBody() data: any,
  @ConnectedSocket() socket: Socket,
) {
  const { senderId, receiverId, text } = data;

  console.log('Message received:', data);

  // ✅ 1. SAVE TO DB
  const savedMessage = await this.messageService.createMessage({
    senderId,
    receiverId,
    text,
  });

  // ✅ 2. FIND RECEIVER
  const receiverSocketId = this.users.get(receiverId);

  // ✅ 3. SEND TO RECEIVER
  if (receiverSocketId) {
    this.server.to(receiverSocketId).emit('receive_message', savedMessage);
  }

  // ✅ 4. SEND BACK TO SENDER
  socket.emit('receive_message', savedMessage);
}
@SubscribeMessage('typing')
handleTyping(@MessageBody() data: any) {
  const { senderId, receiverId } = data;

  const receiverSocketId = this.users.get(receiverId);

  if (receiverSocketId) {
    this.server.to(receiverSocketId).emit('user_typing', {
      senderId,
    });
  }
}
@SubscribeMessage('stop_typing')
handleStopTyping(@MessageBody() data: any) {
  const { senderId, receiverId } = data;

  const receiverSocketId = this.users.get(receiverId);

  if (receiverSocketId) {
    this.server.to(receiverSocketId).emit('user_stop_typing', {
      senderId,
    });
  }
}
// private broadcastOnlineUsers() {
//   const onlineUsers = Array.from(this.users.keys());

//   this.server.emit("online_users", onlineUsers);
// }

}