export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    profilePicUrl?: string;
  }
  
  export interface Message {
    _id: string;
    content: string;
    senderId: User;
    timestamp: Date;
  }
  
  export interface Chat {
    _id: string;
    users: User[];
    messages: Message[];
    isGroup: boolean;
    name?: string;
  }