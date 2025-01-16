"use client"
import { useUserStore } from "@/app/store/user.store";
import { errorToast, successToast } from "@/utils/toast";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbUserEdit, TbUserCircle, TbChevronUp } from "react-icons/tb"
import { ManageAccountModal } from "../Auth/ManageAccountModal";

export const SidebarOptionButton: React.FC = () => {
   const router = useRouter();
   const { user } = useUserStore();
   const [openOption, setOpenOption] = useState<boolean>(false);
   const accountModal = useDisclosure();

   const handleLogout = async () => {
      try {
         await fetch('/api/auth/logout', {
            method: "POST",
         });
      } catch {
         errorToast('Có lỗi trong quá trình đăng xuất. Vui lòng thử lại sau');
         return;
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      successToast('Đăng xuất thành công.');
      router.push('/');
      return;
   }

   const handleOpenModal = () => {
      try {
         accountModal.onOpen();
      } catch {
         errorToast('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau');
         return;
      }
   }

   const toggleOpen = () => {
      setOpenOption((prev) => !prev);
   }

   return (
      <>
         <div className="relative inline-flex w-full">
            <Dropdown className="w-64 dark:bg-neutral-800">
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
               <DropdownMenu
                  aria-label="Option Actions"
                  disabledKeys={["email"]}>
                  <DropdownItem key="email"
                     className="text-center border-b border-gray-300 dark:border-neutral-500 rounded-none">
                     {user.fullName}
                  </DropdownItem>
                  <DropdownItem
                     className="py-2 my-1 hover:bg-gray-200 dark:hover:bg-neutral-700"
                     key="document_manage" href='/manage/document' startContent={<HiOutlineBuildingOffice2 size={20} />}>
                     Trang quản lý văn bản
                  </DropdownItem>
                  <DropdownItem
                     className="py-2 my-1 hover:bg-gray-200 dark:hover:bg-neutral-700"
                     key="account_manage" startContent={<TbUserEdit size={20} />} onPress={handleOpenModal}>
                     Quản lý tài khoản
                  </DropdownItem>
                  <DropdownItem
                     className="py-2 my-1 hover:bg-gray-200 dark:hover:bg-neutral-700"
                     key="log_out" startContent={<FaSignOutAlt size={20} />} onPress={handleLogout}>
                     Đăng xuất
                  </DropdownItem>
               </DropdownMenu>

            </Dropdown>
            <ManageAccountModal disClosure={accountModal} user={user} />
         </div>
      </>
   )
}