import { Message } from './message.model';

export interface Conversation {
  id: number;
  participants: string[];
  messages: Message[];
}
