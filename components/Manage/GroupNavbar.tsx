"use client"
import Image from "next/image";
import icon from '../../app/icon.jpg';
import { useAppStore } from "@/app/store/app.store";
import { TbMenu2, TbUser } from "react-icons/tb";
import { ThemeToggle } from "../Others/ThemeToggle";
import Link from "next/link";
export const GroupNavbar = () => {
   const {
      state: { isSidebarOpen },
      dispatch,
   } = useAppStore();
   const handleToggleSidebar = () => {
      dispatch("isSidebarOpen", !isSidebarOpen);
   }
   return (
      <div className="fixed top-0 z-50 w-full bg-gray-300 border-b border-neutral-200 dark:bg-gray-700 dark:border-gray-700">
         <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center justify-start rtl:justify-end">
                  <button
                     className="flex justify-center items-center h-7 w-7 sm:h-8 sm:w-8 rounded-md text-neutral-400 hover:text-black bg-gray-200 hover:bg-gray-100 dark:text-neutral-500 dark:hover:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
                     onClick={handleToggleSidebar}
                     title="Đóng/Mở"
                  >
                     <TbMenu2 size={21} />
                  </button>
                  <Link href="/chat/" className="flex ms-2 md:me-24" title="Trở về trang chat" >
                     <Image priority={true} src={icon} alt="Logo image" width={35} height={30} className="hover:animate-bounceupdown rounded-full me-3" />
                     <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Chatbot</span>
                  </Link>
               </div>
               <div className="flex justify-end items-center gap-3">
                  <ThemeToggle/>
                  <div>
                     <button className="flex justify-center items-center h-7 w-7 rounded-full text-white bg-black dark:bg-white dark:text-black">
                        <TbUser size ={20}/>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
};