"use client"
import Image from "next/image";
import icon from '../../app/icon_50.jpg';
import { useAppStore } from "@/app/store/app.store";
import { TbMenu2, TbUser } from "react-icons/tb";
import { ThemeToggle } from "../Others/ThemeToggle";
import Link from "next/link";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip, useDisclosure } from "@nextui-org/react";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { errorToast, successToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { ManageAccountModal } from "../Auth/ManageAccountModal";
import { apiService, apiServiceClient } from "@/app/apiService/apiService";

export const ManageNavbar = ({ user }: { user: any }) => {
   const router = useRouter();
   const {
      state: { isSidebarOpen },
      dispatch,
   } = useAppStore();

   const handleToggleSidebar = () => {
      dispatch("isSidebarOpen", !isSidebarOpen);
   }
   // const { user, setUser } = useUserStore();
   const accountModal = useDisclosure();

   const handleLogout = async () => {
      try {
         await apiServiceClient.post('/auth/logout');
      } catch (error) {
         errorToast('Có lỗi xảy ra trong quá trình đăng xuất');
         return;
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      await fetch('/api/auth/logout', {
         method: "POST",
      });
      successToast('Đăng xuất thành công.');
      router.refresh();
   }

   /*    const fetchUser = async () => {
         try {
            const response = await axiosInstance.get('/user/me', { withCredentials: true });
            if (response.status === StatusCodes.NOT_FOUND) {
               errorToast(`Không tồn tại người dùng này. Đang đăng xuất...`);
               await fetch('/api/auth/logout', {
                  method: "POST",
               });
               router.push('/');
               return;
            }
            setUser(response.data.user);
         } catch (error) {
            errorToast('Có lỗi xảy ra. Vui lòng thử lại sau')
            return;
         }
      } */

   const handleOpenModal = () => {
      try {
         // fetchUser();
         accountModal.onOpen();
      } catch {
         errorToast('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau');
         return;
      }
   }

   return (
      <div className="fixed top-0 z-50 w-full bg-blue-700 border-b border-neutral-200 dark:border-gray-700">
         <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center justify-start rtl:justify-end">
                  <Tooltip content={isSidebarOpen? 'Đóng menu':'Mở menu'} placement={'bottom-end'}>
                     <button
                        className="flex justify-center items-center h-7 w-7 sm:h-8 sm:w-8 rounded-md text-neutral-400 hover:text-black bg-gray-200 hover:bg-gray-100 dark:text-neutral-500 dark:hover:text-white dark:bg-neutral-300 dark:hover:bg-neutral-600"
                        onClick={handleToggleSidebar}>
                        <TbMenu2 size={21} />
                     </button>
                  </Tooltip>
                  <div className="flex gap-3 md:me-24">
                     <span className="ps-4 self-center text-xl font-semibold uppercase
                     text-white sm:text-2xl whitespace-nowrap dark:text-white">Hệ thống quản lý văn bản</span>
                  </div>
               </div>
               <div className="flex justify-end items-center gap-3">
                  <Link href='/chat' className="flex items-center gap-2 text-white">
                     Trở về
                     <Tooltip content='Trở về trang chat' placement={'bottom'}>
                        <Image
                           priority={true}
                           src={icon}
                           alt="Logo image"
                           width={35}
                           height={30}
                           className="hover:animate-bounceupdown rounded-full" />
                     </Tooltip>
                  </Link>
                  <ThemeToggle />
                  <Dropdown>
                     <DropdownTrigger>
                        <button
                           title="Tùy chọn"
                           className="flex justify-center items-center h-7 w-7 rounded-full text-black bg-white">
                           <TbUser size={20} />
                        </button>
                     </DropdownTrigger>
                     <DropdownMenu aria-label="Static Actions" disabledKeys={["email"]}>
                        <DropdownItem key="email" className="flex justify-start" showDivider>
                           <span>{user.fullName}</span>
                        </DropdownItem>
                        <DropdownItem key="account_manage" startContent={<FaUserGear size={20} />} onPress={handleOpenModal}>
                           Quản lý tài khoản
                        </DropdownItem>
                        <DropdownItem key="log_out" startContent={<FaSignOutAlt size={20} />} onPress={handleLogout}>
                           Đăng xuất
                        </DropdownItem>
                     </DropdownMenu>
                  </Dropdown>
                  <ManageAccountModal disClosure={accountModal} user={user} />
               </div>
            </div>
         </div>
      </div>
   )
};