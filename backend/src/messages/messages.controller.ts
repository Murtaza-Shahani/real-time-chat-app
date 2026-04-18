import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // ✅ GET conversation
  @Get(':otherUserId')
  getConversation(
    @Param('otherUserId') otherUserId: string,
    @Query('userId') userId: string,
  ) {
    return this.messagesService.getConversation(
      Number(userId),
      Number(otherUserId),
    );
  }
}