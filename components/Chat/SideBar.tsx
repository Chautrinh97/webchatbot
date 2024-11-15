"use client"
import {
   TbFileExport,
   TbMistOff,
   TbArrowBarRight,
   TbArrowBarLeft,
   TbMessagePlus,
} from 'react-icons/tb';
import { useAppStore } from '@/app/store/app.store';
import { Search } from './Search';
import { useEffect, useRef  } from 'react';
import { PersonalOptionButton } from './PersonalOptionButton';
import { Conversations } from './Conversations';
import Link from 'next/link';

export const SideBar: React.FC = ({ }) => {
   const triggerPersonalOptionRef = useRef<HTMLDivElement>(null);

   const {
      state: {
         isSidebarOpen,
         searchTerm,
         conversations,
      },
      dispatch,
   } = useAppStore();

   const handleNewConversation = () => {
      dispatch("selectedConversation", {
         id: "",
         messages: [],
         title: ""
      });
   }

   const handleSearchChange = (searchTerm: string) => {
      dispatch('searchTerm', searchTerm);
   };

   const handleToggleSidebar = () => {
      dispatch('isSidebarOpen', !isSidebarOpen);
   };

   const handleExportFile = () => {

   }

   useEffect(() => {
      const handleMouseDown = (e: MouseEvent) => {
         if (!triggerPersonalOptionRef?.current?.contains(e.target as Node)) {
            window.addEventListener('mouseup', handleMouseUp);
         }
      };

      const handleMouseUp = (e: MouseEvent) => {
         window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousedown', handleMouseDown);

      return () => {
         window.removeEventListener('mousedown', handleMouseDown);
      };
   },);

   useEffect(() => {
      if (window.innerWidth < 640) {
         dispatch("isSidebarOpen", false);
      }
   }, [dispatch]);

   return (
      <>
         <div
            className={`fixed top-0 flex flex-col h-full dark:bg-sb-black transition-all ease-in-out duration-200 bg-sb-white text-black dark:text-white text-[14px] sm:relative sm:top-0
            ${isSidebarOpen ? 'w-[280px] z-20' : 'z-10 w-0'}`}>
            {isSidebarOpen && (
               <div className="h-full flex flex-col overflow-x-hidden px-2 space-y-2">
                  <div className="flex flex-col">
                     <button
                        className="flex justify-center mt-2 items-center h-7 w-7 sm:h-8 sm:w-8 rounded-md text-neutral-400 hover:text-black hover:bg-gray-300 dark:text-neutral-500 dark:hover:text-white dark:hover:bg-neutral-700"
                        onClick={handleToggleSidebar}
                        title="Đóng"
                     >
                        <TbArrowBarLeft size={21} />
                     </button>
                     <Link href="\chat"
                        onClick={handleNewConversation}
                        className="grow flex cursor-pointer select-none items-center gap-3 rounded-md p-3 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-neutral-700">
                        <TbMessagePlus size={18} /> Đoạn hội thoại mới
                     </Link>
                  </div>

                  <Search
                     searchTerm={searchTerm}
                     onChange={handleSearchChange}
                  />

                  <div className="flex-grow overflow-auto">
                     {conversations?.length > 0 ? (
                        <div
                           className="pt-2"
                        >
                           <Conversations conversations={conversations} />
                        </div>
                     ) : (
                        <div className="mt-8 select-none text-center text-black dark:text-white opacity-70">
                           <TbMistOff className="mx-auto mb-3" size={18} />
                           <span className="text-[14px] leading-normal">
                              Không có hội thoại nào
                           </span>
                        </div>
                     )}
                  </div>
                  <div className="flex flex-col items-center space-y-1 border-t border-neutral-300 dark:border-neutral-600 pt-1 text-sm">
                     <button
                        className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-black dark:text-white transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-neutral-700"
                        onClick={handleExportFile}
                     >
                        <div><TbFileExport size={18} /></div>
                        <span>Xuất dữ liệu hội thoại</span>
                     </button>
                     <PersonalOptionButton />
                  </div>
               </div>
            )}
         </div>
         {isSidebarOpen && (
            <div
               onClick={handleToggleSidebar}
               className="fixed top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
            ></div>
         )}
         {!isSidebarOpen && (
            <button
               className="fixed flex justify-center items-center top-3 left-2 z-50 h-7 w-7 rounded-md hover:bg-gray-300 text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white dark:hover:bg-neutral-700 sm:top-2 sm:left-2 sm:h-8 sm:w-8 "
               onClick={handleToggleSidebar}
               title="Mở"
            >
               <TbArrowBarRight size={21} />
            </button>
         )}
      </>
   )
}
