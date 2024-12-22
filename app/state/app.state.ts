import { Conversation, Message } from "@/types/chat";
export type AppState = {
   isLoading: boolean;
   isSidebarOpen: boolean;
   messageIsStreaming: boolean;
   conversations: Conversation[];
   selectedConversation: Conversation;
   currentMessage: Message | undefined;
   messageError: boolean;
   searchTerm: string;
}
export const appInitState: AppState = {
   isLoading: false,
   isSidebarOpen: true,
   messageIsStreaming: false,
   conversations: [],
   selectedConversation: {
      id: "",
      messages: [],
      title: ""
   },
   currentMessage: undefined,
   messageError: false,
   searchTerm: "",
};