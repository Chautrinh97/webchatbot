import { ManageSidebar } from '@/components/Manage/ManageSidebar';
import { ManageNavbar } from '@/components/Manage/ManageNavbar';
import type { Metadata } from 'next'
import UserProvider from '../providers/UserProvider';

export const metadata: Metadata = {
   title: 'Trang quản lý',
}
const ManageLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="flex h-screen w-screen flex-col text-sm text-black dark:text-white">
         <UserProvider>
            <ManageNavbar />
            <div className="flex h-full w-full">
               <ManageSidebar />
               <div className="flex flex-auto">
                  <div className="relative flex-auto overflow-auto bg-white dark:bg-[#212121]">
                     {children}
                  </div>
               </div>
            </div>
         </UserProvider>
      </div>
   );
}
export default ManageLayout;