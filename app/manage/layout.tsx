import { ManageSidebar } from '@/components/Manage/ManageSidebar';
import { ManageNavbar } from '@/components/Manage/ManageNavbar';
import type { Metadata } from 'next'
import UserProvider from '../providers/UserProvider';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'next/navigation';
import { getAccessToken } from '../apiService/cookies';
import { apiService } from '../apiService/apiService';
import { TokenProvider } from '../providers/TokenProvider';

export const metadata: Metadata = {
   title: 'Trang quản lý',
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
const ManageLayout = async ({ children }: { children: React.ReactNode }) => {
   let user;
   try {
      const token = await getAccessToken();
      const response = await apiService.get('/user/me', {}, {
         Authorization: `Bearer ${token}`,
      });
      const data = await response.json();
      if (response.status !== StatusCodes.OK) {
         await fetch('/api/auth/logout', {
            method: "POST",
         });
         redirect('/auth/login');
      }
      user = mapUserResponse(data.user);
   } catch {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <span>Có lỗi phía server. Vui lòng thử lại sau</span>
         </div>
      );
   }
   return (
      <div className="flex h-screen w-screen flex-col text-sm text-black dark:text-white">
         <TokenProvider>
            <UserProvider user={user}>
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
         </TokenProvider>
      </div>
   );
}
export default ManageLayout;