import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService], // ✅ Export to use in ChatGateway
})
export class MessagesModule {}
