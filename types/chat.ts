export type Message = {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export type Conversation = {
  id: number;
  title: string;
  slug: string;
  messages: Message[];
}

export type ConversationItem = {
  id: number;
  title: string;
  slug: string;
}

export type ChatBody = {
  prompt: string;
}

export type Folder = {
  id: string;
  name: string;
}

export type DocumentProperty = {
  id: number;
  name: string;
  description: string;
}