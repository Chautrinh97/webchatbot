import { Conversation, ConversationItem, Message } from "@/types/chat";
export type AppState = {
   isLoading: boolean;
   isSidebarOpen: boolean;
   conversations: ConversationItem[];
   messageIsStreaming: boolean;
   selectedConversation: Conversation;
   currentMessage: Message | undefined;
   messageError: boolean;
}
export const appInitState: AppState = {
   isLoading: false,
   isSidebarOpen: true,
   messageIsStreaming: false,
   conversations: [],
   selectedConversation: {
      id: 0,
      title: "",
      slug: '',
      messages: [],
   },
   currentMessage: undefined,
   messageError: false,
};