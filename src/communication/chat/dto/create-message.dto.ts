export class CreateMessageDto {
  chatId: string;
  senderId: string;
  content: string;
  timestamp?: Date; // Make timestamp optional as it defaults
}
