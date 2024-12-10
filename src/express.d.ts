import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: {
      id: string;       // The user's unique ID
      email?: string;   // The user's email (optional)
      role?: string;    // The user's role (optional)
    };
  }
}
