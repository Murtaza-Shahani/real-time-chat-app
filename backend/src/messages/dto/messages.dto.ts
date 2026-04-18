import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 1, description: 'ID of the sender user' })
  @IsInt()
  senderId: number;

  @ApiProperty({ example: 2, description: 'ID of the receiver user' })
  @IsInt()
  receiverId: number;

  @ApiProperty({ example: 'Hello, how are you?', description: 'Message text content' })
  @IsString()
  @IsNotEmpty()
  text: string;
}