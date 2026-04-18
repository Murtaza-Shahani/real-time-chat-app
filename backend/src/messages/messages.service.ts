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
}
