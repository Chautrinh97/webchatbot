"use client"
import Image from "next/image";
import icon from '../../app/icon.jpg';
import { useAppStore } from "@/app/store/app.store";
import { TbMenu2, TbUser } from "react-icons/tb";
import { ThemeToggle } from "../Others/ThemeToggle";
import Link from "next/link";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import { useUserStore } from "@/app/store/user.store";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { errorToast, successToast } from "@/utils/toast";
import axiosInstance from "@/app/apiService/axios";
import { useRouter } from "next/navigation";
import { StatusCodes } from "http-status-codes";
import { ManageAccountModal } from "../Auth/ManageAccountModal";

export const ManageNavbar = () => {
   const router = useRouter();
   const {
      state: { isSidebarOpen },
      dispatch,
   } = useAppStore();

   const handleToggleSidebar = () => {
      dispatch("isSidebarOpen", !isSidebarOpen);
   }
   const { user, setUser } = useUserStore();
   const accountModal = useDisclosure();

   const handleLogout = async () => {
      try {
         await axiosInstance.post(
            '/auth/logout', null,
            {
               withCredentials: true,
            }
         );
      } catch (error) {
         errorToast('Có lỗi xảy ra trong quá trình đăng xuất.');
         return;
      }
      await fetch('/api/auth/logout', {
         method: "POST",
      });
      successToast('Đăng xuất thành công.');
      router.push('/auth/login');
   }

   const fetchUser = async () => {
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
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.')
         return;
      }
   }

   const handleOpenModal = () => {
      try {
         fetchUser();
         accountModal.onOpen();
      } catch {
         errorToast('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
         return;
      }
   }

   return (
      <div className="fixed top-0 z-50 w-full bg-blue-600 border-b border-neutral-200 dark:border-gray-700">
         <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center justify-start rtl:justify-end">
                  <button
                     className="flex justify-center items-center h-7 w-7 sm:h-8 sm:w-8 rounded-md text-neutral-400 hover:text-black bg-gray-200 hover:bg-gray-100 dark:text-neutral-500 dark:hover:text-white dark:bg-neutral-300 dark:hover:bg-neutral-600"
                     onClick={handleToggleSidebar}
                     title="Đóng/Mở menu"
                  >
                     <TbMenu2 size={21} />
                  </button>
                  <Link href="/chat/" className="flex ms-2 md:me-24" title="Trở về trang chat" >
                     <Image priority={true} src={icon} alt="Logo image" width={35} height={30} className="hover:animate-bounceupdown rounded-full me-3" />
                     <span className="self-center text-xl font-semibold text-white sm:text-2xl whitespace-nowrap dark:text-white">Trang quản lý</span>
                  </Link>
               </div>
               <div className="flex justify-end items-center gap-3">
                  <ThemeToggle />
                  <Dropdown>
                     <DropdownTrigger>
                        <button
                           title="Tùy chọn"
                           className="flex justify-center items-center h-7 w-7 rounded-full text-white bg-black dark:bg-white dark:text-black">
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