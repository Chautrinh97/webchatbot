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

export type Department = {
  id: string;
  name: string;
}

export const enum PermissionLevelEnum {
  Full = "Full permission",
  DAAS = "Department and all childs",
  Only = "Only department",
}

export type DocumentProperty = {
  id: number;
  name: string;
  description: string;
}

export const displayPermission = (permissionLevel: string) => {
  if (permissionLevel === PermissionLevelEnum.Full) {
     return "Quản lý toàn bộ file";
  }
  else if (permissionLevel === PermissionLevelEnum.DAAS) {
     return "Quản lý file phòng ban và phòng ban con";
  }
  else {
     return "Quản lý file chỉ phòng ban";
  }
}