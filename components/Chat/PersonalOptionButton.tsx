"use client"
import axiosInstance from "@/app/apiService/axios";
import { useUserStore } from "@/app/store/user.store";
import { errorToast, successToast } from "@/utils/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbUserEdit, TbLogout, TbUserCircle, TbChevronUp } from "react-icons/tb"

export const PersonalOptionButton: React.FC = () => {
   const router = useRouter();
   const { user, setUser } = useUserStore();
   const [openPersonal, setOpenPersonal] = useState<boolean>(false);
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
      localStorage.removeItem('user');
      successToast('Đăng xuất thành công.');
      router.push('/auth/login');
   }
   useEffect(()=>{
      const user = localStorage.getItem('user');
      if (user) {
         setUser(JSON.parse(user));
      }
   }, [setUser]);

   const toggleOpen = () => {
      setOpenPersonal((prev) => !prev);
   }
   return (
      <>
         <div className="relative inline-flex w-full">
            <button 
               type="button"
               onClick={toggleOpen}
               className="w-full mb-2 py-3 px-3 inline-flex items-center gap-x-2 text-sm text-[14px] rounded-md disabled:opacity-50 disabled:pointer-events-none bg-sb-white dark:bg-sb-black text-black hover:bg-gray-300 dark:hover:bg-neutral-700 dark:text-white hs-dropdown-open:bg-gray-300 hs-dropdown-open:dark:bg-neutral-700 ">
               <TbUserCircle size={20} />
               <span className="grow text-left">Cá nhân</span>
               <TbChevronUp size={22} className={`${openPersonal ? 'rotate-180':''}`} />
            </button>

            <div className={`${openPersonal?'opacity-100':'opacity-0'} absolute bottom-14 w-60 transition-[opacity,margin] z-10 bg-white shadow-md rounded-md p-2 dark:bg-neutral-800 border border-neutral-200 dark:border dark:border-neutral-700`}>
               <div className="text-center w-full gap-x-3.5 py-2 px-3 rounded-md text-sm text-neutral-700 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700">
                  {user.email}
               </div>
               <a href="/manage/" className="flex items-center w-full gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-gray-300 focus:outline-none focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                  <HiOutlineBuildingOffice2  size = {20}/> Trang quản lý tài liệu
               </a>
               <button className="flex items-center w-full gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-gray-300 focus:outline-none focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                  <TbUserEdit size={20} /> Thông tin cá nhân
               </button>
               <button
                  className="flex items-center w-full gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-gray-300 focus:outline-none focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  onClick={handleLogout}
               >
                  <TbLogout size={20} /> Đăng xuất
               </button>
            </div>
         </div>
      </>
   )
}