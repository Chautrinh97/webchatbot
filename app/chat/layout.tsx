import { SideBar } from "@/components/Chat/SideBar";
import { ThemeToggle } from "@/components/Others/ThemeToggle";
import type { Metadata } from 'next'
import UserProvider from "../providers/UserProvider";

export const metadata: Metadata = {
   title: 'Chatbot',
}
const ChatLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="flex h-screen w-screen flex-col text-sm text-black dark:text-white">
         <div className="relative flex h-full w-full sm:pt-0">
            <UserProvider>
               <SideBar />
            </UserProvider>
            <div className="flex flex-1">
               {children}
            </div>
            <div className="absolute top-2 right-2">
               <ThemeToggle />
            </div>
         </div>
      </div>
   );
}
export default ChatLayout;