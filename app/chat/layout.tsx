import { SideBar } from "@/components/Chat/SideBar";
import { ThemeToggle } from "@/components/Others/ThemeToggle";
import type { Metadata } from 'next'
import UserProvider from "../providers/UserProvider";
import { getAccessToken } from "../apiService/cookies";
import { apiService } from "../apiService/apiService";
import { TokenProvider } from "../providers/TokenProvider";
import { ConversationItem } from "@/types/chat";

export const metadata: Metadata = {
   title: 'Trang chatbot',
}

const mapUserResponse = (userData: any) => {
   return {
      userId: userData.userId,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      permissions: userData.permissions || [],
   };
};
const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
   let user;
   // let conversations: ConversationItem[];
   const token = await getAccessToken();
   try {
      const response = await apiService.get('/user/me', {}, {
         Authorization: `Bearer ${token}`,
      });
      const data = await response.json();
      user = mapUserResponse(data.user);
      /* const conversationResponse = await apiService.get('/conversation', {}, {
         Authorization: `Bearer ${token}`,
      });
      const conversationData = await conversationResponse.json(); 
      conversations = conversationData.data.map((conv: any) => ({
         id: conv.id,
         title: conv.title,
         slug: conv.slug,
      })); */
   } catch {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <span>Có lỗi phía server. Vui lòng thử lại sau</span>
         </div>
      );
   }

   return (
      <div className="flex h-screen w-screen flex-col text-sm text-black dark:text-white">
         <div className="relative flex h-full w-full sm:pt-0">
            <TokenProvider>
               <UserProvider user={user}>
                  <SideBar />
                  <div className="flex flex-1">
                     {children}
                  </div>
                  <div className="absolute top-2 right-4">
                     <ThemeToggle />
                  </div>
               </UserProvider>
            </TokenProvider>
         </div>
      </div>
   );
}
export default ChatLayout;