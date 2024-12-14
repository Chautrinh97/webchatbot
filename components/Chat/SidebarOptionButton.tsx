"use client"
import axiosInstance from "@/app/apiService/axios";
import { useUserStore } from "@/app/store/user.store";
import { errorToast, successToast } from "@/utils/toast";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure, ModalContent, Modal, ModalBody, ModalHeader, Divider, Button, ModalFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbUserEdit, TbUserCircle, TbChevronUp, TbLogin } from "react-icons/tb"
import { ManageAccountModal } from "../Auth/ManageAccountModal";
import { StatusCodes } from "http-status-codes";

export const SidebarOptionButton: React.FC = () => {
   const router = useRouter();
   const { user, isLoggedIn, setUser } = useUserStore();
   const [openOption, setOpenOption] = useState<boolean>(false);
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
      router.push('/');
      return;
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
         } else if (response.status !== StatusCodes.OK) {
            errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
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

   const toggleOpen = () => {
      setOpenOption((prev) => !prev);
   }

   return (
      <>
         <div className="relative inline-flex w-full">
            <Dropdown className="w-64">
               <DropdownTrigger>
                  <button
                     type="button"
                     onClick={toggleOpen}
                     className="w-full mb-2 py-3 px-3 inline-flex items-center gap-x-2 text-sm text-[14px] rounded-md disabled:opacity-50 disabled:pointer-events-none bg-sb-white dark:bg-sb-black text-black hover:bg-gray-300 dark:hover:bg-neutral-700 dark:text-white hs-dropdown-open:bg-gray-300 hs-dropdown-open:dark:bg-neutral-700 ">
                     <TbUserCircle size={20} />
                     <span className="grow text-left">Tùy chọn</span>
                     <TbChevronUp size={22} className={`${openOption ? 'rotate-180' : ''}`} />
                  </button>
               </DropdownTrigger>
               {isLoggedIn ?
                  <>
                     <DropdownMenu
                        aria-label="Option Actions"
                        disabledKeys={["email"]}
                     >
                        <DropdownItem key="email" className="text-center">
                           {user.fullName}
                        </DropdownItem>
                        <DropdownItem key="document_manage" href='/manage/document' startContent={<HiOutlineBuildingOffice2 size={20} />}>
                           Trang quản lý tài liệu
                        </DropdownItem>
                        <DropdownItem key="account_manage" startContent={<TbUserEdit size={20}/>} onPress={handleOpenModal}>
                           Quản lý tài khoản
                        </DropdownItem>
                        <DropdownItem key="log_out" startContent={<FaSignOutAlt size={20} />} onPress={handleLogout}>
                           Đăng xuất
                        </DropdownItem>
                     </DropdownMenu>
                  </> : (
                     <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="document_manage" href='/manage/' startContent={<HiOutlineBuildingOffice2 size={20} />}>
                           Trang quản lý tài liệu
                        </DropdownItem>
                        <DropdownItem key="log_in" href='/auth/login/' startContent={<TbLogin size={20} />}>
                           Đăng nhập
                        </DropdownItem>
                     </DropdownMenu>
                  )}
            </Dropdown>
            <ManageAccountModal disClosure={accountModal} user={user}/>
         </div>
      </>
   )
}