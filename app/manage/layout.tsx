import { GroupSidebar } from '@/components/Manage/GroupSidebar';
import { GroupNavbar } from '@/components/Manage/GroupNavbar';
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Group management',
}
const GroupLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="flex h-screen w-screen flex-col text-sm text-black dark:text-white">
         <GroupNavbar />
         <div className="flex h-full w-full sm:pt-0">
            <GroupSidebar />
            <div className="flex flex-1">
               <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#212121]">
                  {children}
               </div>
            </div>
         </div>
      </div>
   );
}
export default GroupLayout;