"use client"
import { DepartmentIcon } from "@/app/assets/department";
import { useAppStore } from "@/app/store/app.store";
import Link from "next/link";
import { FaUsers } from "react-icons/fa6";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { PiOfficeChair } from 'react-icons/pi';

export const GroupSidebar = () => {
   const { state: { isSidebarOpen }, dispatch } = useAppStore();
   const handleToggleSidebar = () => {
      dispatch("isSidebarOpen", !isSidebarOpen);
   }
   return (
      <>
         <aside className={`fixed top-0 left-0 h-full pt-20 transition-all ease-in-out duration-200 bg-sb-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-600 sm:relative sm:top-0
      ${isSidebarOpen ? 'w-56 z-20 border-r' : 'w-0 z-10'}`} aria-label="Sidebar">
            <div className={`${!isSidebarOpen && 'hidden'} h-full px-3 pb-4 overflow-x-hidden`}>
               <ul className="space-y-2 font-medium">
                  <li>
                     <Link href="/group/department" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700 group">
                        <DepartmentIcon size={24} />
                        <span className="ms-3">Phòng ban</span>
                     </Link>
                  </li>
                  <li>
                     <Link href="/group/position" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700 group">
                        <PiOfficeChair size={24} />
                        <span className="ms-3">Chức danh</span>
                     </Link>
                  </li>
                  <li>
                     <Link href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700 group">
                        <FaUsers size={24} />
                        <span className="ms-3">Người dùng</span>
                     </Link>
                  </li>
                  <li>
                     <Link href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700 group">
                        <HiOutlineDocumentDuplicate size={24} />
                        <span className="ms-3">Tài liệu</span>
                     </Link>
                  </li>
               </ul>
            </div>
         </aside>
         {isSidebarOpen && (
            <div
               onClick={handleToggleSidebar}
               className="fixed top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
            ></div>
         )}
      </>
   )
};