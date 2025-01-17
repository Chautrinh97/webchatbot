"use client"
import { useAppStore } from "@/app/store/app.store";
import Link from "next/link";
import { FaUsers } from "react-icons/fa6";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { FaLandmark, FaBriefcase, FaClipboard, FaUsersCog } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { useUserStore } from "@/app/store/user.store";
import { UserPermissionConstant, UserRoleConstant } from "@/utils/constant";
import { usePathname } from "next/navigation";

export const ManageSidebar = () => {
   const { state: { isSidebarOpen }, dispatch } = useAppStore();
   const handleToggleSidebar = () => {
      dispatch("isSidebarOpen", !isSidebarOpen);
   }
   const { user } = useUserStore();
   const hasPermission = (permissionTag: string) => {
      return user.permissions.some((permission: any) => permission === permissionTag);
   }

   const pathname = usePathname();
   const isActive = (path: string) => pathname === path;

   return (
      <>
         <aside className={`fixed top-0 left-0 h-full pt-[3.75rem] transition-all ease-in-out duration-200 bg-sb-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-600 sm:relative sm:top-0
      ${isSidebarOpen ? 'w-60 z-20 border-r' : 'w-0 z-10'}`} aria-label="Sidebar">
            <div className={`${!isSidebarOpen && 'hidden'} h-full pb-4 overflow-x-hidden`}>
               <ul className="space-y-2 font-medium">
                  <li>
                     <div className="mt-1 mb-2 py-2 ps-4 uppercase shadow-md bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 border border-gray-200 dark:border-blue-600  text-white">Quản lý văn bản</div>
                     <ul className="space-y-2">
                        <li>
                           <Link href="/manage/issuing-body"
                              className={`flex items-center px-3 py-2  group
                        ${isActive("/manage/issuing-body") ? "bg-gray-300 dark:bg-neutral-700" : "text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700"}`}>
                              <FaLandmark size={24} />
                              <span className="ms-3">Cơ quan ban hành</span>
                           </Link>
                        </li>
                        <li>
                           <Link href="/manage/document-field"
                              className={`flex items-center px-3 py-2  group 
                        ${isActive("/manage/document-field") ? "bg-gray-300 dark:bg-neutral-700" : "text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700"}`}>
                              <FaBriefcase size={24} />
                              <span className="ms-3">Lĩnh vực văn bản</span>
                           </Link>
                        </li>
                        <li>
                           <Link href="/manage/document-type"
                              className={`flex items-center px-3 py-2  group 
                        ${isActive("/manage/document-type") ? "bg-gray-300 dark:bg-neutral-700" : "text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700"}`}>
                              <FaClipboard size={24} />
                              <span className="ms-3">Loại văn bản</span>
                           </Link>
                        </li>
                        <li>
                           <Link href="/manage/document"
                              className={`flex items-center px-3 py-2  group 
                        ${isActive("/manage/document") ? "bg-gray-300 dark:bg-neutral-700" : "text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700"}`}>
                              <HiOutlineDocumentDuplicate size={24} />
                              <span className="ms-3">Văn bản</span>
                           </Link>
                        </li>

                        {(hasPermission(UserPermissionConstant.MANAGE_ALL_DOCUMENTS) ||
                           hasPermission(UserPermissionConstant.MANAGE_OWN_DOCUMENTS)) &&
                           <li>
                              <Link href="/manage/document-statistic" className={`flex items-center px-3 py-2  group 
                        ${isActive("/manage/document-statistic") ? "bg-gray-300 dark:bg-neutral-700" : "text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700"}`}>
                                 <IoIosStats size={24} />
                                 <span className="ms-3">Thống kê văn bản</span>
                              </Link>
                           </li>
                        }
                     </ul>
                  </li>
                  {hasPermission(UserPermissionConstant.MANAGE_USERS) &&
                     <li>
                        <div className="mb-2 mt-2 py-2 ps-4 uppercase shadow-md bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 border border-gray-200 dark:border-blue-600  text-white">Quản lý hệ thống</div>
                        <ul className="space-y-2">
                           < li >
                              <Link href="/manage/user"
                                 className={`flex items-center px-3 py-2  group 
                                       ${isActive("/manage/user") ? "bg-gray-300 dark:bg-neutral-700" : "text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700"}`}>
                                 <FaUsers size={24} />
                                 <span className="ms-3">Người dùng</span>
                              </Link>
                           </li>
                           {user.role === UserRoleConstant.SUPERADMIN &&
                              <li>
                                 <Link href="/manage/authority-group"
                                    className={`flex items-center px-3 py-2  group 
                                       ${isActive("/manage/authority-group") ? "bg-gray-300 dark:bg-neutral-700" : "text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700"}`}>
                                    <FaUsersCog size={24} />
                                    <span className="ms-3">Nhóm quyền người dùng</span>
                                 </Link>
                              </li>
                           }
                        </ul>
                     </li>
                  }
               </ul>
            </div>
         </aside >
         {isSidebarOpen && (
            <div
               onClick={handleToggleSidebar}
               className="fixed top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
            ></div>
         )
         }
      </>
   )
};