export * from './note';

export interface Note {
  _id: string;
  content: string;
  isPinned: boolean;
  created_at: string;
  last_updated: string;
}