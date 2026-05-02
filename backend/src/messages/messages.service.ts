import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/messages.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}
  //save messages to dh
  async createMessage(data:CreateMessageDto){
    return this.prisma.message.create({
      data:{
      senderId: data.senderId,
      receiverId: data.receiverId,
      text: data.text,  
    }})
;

  }
  // ✅ 2. Get conversation between two users
  async getConversation(userId: number, otherUserId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
  async getConversations(currentUserId:number){
    const messages = await this.prisma.message.findMany({
      where:{
        OR:[
          {senderId:currentUserId},
          {receiverId:currentUserId}
        ]
      },
      orderBy:{
        createdAt:'desc'
      },
      include:{
        sender:true,
        receiver:true
      }
    })
    const map = new Map<number, any>();
    for(const msg of messages){
      const otherUser = msg.senderId=== currentUserId? msg.receiver:msg.sender;
      if(!map.has(otherUser.id)){
        map.set(otherUser.id,{
          userId:otherUser.id,
          name:otherUser.name,
          lastMessage:msg.text,
        lastMessageTime:msg.createdAt,
        unreadCount:0,
        })
      }
     // unread count
    if (
      msg.receiverId === currentUserId &&
      !msg.isRead &&
      msg.senderId === otherUser.id
    ) {
      map.get(otherUser.id).unreadCount += 1;
    }
  }

  return Array.from(map.values());
}
async markAsRead(currentUserId: number, otherUserId: number) {
  return this.prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      receiverId: currentUserId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}
}
