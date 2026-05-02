import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}


 @Get('conversations')
   async getConversations(@GetUser() user: any) {
  console.log("User making request:", user);
  console.log("Fetching conversations for user:", user.userId);
  const conversations = await this.messagesService.getConversations(user.userId);
  console.log("Conversations fetched:", conversations);
  return conversations;
}


  // ✅ GET conversation
  @Get(':otherUserId')
  getConversation(
    @Param('otherUserId') otherUserId: string,
    @GetUser() user: any
  ) {
    return this.messagesService.getConversation(
      user.userId,
      Number(otherUserId),
    );
  }
 
}