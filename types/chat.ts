export type Message = {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
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