export interface ChatMessage {
    _id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    chatId: string;
  }