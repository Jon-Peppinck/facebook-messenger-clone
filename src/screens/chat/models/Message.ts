export interface Message {
  id?: number;
  message: string;
  creatorId: number;
  conversationId?: number;
}
