import { Conversation, Department, Message } from "@/types/chat";
export type AppState = {
   isLoading: boolean;
   isSidebarOpen: boolean;
   messageIsStreaming: boolean;
   departments: Department[];
   selectedDepartment: Department;  
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
   departments: [],
   selectedDepartment: {
      id: "", 
      name: "",
   },
};